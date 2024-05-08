async function GetNodeCount(nodeID) {
    let resp = await fetch('http://127.0.0.1:5001/count?id='+nodeID);
    let data = await resp.json();
    return data
}

export default GetNodeCount;