import React, { useContext, useState } from "react";
import {GetNodes, getCount, getPath} from "./Apis/GetNodes"; 
import { StateContext } from "./context";

function OnToggle(node, isOpen, setIsOpen) {
  if (!isOpen && node?.hasChildren) {
      GetNodes(node.id).then(
        (data) => {
          console.log(data);
          node.children = data;
          setIsOpen(!isOpen);
        }
      )
      return
    }
  setIsOpen(!isOpen);
}

function OnTreeNameClick(node, setNodeCount, setNodePath, setNodeId) {
  setNodeId(node.id);
  getCount(node.id).then(
    (data) => {
      console.log(data);
      setNodeCount(data);
    }
  )
  getPath(node.id).then(
    (data) => {
      console.log(data);
      setNodePath(data);
    }
  )
}

const TreeNode = ({ node}) => {
  const [isOpen, setIsOpen] = useState(node?.shouldExpand);

  const { nodeCount, setNodeCount } = useContext(StateContext);
  const { nodePath, setNodePath } = useContext(StateContext);
  const { nodeId, setNodeId } = useContext(StateContext);

  
  return (
    <div className="tree-node">
      {node?.hasChildren && (
        <button onClick={(event) => OnToggle(node, isOpen, (val)=>setIsOpen(val))} className="toggle-icon">
          {isOpen ? "↑" : "↓"}
        </button>
      )}
      {/* <button onClick={OnTreeNameClick}><span>{node.name}{node.count}</span></button> */}
      <span onClick={() => OnTreeNameClick(
          node, (val) => setNodeCount(val), (val) => setNodePath(val), (val) => setNodeId(val)
        )} class="node-name">{node.name}</span>
      {isOpen && <TreeView data={node?.children} />}
    </div>
  );
};

const TreeView = ({ data }) => {
  if (data == null) {
    return (
      <div className="tree-view"/>
    );
  }
  return (
    <div className="tree-view">
      {data.map((node) => (
        <TreeNode key={node.id} node={node}/>
      ))}
    </div>
  );
};

export default TreeView;