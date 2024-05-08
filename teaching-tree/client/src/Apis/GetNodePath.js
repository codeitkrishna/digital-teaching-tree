async function GetNodePath(nodeID) {
    let resp = await fetch('http://127.0.0.1:5001/path?id='+nodeID);
    let data = await resp.json();
    return data
}

export default GetNodePath;