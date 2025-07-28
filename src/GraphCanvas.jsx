import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const nodeConfig = {
  hub: { color: "#22D3EE", size: 90 },
  user: { color: "#3B82F6", size: 80 },
  post: { color: "#10B981", size: 80 },
  comment: { color: "#F59E0B", size: 70 },
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
      .scaleExtent([0.1, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        const scale = event.transform.k;
        d3.selectAll(".node-label").style("opacity", scale > 0.3 ? 1 : 0);
        d3.selectAll(".link").style("stroke-width", scale > 0.3 ? 3 : 0);
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
      .style("stroke-width", 3)
      .on("click", (event, d) => {
        setSelectedLink(d);
        setSelectedNode(null);
      })
      .style("stroke-width", 0);

    const node = g.selectAll(".node")
      .data(graphData.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", d => 80)
      .attr("fill", d => nodeConfig[d.group]?.color || "#3B82F6") 
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

    
    const nodeText = g.selectAll(".node-label")
      .data(graphData.nodes)
      .enter().append("text")
      .attr("class", "node-label")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("font-size", "24px")
      .attr("fill", "#fff")
      .text(d => {
        let maxLength = Math.floor((nodeConfig[d.group]?.size || 45) / 4);
        return d.id.length > maxLength ? d.id.slice(0, maxLength - 3) + "..." : d.id;
      })
      .style("opacity", 0);

    simulation.on("tick", () => {
      link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      node.attr("cx", d => d.x).attr("cy", d => d.y);
      nodeText.attr("x", d => d.x).attr("y", d => d.y);
    });

  }, [graphData]);

  return (
    <div className="relative h-screen flex  ">
      <svg ref={svgRef} className="w-full h-full"></svg>

      {selectedNode && (
        <div className="absolute right-0 bg-gray-900 px-4 shadow-lg rounded-md text-white w-64 h-screen">
          <h2 className="font-bold text-blue-400 text-center">{selectedNode.id}</h2>
          <p className="py-3">
            <strong>Type:</strong> {selectedNode.group}
          </p>
          <button onClick={() => setSelectedNode(null)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded">Close</button>
        </div>
      )}

      {selectedLink && (
        <div className="absolute right-0 bg-gray-900 px-4 shadow-lg text-white w-64 h-screen">
          <h2 className="font-bold text-green-400 text-center">Relationship</h2>
          <p><strong>Source:</strong> {selectedLink.source.id}</p>
          <p><strong>Type:</strong> {selectedLink.relationship}</p>
          <p><strong>Target:</strong> {selectedLink.target.id}</p>
          <button onClick={() => setSelectedLink(null)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded">Close</button>
        </div>
      )}
    </div>
  );
};

export default GraphCanvas;
