import neo4j from "neo4j-driver";

const URI = "neo4j+s://e3104a6e.databases.neo4j.io:7687";
const USER = import.meta.env.VITE_USER;
const PASSWORD = import.meta.env.VITE_PASSWORD;
const QUERY = import.meta.env.VITE_QUERY; // Store query separately for readability

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

  const getNodeColor = (node) => {
    if (!node || !node.properties) return "#A0AEC0"; // Default gray
    return node.properties.company_name
      ? "#3B82F6"
      : node.properties.client_id
      ? "#34D399"
      : "#A0AEC0";
  };

  for (const record of records) {
    const [node1, relationship, node2] = record._fields;

    if (node1 && !nodes.has(node1.elementId)) {
      nodes.set(node1.elementId, {
        id: node1.elementId,
        label: node1.labels?.[0] || "Unknown",
        properties: node1.properties,
        color: getNodeColor(node1),
      });
    }

    if (node2 && !nodes.has(node2.elementId)) {
      nodes.set(node2.elementId, {
        id: node2.elementId,
        label: node2.labels?.[0] || "Unknown",
        properties: node2.properties,
        color: getNodeColor(node2),
      });
    }

    if (relationship && node1 && node2) {
      links.push({
        source: node1.elementId,
        target: node2.elementId,
        type: relationship.type,
      });
    }
  }

  return { nodes: Array.from(nodes.values()), links };
};
