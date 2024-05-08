import { deleteNodeFromDB } from "../data/mysql/queries.js";

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

async function DeleteNode(request) {
    let errMsg = validateRequest(request);
    if (errMsg) {
        console.log(errMsg);
        return [400, errMsg];
    }

    let resp = await deleteNodeFromDB(request.query.id);
    if (resp) {
        return [200, {message: "success"}]
    }

    return [500, {message:"something is wrong"}];
}

export {DeleteNode};