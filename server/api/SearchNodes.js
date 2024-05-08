import { searchNodes } from "../data/mysql/queries.js";
import { Node } from "../data/model/node.js";
import { json } from "express";

function validateRequest(req) {

    if (req == null) {
        return {
            message: "invalid arguments"
        };
    } 
}

function findAndAddNodeToParent(rootNode, node) {

    for (let i = 0; i < rootNode.length; i++) {
        let possibleParent = rootNode[i];
        if (possibleParent.lft < node.lft && possibleParent.rgt > node.rgt) {
            let possibleParents = [];
            if (possibleParent.children != null && possibleParent.children.length > 0) {
                possibleParents = possibleParent.children;
            }
            possibleParent.children = findAndAddNodeToParent(possibleParents, node);
            return [possibleParent];
        }
    }

    rootNode.push(node);

    return rootNode
}

function convertTreeToApiResp(rootNode) {
    if (rootNode == null || rootNode.length == 0) {
        return []
    }

    let data = [];

    for (let i = 0; i < rootNode.length; i++) {
        let node = rootNode[i];
        let nodeData = {
                id: node.id,
                name: node.name
            };
        let children = convertTreeToApiResp(node.children);
        if (children.length != 0) {
            nodeData.children = children;
        }
        data.push(nodeData);
    }

    return data
}

function convertDBSearchRespToAPIResp(dbResp) {
    let treeRoot = [];
    
    for (let i = 0; i < dbResp.length; i++) {
        let dbNode = dbResp[i];
        treeRoot = findAndAddNodeToParent(treeRoot, dbNode);
    }

    let resp = convertTreeToApiResp(treeRoot);

    return resp
}

async function SearchNodes(request) {
    
    let err = validateRequest(request);
    if (err) {
        return [400, err]
    }

    console.log(request.query);

    let resp = await searchNodes(request.query.searchString);
    if (resp) {
        return [200, {
            data: convertDBSearchRespToAPIResp(resp)
        }];
    }

    return [500, "internal error"];

}

export {SearchNodes};