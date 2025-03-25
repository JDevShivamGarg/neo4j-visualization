import React from "react";

const GraphControls = ({ addNode, linkNodes }) => {
  return (
    <div className="flex space-x-4">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        onClick={addNode}
      >
        Add Node
      </button>
      <button
        className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
        onClick={linkNodes}
      >
        Link Nodes
      </button>
    </div>
  );
};

export default GraphControls;
