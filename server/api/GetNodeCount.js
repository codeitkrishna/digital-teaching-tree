import { countSubNodes } from "../data/mysql/queries.js";

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

async function GetNodeCount(request) {
    let errMsg = validateRequest(request);
    if (errMsg) {
        console.log(errMsg);
        return [400, errMsg];
    }

    let resp = await countSubNodes(request.query.id);
    if (resp) {
        let count = 0;
        if (resp.length > 0) {
            count = resp[0].count;
        }
        return [200, {
            count: count
        }]
    }

    return [500, {message:"something is wrong"}];
}

export {GetNodeCount};