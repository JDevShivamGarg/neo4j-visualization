import React, { useState, useEffect } from "react";
import GraphCanvas from "./GraphCanvas";
import { fetchGraphData } from "./fetchGraphData";

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
      <GraphCanvas graphData={graphData} />  
  );
};

export default GraphContainer;
