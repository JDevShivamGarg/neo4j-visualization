import { useState } from 'react'

import GraphContainer from "./GraphContainer";



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <GraphContainer />
    </div>
    </>
  )
}

export default App
