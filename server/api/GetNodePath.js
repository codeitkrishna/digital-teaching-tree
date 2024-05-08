import { retrieveNodePath } from "../data/mysql/queries.js";

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

async function GetNodePath(request) {
    let errMsg = validateRequest(request);
    if (errMsg) {
        console.log(errMsg);
        return [400, errMsg];
    }

    let resp = await retrieveNodePath(request.query.id);
    if (resp) {
        console.log(resp);
        let path = '';
        for (let i = 0; i < resp.length; i++) {
            path += '/' + resp[i].name;
        }
        path += '/';
        return [200, {
            'path': path
        }];
    }

    return [500, {message:"something is wrong"}];
}

export {GetNodePath};