import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const GraphCanvas = ({ graphData }) => {
  const svgRef = useRef(null);
  const zoomRef = useRef(null);
  const zoomInstance = useRef(null);

  useEffect(() => {
    const width = 900, height = 700;

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG with zoomable group
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .classed("bg-gray-900 rounded-lg shadow-lg", true);

    // Create a group for all zoomable elements
    const g = svg.append("g");
    zoomRef.current = g;

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 8])
      .on("zoom", (event) => {
        zoomRef.current.attr("transform", event.transform);
      });

    zoomInstance.current = zoom;
    svg.call(zoom);

    // Force simulation with stronger centering
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(300))
      .force("charge", d3.forceManyBody().strength(-800))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));

    // Draw links
    const link = g.selectAll(".link")
      .data(graphData.links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke", "#00E5FF")
      .style("stroke-width", 3);

    // Draw nodes
    const node = g.selectAll(".node")
      .data(graphData.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 50)
      .attr("fill", d => d.group === "question" ? "#3B82F6" : d.group === "answer" ? "#10B981" : "#F59E0B")
      .style("stroke", "#fff")
      .style("stroke-width", 2)
      .style("filter", "drop-shadow(0px 0px 8px rgba(0, 255, 255, 0.8))")
      .call(drag(simulation));

    // Add labels to nodes
    const label = g.selectAll(".label")
      .data(graphData.nodes)
      .enter().append("text")
      .attr("class", "label")
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .classed("text-white text-lg font-semibold", true)
      .text(d => d.id);

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x).attr("y2", d => d.target.y);

      node.attr("cx", d => d.x).attr("cy", d => d.y);
      label.attr("x", d => d.x).attr("y", d => d.y);
    });

    function drag(simulation) {
      return d3.drag()
        .on("start", (event, d) => { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on("end", (event, d) => { if (!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; });
    }

    // Add zoom controls
    const controls = svg.append("g")
      .attr("class", "zoom-controls")
      .attr("transform", `translate(${width - 100}, 20)`);

    // Zoom in button
    controls.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 30)
      .attr("height", 30)
      .attr("rx", 5)
      .attr("fill", "rgba(0, 0, 0, 0.7)")
      .attr("stroke", "#00E5FF")
      .attr("stroke-width", 2)
      .on("click", () => {
        svg.transition().call(zoom.scaleBy, 1.2);
      });

    controls.append("text")
      .attr("x", 15)
      .attr("y", 18)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "20px")
      .text("+");

    // Zoom out button
    controls.append("rect")
      .attr("x", 40)
      .attr("y", 0)
      .attr("width", 30)
      .attr("height", 30)
      .attr("rx", 5)
      .attr("fill", "rgba(0, 0, 0, 0.7)")
      .attr("stroke", "#00E5FF")
      .attr("stroke-width", 2)
      .on("click", () => {
        svg.transition().call(zoom.scaleBy, 0.8);
      });

    controls.append("text")
      .attr("x", 55)
      .attr("y", 18)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "20px")
      .text("-");

    // Reset zoom button - FIXED
    const resetButton = controls.append("rect")
      .attr("x", 80)
      .attr("y", 0)
      .attr("width", 60)
      .attr("height", 30)
      .attr("rx", 5)
      .attr("fill", "rgba(0, 0, 0, 0.7)")
      .attr("stroke", "#00E5FF")
      .attr("stroke-width", 2)
      .on("click", () => {
        svg.transition()
          .duration(750)
          .call(zoom.transform, d3.zoomIdentity);
      });

    controls.append("text")
      .attr("x", 110)
      .attr("y", 18)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "14px")
      .text("Reset");

  }, [graphData]);

  return <svg ref={svgRef} className="w-full h-full"></svg>;
};

export default GraphCanvas;