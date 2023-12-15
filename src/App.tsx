import ApproachBlock from './page/ApproachBlock'
import Header from './page/Header'

function App() {
  const approaches = [
    {
      name: 'Pure JS',
      description: 'Pure JavaScript w/o Heap Optimization, O(V^2)',
      executor: () => ({ time: 0, dist: [[]] }),
    },
    {
      name: 'Pure JS Heap',
      description: 'Pure JavaScript w/ Heap Optimization, O(V + ElogV)',
      executor: () => ({ time: 0, dist: [[]] }),
    },
    {
      name: 'WASM',
      description: 'Rust wasm_bindgen, O(V^2)',
      executor: () => ({ time: 0, dist: [[]] }),
    },
    {
      name: 'WebGPU',
      description: 'Parallel, O(V^2)',
      executor: () => ({ time: 0, dist: [[]] }),
    },
  ]

  return (
    <>
      <Header></Header>
      <p>Select a graph size</p>
      <select>
        <option value="100">100 Nodes</option>
        <option value="500">500 Nodes</option>
      </select>

      {approaches.map((approach, index) => {
        return (
          <ApproachBlock
            key={index}
            name={approach.name}
            description={approach.description}
            executor={approach.executor}
          ></ApproachBlock>
        )
      })}
      <button>Check all close</button>
    </>
  )
}

export default App
