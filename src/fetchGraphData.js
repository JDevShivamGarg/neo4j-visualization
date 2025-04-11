import neo4j from "neo4j-driver";

const URI = import.meta.env.VITE_URI;
const USER = import.meta.env.VITE_USER;
const PASSWORD = import.meta.env.VITE_PASSWORD;
const QUERY = import.meta.env.VITE_QUERY

export const fetchGraphData = async () => {
    const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    const session = driver.session();
  
    try {
      const result = await session.run(QUERY);
  
      return processNeo4jData(result.records);
    } catch (error) {
      console.error("Error fetching data from Neo4j:", error);
      return { nodes: [], links: [] };
    } finally {
      await session.close();
      await driver.close();
    }
  };
  
  const processNeo4jData = (records) => {
    const nodes = new Map();
    const links = [];
  
    records.forEach((record) => {
      const [node1, relationship, node2] = record._fields;
  
      // Assign color based on type
      const getNodeColor = (node) => {
        if (node.properties.company_name) return "#3B82F6"; // Blue for companies
        if (node.properties.client_id) return "#34D399"; // Green for clients
        return "#A0AEC0"; // Gray for others
      };
  
      // Add first node
      if (!nodes.has(node1.elementId)) {
        nodes.set(node1.elementId, {
          id: node1.elementId,
          label: node1.labels[0] || "Unknown",
          properties: node1.properties,
          color: getNodeColor(node1),
        });
      }
  
      // Add second node (if exists)
      if (node2 && !nodes.has(node2.elementId)) {
        nodes.set(node2.elementId, {
          id: node2.elementId,
          label: node2.labels[0] || "Unknown",
          properties: node2.properties,
          color: getNodeColor(node2),
        });
      }
  
      // Add link (relationship)
      if (relationship) {
        links.push({
          source: node1.elementId,
          target: node2.elementId,
          type: relationship.type,
        });
      }
    });
  
    return { nodes: Array.from(nodes.values()), links };
  };
  
