import { useEffect, useState } from "react";
import "./App.css";
import TreeView from "./tree-view";
import {GetNodes,deleteNode,createChild, getPath, getCount, reorderChild, searchNodes} from "./Apis/GetNodes";
import { StateContext } from "./context";
// import deleteNode from "./Apis/GetNodes";


/* This is the simplest tree */
export default function App() {
  
  const [nodesData, setNodesData] = useState();
  const [loaded, setLoaded] = useState(true);
  const [refrescount,setRefrescount] = useState(0);
  const [nodeId,setNodeId]=useState("")
  // const [parentNodeId,setParentNodeId]=useState("")
  const [newTitle,setNewTitle]=useState("")
  
  const [nodePath, setNodePath] = useState('');
  const [nodeCount, setNodeCount] = useState(0);

  function onDeleteNode(nodeID) {
    const resp = deleteNode(nodeID);
    resp.then(
      (data) => {
        setLoaded(true);
        setRefrescount((val)=>val+1);
      }
    );
  }

  function onCreateChild(nodeID, title) {
    const resp = createChild(nodeID, title);
    resp.then(
      (data) => {
        console.log(data);
        setLoaded(true);
        setRefrescount((val)=>val+1);
      }
    )
  }

  function onSearch(searchString) {
    if (searchString == "") {
      setRefrescount((val)=>val+1);
    }
    const resp = searchNodes(searchString);
    resp.then(
      (data) => {
        console.log(data);
        setNodesData(data);
      }
    )
  }
  
  
  useEffect(() => {
    GetNodes(0).then((data) => {
        setNodesData(data);
        setLoaded(false);
      });
  }, [refrescount])

  return (
      <div className="App">
        <section class="section">
          <input type = 'text' placeholder='Search in the tree...' onChange={(event) => onSearch(event.target.value)}/>
        </section>      
        
        <section class="section">
          <input type = 'text' placeholder='New Title' onChange={(event)=>setNewTitle(event.target.value)}/>
        </section>

        <section class="section">
          <button class="buttons" onClick={(event)=>onCreateChild(nodeId, newTitle)}>createChild</button>
          <button class="buttons" onClick={(event)=>onDeleteNode(nodeId)}>delete</button>
        </section> 
  
        {/* 
        ToDo: Did not have enough time to implement functionality to reorder nodes in file tree...

        <section class="section">
          <input type = 'text' placeholder='new Parent Id' onChange={(event)=>setParentNodeId(event.target.value)}/>
          <button onClick={(event)=>reorderChild(nodeId,parentNodeId)} class="buttons">reorder child parent</button>
        </section> */}
        
        <section class="section">
        {
          loaded ? 
            'Loading' 
          : 
          <StateContext.Provider value={{ nodeCount, setNodeCount, nodePath, setNodePath, nodeId, setNodeId }}>
            <TreeView data={nodesData}/>
          </StateContext.Provider>
        }
        </section>

        <section class="footer">
          <span>Path is {nodePath}</span>
          <span class = "right-footer">Total count is {nodeCount}</span>
        </section>
        
      </div>
    );
}