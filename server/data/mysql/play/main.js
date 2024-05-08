import {Node} from "../../model/node.js"
import {deleteNodeFromDB, insertNodeToDB, retrieveNodePath, immediateChildNodes, searchNodes, countSubNodes, getRootNode}  from "../queries.js"

// let node = new Node({data: 'Computer Science'});
// node.generateNewID();
// console.log(node);

let result = await getRootNode();
console.log(result);

