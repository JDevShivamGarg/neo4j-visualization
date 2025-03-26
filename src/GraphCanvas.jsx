import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

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
      .on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoom);
    const initialScale = 0.1;
    const centerX = width / 2;
    const centerY = height / 2;
    svg.call(zoom.transform, d3.zoomIdentity.translate(centerX, centerY).scale(initialScale));

    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(300))
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(80));

    const nodeConfig = {
      Employee_PainPoint: { color: "#A52A2A", size: 40, textKey: "name" },
      PreCustomerProduct: { color: "#00BFFF", size: 35, textKey: "name" },
      PreCustomerChallenge: { color: "#FF4500", size: 35, textKey: "name" },
      PreCustomerPainPoint: { color: "#8B0000", size: 35, textKey: "name" },
      PreCustomerImpact: { color: "#B22222", size: 35, textKey: "name" },
      VendorEvaluationTrigger: { color: "#9370DB", size: 35, textKey: "name" },
      DecisionCriteria: { color: "#2E8B57", size: 35, textKey: "name" },
      VendorRejectionReason: { color: "#FF0000", size: 35, textKey: "name" },
      PostCustomerProduct: { color: "#20B2AA", size: 35, textKey: "name" },
      ChallengesSolved: { color: "#008B8B", size: 35, textKey: "name" },
      UseCase: { color: "#DAA520", size: 35, textKey: "name" },
      MarketInsight: { color: "#CD5C5C", size: 35, textKey: "insight" },
      Research: { color: "#6A5ACD", size: 35, textKey: "research_content" },
      Company: { color: "#800080", size: 70, textKey: "description" },
      Product: { color: "#008080", size: 65, textKey: "name" },
      Client: { color: "#FF6347", size: 60, textKey: "name" },
      Department: { color: "#4682B4", size: 55, textKey: "department_name" },
      Employee: { color: "#228B22", size: 50, textKey: "customer_name" },
      Company_Objective: { color: "#B8860B", size: 50, textKey: "objective" },
      Company_Challenges: { color: "#8B0000", size: 50, textKey: "challenges" },
      Department_Responsibility: { color: "#32CD32", size: 45, textKey: "name" },
      Department_Objective: { color: "#DAA520", size: 45, textKey: "objective" },
      Department_Goal: { color: "#1E90FF", size: 45, textKey: "goal" }
    };

    const link = g.selectAll(".link")
      .data(graphData.links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke", "#00E5FF")
      .style("stroke-width", 3)
      .on("click", (event, d) => {
        setSelectedLink(d);
        setSelectedNode(null);
      });

    const node = g.selectAll(".node")
      .data(graphData.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", d => nodeConfig[d.label]?.size || 45)
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
      .attr("font-size", "16px")
      .attr("fill", "#fff")
      .text(d => {
        let labelKey = nodeConfig[d.label]?.textKey || "name";
        let text = d.properties[labelKey] || d.label;
        let maxLength = Math.floor((nodeConfig[d.label]?.size || 45) / 4);
        return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
      });

    simulation.on("tick", () => {
      link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      node.attr("cx", d => d.x).attr("cy", d => d.y);
      nodeText.attr("x", d => d.x).attr("y", d => d.y);
    });

  }, [graphData]);

  return (
    <div className="relative">
      <svg ref={svgRef} className="w-full h-full"></svg>

      {selectedNode && (
        <div className="absolute top-10 left-10 bg-white p-4 shadow-lg rounded-md text-black">
          <h2 className="font-bold text-blue-600">{selectedNode.label}</h2>

          {/* Convert and Display Properties */}
          {selectedNode.properties && Object.entries(selectedNode.properties).map(([key, value]) => (
            <p key={key}>
              <strong>{key}:</strong> {typeof value === "object" && value.low !== undefined ? value.low : value}
            </p>
          ))}

          <button onClick={() => setSelectedNode(null)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded">Close</button>
        </div>
      )}



      {selectedLink && (
        <div className="absolute top-10 right-10 bg-white p-4 shadow-lg rounded-md text-black">
          <h2 className="font-bold text-green-600">Relationship</h2>
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
