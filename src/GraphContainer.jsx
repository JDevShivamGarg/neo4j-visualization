import React, { useState } from "react";
import GraphCanvas from "./GraphCanvas";
import NodeInput from "./NodeInput";
import LinkInput from "./LinkInput";

const initialGraphData = {
    nodes: [
      { id: "Central Node", group: "hub" },
  
      // Users
      { id: "User 1", group: "user" }, { id: "User 2", group: "user" },
      { id: "User 3", group: "user" }, { id: "User 4", group: "user" },
      { id: "User 5", group: "user" },
  
      // Posts
      { id: "Post A", group: "post" }, { id: "Post B", group: "post" },
      { id: "Post C", group: "post" }, { id: "Post D", group: "post" },
      { id: "Post E", group: "post" },
  
      // Comments
      { id: "Comment 1", group: "comment" }, { id: "Comment 2", group: "comment" },
      { id: "Comment 3", group: "comment" }, { id: "Comment 4", group: "comment" },
      { id: "Comment 5", group: "comment" },
    ],
    
    links: [
      // The Central Node connects to everyone
      { source: "Central Node", target: "User 1", relationship: "connected_to" },
      { source: "Central Node", target: "User 2", relationship: "connected_to" },
      { source: "Central Node", target: "User 3", relationship: "connected_to" },
      { source: "Central Node", target: "User 4", relationship: "connected_to" },
      { source: "Central Node", target: "User 5", relationship: "connected_to" },
      { source: "Central Node", target: "Post A", relationship: "linked_to" },
      { source: "Central Node", target: "Post B", relationship: "linked_to" },
      { source: "Central Node", target: "Post C", relationship: "linked_to" },
      { source: "Central Node", target: "Comment 1", relationship: "linked_to" },
  
      // Users create posts
      { source: "User 1", target: "Post A", relationship: "created" },
      { source: "User 2", target: "Post B", relationship: "created" },
      { source: "User 3", target: "Post C", relationship: "created" },
      { source: "User 4", target: "Post D", relationship: "created" },
      { source: "User 5", target: "Post E", relationship: "created" },
  
      // Users comment on posts
      { source: "User 1", target: "Comment 1", relationship: "commented_on" },
      { source: "User 2", target: "Comment 2", relationship: "commented_on" },
      { source: "User 3", target: "Comment 3", relationship: "commented_on" },
      { source: "User 4", target: "Comment 4", relationship: "commented_on" },
      { source: "User 5", target: "Comment 5", relationship: "commented_on" },
  
      // Users like posts
      { source: "User 1", target: "Post B", relationship: "liked" },
      { source: "User 2", target: "Post C", relationship: "liked" },
      { source: "User 3", target: "Post D", relationship: "liked" },
      { source: "User 4", target: "Post E", relationship: "liked" },
      { source: "User 5", target: "Post A", relationship: "liked" },
  
      // Users follow each other
      { source: "User 1", target: "User 2", relationship: "follows" },
      { source: "User 2", target: "User 3", relationship: "follows" },
      { source: "User 3", target: "User 4", relationship: "follows" },
      { source: "User 4", target: "User 5", relationship: "follows" },
      { source: "User 5", target: "User 1", relationship: "follows" },
    ]
  };

  
  const GraphContainer = () => {
    const [graphData, setGraphData] = useState(initialGraphData);
  
    const addNode = (nodeId, nodeType) => {
      if (!nodeId.trim()) return;
      setGraphData((prev) => ({
        ...prev,
        nodes: [...prev.nodes, { id: nodeId, group: nodeType }],
      }));
    };
  
    const addLink = (source, target, relationship) => {
      if (!source.trim() || !target.trim() || !relationship.trim()) return;
      setGraphData((prev) => ({
        ...prev,
        links: [...prev.links, { source, target, relationship }],
      }));
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center text-white space-y-8 p-10">
        <h1 className="text-4xl font-bold text-center text-cyan-300 drop-shadow-md">
          Neo4j Graph Visualization
        </h1>
  
        {/* Form Section */}
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl space-y-6 w-full max-w-2xl">
          
          {/* Add Node Section */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-cyan-400">Add Node</h2>
            <NodeInput addNode={addNode} />
          </div>
  
          {/* Divider */}
          <div className="border-t border-gray-600 my-4"></div>
  
          {/* Add Link Section */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-cyan-400">Add Link</h2>
            {/* Pass updated graphData.nodes to LinkInput */}
            <LinkInput addLink={addLink} graphData={graphData} />
          </div>
        </div>
  
        <GraphCanvas graphData={graphData} />
      </div>
    );
  };
  
  export default GraphContainer;
