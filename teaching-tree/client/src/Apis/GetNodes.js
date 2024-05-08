import { Children } from "react";

export async function GetNodes(nodeID) {
    let resp = await fetch('http://127.0.0.1:5001/nodes?id='+nodeID);
    let jsonResp = await resp.json();
    let jsonData = jsonResp?.data;
    let data = [];
    for (let i = 0; i < jsonData.length; i++ ) {
        data.push(
            {
                id: jsonData[i].id,
                name: jsonData[i].title,
                hasChildren: jsonData[i].hasChildren,
            }
        )
    }
    return data;
}

export async function deleteNode(nodeID) {
    let resp = await fetch('http://127.0.0.1:5001/delete/node?id='+nodeID, { method: 'DELETE' });
    let data = await resp.json();
    return data 
}

export async function createChild(nodeID,newTitle) {
    let req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: newTitle,
            parentID: nodeID
        })
    }
    let resp = await fetch('http://127.0.0.1:5001/create/node', req);
    let data = await resp.json();
    return data 
}

export async function getCount(nodeID) {
    let resp = await fetch('http://127.0.0.1:5001/count?id='+nodeID);
    let data = await resp.json();
    console.log(data);
    return data.count;
}

export async function getPath(nodeID) {
    let resp = await fetch('http://127.0.0.1:5001/path?id='+nodeID);
    let data = await resp.json();
    console.log(data);
    return data.path; 
} 

export async function reorderChild(nodeID,newParentId) {
    let resp = await fetch('http://127.0.0.1:5001/reorder?id='+nodeID+"$"+newParentId);
    let data = await resp.json();
    return data 
}

export async function searchNodes(searchString) {
    let resp = await fetch('http://127.0.0.1:5001/search?searchString='+searchString);
    let jsonResp = await resp.json();
    return convertSearchResponseToClientResponse(jsonResp?.data);
}

function convertSearchResponseToClientResponse(data) {
    if (data == null || data.length == 0) {
        return [];
    }

    let resp = [];
    for (let i = 0; i < data.length; i++ ) {
        let respNode = {
            id: data[i].id,
            name: data[i].name,
            children: convertSearchResponseToClientResponse(data[i]?.children)
        };
        respNode.shouldExpand = respNode.children.length != 0;
        resp.push(respNode);
    }

    return resp
}

export default {GetNodes,deleteNode,createChild,getCount,getPath,reorderChild, searchNodes};