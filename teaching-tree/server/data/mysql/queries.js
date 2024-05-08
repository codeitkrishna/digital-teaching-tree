import { Conn } from './connection.js';

function insertNodeToDB(newNode, parentNodeID) {

    // console.log(newNode, parentNodeID);

    if (Conn == null) {
        throw new Error("connection is null")
    }

    if (parentNodeID == '' ) {
        // ToDo: Create functions to reduce these type of calls
        return new Promise((resolve, reject) => {
            Conn.query("INSERT INTO nested_set_nodes(id, name, lft, rgt) VALUES (?, ?, ?, ?)", [newNode.id, newNode.data, 1, 2], 
            function(err, results) {
                console.log(err, results);
                if (err) {
                    return reject(err);
                }
                console.log("reaching here");
                return resolve(newNode.id);
            })
        })
    }

    return new Promise((resolve, reject) => {
        Conn.query("select lft, depth from  nested_set_nodes where id = ?", [parentNodeID], function(err, results) {
            if (err) {
                return reject(err);
            }
            
            console.log(results);
            let minLft = 0;
            let depth = 0;
            if (results.length > 0) {
                minLft = results[0].lft;
                depth = results[0].depth;
            } else {
                return reject(new Error("results empty for given parent id"));
            }

            let updateRgt = new Promise((resolve, reject) => {
                Conn.query("UPDATE nested_set_nodes SET rgt = rgt + 2 WHERE rgt > ?", [minLft], function(err, results) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                })
            })
        
            let updateLft = new Promise((resolve, reject) => {
                Conn.query("UPDATE nested_set_nodes SET lft = lft + 2 WHERE lft > ?", [minLft], function(err, results) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                })
            })

            let insertNode = new Promise((resolve, reject) => {
                Conn.query("INSERT INTO nested_set_nodes(id, name, lft, rgt, depth) VALUES (?, ?, ?, ?, ?)", [newNode.id, newNode.data, minLft + 1, minLft + 2, depth + 1], 
                function(err, results) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(newNode.id);
                })
            })

            Promise.all([updateRgt, updateLft, insertNode]).then(
                (result) => {
                    console.log(result);
                    return resolve(newNode.id);
                },
                (error) => {
                    console.log(error);
                    return reject(error);
                }
            )
        })

    })

    
}

function deleteNodeFromDB(nodeID){
    if (Conn == null) {
        throw new Error("connection is null")
    }

    return new Promise((resolve, reject) => {

        Conn.query("SELECT lft, rgt FROM nested_set_nodes WHERE id = ?", [nodeID], function(err, results) {
            if (err) {
                return reject(err);
            }
            if (results.length == 0) {
                return reject(new Error("Node does not exist"));
            }
        
            let currNodeLeft = results[0].lft;
            let currNodeRight = results[0].rgt;
            let width = currNodeRight - currNodeLeft + 1;
            
            console.log(currNodeLeft, currNodeRight, width);
            
            let deletePromise = new Promise((resolve, reject) => {
                Conn.query("DELETE FROM nested_set_nodes WHERE lft BETWEEN ? AND ?", [currNodeLeft, currNodeRight], function(err, results) {
                    if (err) {
                        return reject(err);
                    }
                    console.log("delete query:", results.affectedRows);
                    return resolve(results);
                })
            })
            
            let updateRgtPromise = new Promise((resolve, reject) => {
                Conn.query("UPDATE nested_set_nodes SET rgt = rgt - ? WHERE rgt > ?", [width, currNodeRight], function(err, results) {
                    if (err) {
                        return reject(err);
                    }
                    console.log("update rgt query:", results.affectedRows);
                    return resolve(results);
                }) 
            })
    
            let updateLftPromise = new Promise((resolve, reject) => {
                Conn.query("UPDATE nested_set_nodes SET lft = lft - ? WHERE lft > ?", [width, currNodeRight], function(err, results) {
                    if (err) {
                        return reject(err);
                    }
                    console.log("update lft query:", results.affectedRows);
                    return resolve(results);
                })
            })

            Promise.all([deletePromise, updateRgtPromise, updateLftPromise]).then(
                (result) => {
                    return resolve(result);
                },
                (error) => {
                    return reject(err);
                }
            )
        })     
    })
}

function retrieveNodePath(nodeID){
    if (Conn == null){
        throw new Error("connection is null")
    }

    return new Promise((resolve,reject) =>{
        Conn.query("SELECT parent.name FROM nested_set_nodes AS parent, nested_set_nodes AS child WHERE child.lft BETWEEN parent.lft AND parent.rgt and child.id = ? ORDER by parent.lft", [nodeID], function(err, results){
            if(err){
                throw err;
            }
            return resolve(results);
        })
    })
}

// export function updateNodeData(node, newData){
//     if (Conn == null){
//         throw new Error("Connection is null")
//     }

//     return new Promise((resolve,reject) => {
//         Conn.query("UPDATE nested_set_nodes SET name = ? WHERE id = ?",[newData, node.id], function(err, results){
//             if(err){
//                 throw err;
//             }
//             return resolve(results);
//         })
//     })
// }

function getRootNode() {
    console.log("entered");
    if (Conn == null) {
        throw new Error("Connection is null");
    }
    console.log("passing through");

    return new Promise((resolve, reject) => {
        Conn.query("SELECT id, name, lft, rgt FROM nested_set_nodes WHERE depth = 0", function(err, results){
            if (err) {
                return reject(err);
            }
            console.log(results);
            return resolve(results);
        })
    })
}

function immediateChildNodes(nodeID){
    if (Conn == null){
        throw new Error("Connection is null");
    }

    return new Promise((resolve,reject) => {
        Conn.query("SELECT child.id, child.name, child.lft, child.rgt \
                    FROM nested_set_nodes as parent, nested_set_nodes as child \
                    WHERE \
                        child.depth = parent.depth + 1 AND \
                        child.lft > parent.lft AND child.rgt < parent.rgt AND \
                        parent.id = ?",[nodeID], function(err, results){
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

function searchNodes(searchString){
    if (Conn == null){
        throw new Error("Connection is null")
    }

    return new Promise((resolve, reject) => {
        Conn.query("SELECT node.id, node.name, node.lft, node.rgt FROM nested_set_nodes AS node WHERE node.name LIKE ?", ['%' + searchString + '%'], function(err,result){
            if (err){
                throw err;
            }
            return resolve(result);
        })
    })
}

function countSubNodes(nodeID){
    if (Conn == null){
        throw new Error("Connection is null")
    }

    return new Promise((resolve,reject) =>{
        Conn.query("SELECT COUNT(child.id) count FROM nested_set_nodes as parent, nested_set_nodes as child \
                    WHERE parent.id = ? AND child.lft > parent.lft AND child.rgt < parent.rgt",[nodeID], function(err, results){
            if (err){
                throw err;
            }
            return resolve(results);
        })
    })
   
}





export { 
    insertNodeToDB, 
    deleteNodeFromDB, 
    retrieveNodePath,
    immediateChildNodes,
    searchNodes,
    countSubNodes,
    getRootNode
};