import React, { useState, useEffect } from "react";
import GraphCanvas from "./GraphCanvas";
import { fetchGraphData } from "./fetchGraphData";
import Sidebar from "./Sidebar";

const GraphContainer = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    const loadGraph = async () => {
      const data = await fetchGraphData();
      setGraphData(data);
    };

    loadGraph();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white space-y-8 p-10 bg-gray-900">
      <div className="flex">

      <h1 className="text-4xl font-bold text-center text-cyan-300 drop-shadow-md">
        Neo4j Graph Visualization
      </h1>    
      </div>
      <GraphCanvas graphData={graphData} />
    </div>
  );
};

export default GraphContainer;
