import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
const nodeConfig = {
  Employee_PainPoint: { color: "#A52A2A", textKey: "name" },
  PreCustomerProduct: { color: "#00BFFF", textKey: "name" },
  PreCustomerChallenge: { color: "#FF4500", textKey: "name" },
  PreCustomerPainPoint: { color: "#8B0000", textKey: "name" },
  PreCustomerImpact: { color: "#B22222", textKey: "name" },
  VendorEvaluationTrigger: { color: "#9370DB", textKey: "name" },
  DecisionCriteria: { color: "#2E8B57", textKey: "name" },
  VendorRejectionReason: { color: "#FF0000", textKey: "name" },
  PostCustomerProduct: { color: "#20B2AA", textKey: "name" },
  ChallengesSolved: { color: "#008B8B", textKey: "name" },
  UseCase: { color: "#DAA520", textKey: "name" },
  MarketInsight: { color: "#CD5C5C", textKey: "insight" },
  Research: { color: "#6A5ACD", textKey: "research_content" },
  Company: { color: "#800080", textKey: "description" },
  Product: { color: "#008080", textKey: "name" },
  Client: { color: "#FF6347", textKey: "name" },
  Department: { color: "#4682B4", textKey: "department_name" },
  Employee: { color: "#228B22", textKey: "customer_name" },
  Company_Objective: { color: "#B8860B", textKey: "objective" },
  Company_Challenges: { color: "#8B0000", textKey: "challenges" },
  Department_Responsibility: { color: "#32CD32", textKey: "name" },
  Department_Objective: { color: "#DAA520", textKey: "objective" },
  Department_Goal: { color: "#1E90FF", textKey: "goal" },
  Department_Challenges: { color: "#FF69B4", textKey: "challenges" },
  Department_PainPoint: { color: "#DC143C", textKey: "name" },
  Employee_KPI: { color: "#4169E1", textKey: "name" },
  Employee_Responsibility: { color: "#32CD32", textKey: "name" },
  Employee_Objective: { color: "#8B4513", textKey: "objective" },
  Employee_Goal: { color: "#FF4500", textKey: "goal" },
  Employee_Challenges: { color: "#8B0000", textKey: "challenges" }
};
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
      .scaleExtent([0.1, 8]) // Allow zooming between 0.1x and 8x
      .on("zoom", (event) => {
        g.attr("transform", event.transform);

        // Get current zoom scale
        const scale = event.transform.k;

        // Show text and links only when zoom level is greater than 3
        d3.selectAll(".node-label")
          .style("opacity", scale > 0.3 ? 1 : 0);

        d3.selectAll(".link")
          .style("stroke-width", scale > 0.3 ? 3 : 0);
      });
    svg.call(zoom);
    const initialScale = 0.15;
    const centerX = width / 2;
    const centerY = height / 2;
    svg.call(zoom.transform, d3.zoomIdentity.translate(centerX, centerY).scale(initialScale));

    const nodeRadius = 80; 
    const padding = 35;

    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-50)) // Reduced repulsion
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("radial", d3.forceRadial(250, width / 2, height / 2)) // Circular positioning
      .force("collision", d3.forceCollide().radius(nodeRadius + padding)) // No overlaps
      .alpha(1) // Ensures proper force application
      .restart();


    const link = g.selectAll(".link")
      .data(graphData.links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke", "#00E5FF")
      .style("stroke-width", 3)
      .on("click", (event, d) => {
        setSelectedLink(d);
        setSelectedNode(null);
      })
      .style("stroke-width", 0);;

    const node = g.selectAll(".node")
      .data(graphData.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", d => 80)
      .attr("fill", d => nodeConfig[d.label]?.color || "#3B82F6")
      .style("stroke", "#fff")
      .style("stroke-width", 2)
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
      });

    // Add labels inside nodes
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
      .style("opacity", 0);;

    simulation.on("tick", () => {
      link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      node.attr("cx", d => d.x).attr("cy", d => d.y);
      nodeText.attr("x", d => d.x).attr("y", d => d.y);
    });

  }, [graphData]);

  return (
<div className="relative h-screen flex px-4"> {/* Full height container */}
  <svg ref={svgRef} className="w-full h-full"></svg>

  {selectedNode && (
    <div className="absolute right-0 bg-gray-900 px-4 shadow-lg rounded-md text-white w-64 h-screen">
      <h2 className="font-bold text-blue-400 text-center">{selectedNode.label}</h2>

      {/* Convert and Display Properties with Capitalized Keys */}
      {selectedNode.properties && Object.entries(selectedNode.properties).map(([key, value]) => (
        <p key={key} className="capitalize py-3">
          <strong>{key}:</strong> {typeof value === "object" && value.low !== undefined ? value.low : value}
        </p>
      ))}

      <button onClick={() => setSelectedNode(null)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded">Close</button>
    </div>
  )}

  {selectedLink && (
    <div className="absolute right-0 bg-gray-900 px-4 shadow-lg text-white w-64 h-screen">
      <h2 className="font-bold text-green-400 text-center">Relationship</h2>
      <p><strong>Type:</strong> {selectedLink.type}</p>
      <p><strong>Source:</strong> {selectedLink.source.label} (ID: {selectedLink.source.id})</p>
      <p><strong>Target:</strong> {selectedLink.target.label} (ID: {selectedLink.target.id})</p>

      {/* Convert and Display Relationship Properties */}
      {selectedLink.properties && Object.entries(selectedLink.properties).map(([key, value]) => (
        <p key={key}>
          <strong>{key}:</strong> {typeof value === "object" && value.low !== undefined ? value.low : value}
        </p>
      ))}

      <button onClick={() => setSelectedLink(null)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded">Close</button>
    </div>
  )}
</div>



  );
};

export default GraphCanvas;
