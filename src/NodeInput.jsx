import React, { useState } from "react";

const NodeInput = ({ addNode }) => {
  const [nodeId, setNodeId] = useState("");
  const [nodeType, setNodeType] = useState("question");

  const handleAddNode = () => {
    addNode(nodeId, nodeType);
    setNodeId("");
  };

  return (
    <div className="flex items-center space-x-4">
      <input
        type="text"
        value={nodeId}
        onChange={(e) => setNodeId(e.target.value)}
        placeholder="Enter node ID"
        className="p-2 border rounded bg-gray-800"
      />
      <select
        value={nodeType}
        onChange={(e) => setNodeType(e.target.value)}
        className="p-2 border rounded bg-gray-800 text-white"
      >
        <option className="text-gray-400" value="user">User</option>
        <option className="text-gray-400" value="post">Post</option>
        <option className="text-gray-400" value="comment">Comment</option>
      </select>
      <button
        onClick={handleAddNode}
        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 transition-all shadow-lg hover:shadow-cyan-500/50"
      >
        Add Node
      </button>
    </div>
  );
};

export default NodeInput;
