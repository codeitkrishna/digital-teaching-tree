import { insertNodeToDB } from "../data/mysql/queries.js";
import { Node } from "../data/model/node.js"

function validateRequest(req) {

    if (req == null || req.body == null) {
        return {
            message: "body or request is null"
        };
    } 
    
    let body = req.body;
    if (body.title === '') {
        return {
            message: "title is empty"
        };
    }
    if (body.parentID === '') {
        return {
            message: "invalid parent directory"
        };
    }
}

async function CreateNode(request) {
    let errMsg = validateRequest(request);
    if (errMsg) {
        console.log(errMsg);
        return [400, errMsg];
    }

    let body = request.body;
    
    let node = new Node({'data': body.title})
    node.generateNewID();

    let resp = await insertNodeToDB(node, body.parentID);
    if (resp) {
        return [200, {message:"sucess"}];
    }

    return [500, {message:"something is wrong"}];
}

export {CreateNode};