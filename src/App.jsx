import GraphContainer from "./GraphContainer";



function App() {

  return (
    <>
      <div className="min-h-screen flex flex-col text-white space-y-8 py-10 bg-gray-900">
        <h1 className="text-4xl font-bold text-center text-cyan-300 drop-shadow-md">
          Neo4j Graph Visualization
        </h1>
        <GraphContainer />
      </div>
    </>
  )
}

export default App
