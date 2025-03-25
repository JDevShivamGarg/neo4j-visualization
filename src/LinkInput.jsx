import React, { useState } from "react";

const LinkInput = ({ addLink, graphData }) => {
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [relationship, setRelationship] = useState("");

  const handleAddLink = () => {
    addLink(source, target, relationship);
    setSource("");
    setTarget("");
    setRelationship("");
  };

  return (
    <div className="flex items-center space-x-4">
      <select
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="p-2 border rounded bg-gray-800 text-white"
      >
        <option value="" className="text-gray-400">Select Source</option>
        {graphData.nodes.map((node) => (
          <option key={node.id} value={node.id} className="text-gray-400">
            {node.id}
          </option>
        ))}
      </select>

      <select
  value={target}
  onChange={(e) => setTarget(e.target.value)}
  className="p-2 border rounded bg-gray-800 text-white"
>
  <option value="" className="text-gray-400">Select Target</option>
  {graphData.nodes.map((node) => (
    <option key={node.id} value={node.id} className="text-gray-400">
      {node.id}
    </option>
  ))}
</select>


      <input
        type="text"
        value={relationship}
        onChange={(e) => setRelationship(e.target.value)}
        placeholder="Relationship"
        className="p-2 border rounded bg-gray-800"
      />

      <button onClick={handleAddLink} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all shadow-lg hover:shadow-green-500/50">
        Add Link
      </button>
    </div>
  );
};

export default LinkInput;
