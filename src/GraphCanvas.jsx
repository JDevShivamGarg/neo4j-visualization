import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import nodeConfig from './graphConstants'

const GraphCanvas = ({ graphData }) => {
  const svgRef = useRef(null);
  const zoomRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);

  useEffect(() => {
    const width = 1200, height = 700;
    d3.select(svgRef.current).selectAll("*").remove();
  
    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);
    const g = svg.append("g");
    zoomRef.current = g;
  
    const zoom = d3.zoom()
      .scaleExtent([0.1, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        const scale = event.transform.k;
        d3.selectAll(".node-label").style("opacity", scale > 0.3 ? 1 : 0);
      });
  
    svg.call(zoom);
    const initialScale = 0.15;
    const centerX = width / 2;
    const centerY = height / 2;
    svg.call(zoom.transform, d3.zoomIdentity.translate(centerX, centerY).scale(initialScale));
  
    const nodeRadius = 80;
    const padding = 35;
  
    // Initially hide graph
    g.style("opacity", 0);
  
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-50))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("radial", d3.forceRadial(250, width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(nodeRadius + padding))
      .alpha(1)
      .restart();
  
    const link = g.selectAll(".link")
      .data(graphData.links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke", "#00E5FF")
      .style("stroke-width", 0)
      .style("opacity", 0);  // Keep hidden initially
  
    const node = g.selectAll(".node")
      .data(graphData.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", nodeRadius)
      .attr("fill", d => nodeConfig[d.label]?.color || "#3B82F6")
      .style("stroke", "#fff")
      .style("stroke-width", 2)
      .style("opacity", 0)  // Keep hidden initially
      .call(d3.drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      )
      .on("click", (event, d) => {
        setSelectedNode(d);
        setSelectedLink(null);
  
        // Hide all links first
        link.style("stroke-width", 0).style("opacity", 0);
  
        // Show only immediate links connected to the selected node
        link.filter(linkData => linkData.source.id === d.id || linkData.target.id === d.id)
          .style("stroke-width", 3)
          .style("opacity", 1);
      });
  
    const nodeText = g.selectAll(".node-label")
      .data(graphData.nodes)
      .enter().append("text")
      .attr("class", "node-label")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("font-size", "24px")
      .attr("fill", "#fff")
      .text(d => {
        let labelKey = nodeConfig[d.label]?.textKey || "name";
        let text = d.properties[labelKey] || d.label;
        let maxLength = Math.floor((nodeConfig[d.label]?.size || 45) / 4);
        return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
      })
      .style("opacity", 0); 
  
    simulation.on("tick", () => {
      link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      node.attr("cx", d => d.x).attr("cy", d => d.y);
      nodeText.attr("x", d => d.x).attr("y", d => d.y);
    });
  
    // Make graph visible only after layout stabilizes
    simulation.on("end", () => {
      g.transition().duration(500).style("opacity", 1);  // Smooth fade-in
      node.transition().duration(500).style("opacity", 1);
      nodeText.transition().duration(500).style("opacity", 0);
    });
  
  }, [graphData]);
  
  // Hide links again when no node is selected
  useEffect(() => {
    if (!selectedNode) {
      d3.select(svgRef.current).selectAll(".link")
        .style("stroke-width", 0)
        .style("opacity", 0);
    }
  }, [selectedNode]);
  

  return (
<div className="relative flex px-4">
  <svg ref={svgRef} className="w-full h-full"></svg>

  {selectedNode && (
    <div className=" absolute top-5 left-1/2 transform -translate-x-1/2 bg-gray-900/80 p-4 shadow-lg rounded-md text-white w-64">
      <h2 className="font-bold text-blue-400 text-center">{selectedNode.label}</h2>

      {/* Convert and Display Properties with Capitalized Keys */}
      {nodeConfig[selectedNode.label] && (
            <p className="capitalize py-3">
              
              {selectedNode.properties[nodeConfig[selectedNode.label].textKey] || "N/A"}
            </p>
          )}
      <div className="flex justify-center">
      <button onClick={() => setSelectedNode(null)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-center">Close</button>
    </div>
    </div>
  )}

  {selectedLink && (
    <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-gray-900/80 p-4  bg-gray-900 px-4 shadow-lg text-white w-64">
      <h2 className="font-bold text-green-400 text-center">Relationship</h2>
      <p className="capitalize py-3"><strong>Type:</strong> {selectedLink.type}</p>
      <p className="capitalize py-3"><strong>Source:</strong> {selectedLink.source.label} (ID: {selectedLink.source.id})</p>
      <p className="capitalize py-3"><strong>Target:</strong> {selectedLink.target.label} (ID: {selectedLink.target.id})</p>

      {/* Convert and Display Relationship Properties */}
      {selectedLink.properties && Object.entries(selectedLink.properties).map(([key, value]) => (
        <p key={key}>
          <strong>{key}:</strong> {typeof value === "object" && value.low !== undefined ? value.low : value}
        </p>
      ))}
      <div className="flex justify-center">
      <button onClick={() => setSelectedLink(null)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-center">Close</button>
    </div>
    </div>
  )}
</div>



  );
};

export default GraphCanvas;
