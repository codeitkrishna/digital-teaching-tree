import { getRootNode, immediateChildNodes} from "../data/mysql/queries.js";

function validateRequest(req) {

    if (req == null) {
        return {
            message: "invalid arguments"
        };
    } 
    
    if (req.query.id === '') {
        return {
            message: "invalid id"
        };
    }
}

function getNodesData(dbResult) {
    let data = [];
    for (let i = 0; i < dbResult.length; i ++) {
        console.log(dbResult[i]);
        let res = dbResult[i];
        data.push({
            id: res.id,
            title: res.name,
            hasChildren: res.rgt - res.lft != 1
        });
    }
    return data;
}

async function GetNodes(request) {
    
    let errMsg = validateRequest(request);
    if (errMsg) {
        return [400, errMsg];
    }

    console.log(request.query.id);
    let resp;
    if (request.query.id === '0') {
        resp = await getRootNode();
    } else {
        resp = await immediateChildNodes(request.query.id);
    }
    if (resp) {
        return [200, {
            data: getNodesData(resp)
        }];
    }

    return [500, {message:"something is wrong"}];
}


export {GetNodes};