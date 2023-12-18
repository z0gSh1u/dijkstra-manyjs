import { useEffect, useState } from 'react'
import ApproachBlock from './page/ApproachBlock'
import Header from './page/Header'
import {
  buildGraph,
  create2DArray,
  create2DFloat32Array,
  isAllClose,
  readGraphFile,
  timeit,
} from './common'
import { dijkstraHeapOptim, dijkstraNaive } from './purejs/dijkstra'
import { dijkstra as dijkstraWASM } from './wasm/pkg/wasm'
import {
  dijkstra as dijkstraWebGPU,
  getGPUAdapterInfo,
} from './webgpu/dijkstra'

function App() {
  const [graphSize, setGraphSize] = useState(100)
  let graph: number[][]

  const [gpuAdapterInfo, setGPUAdapterInfo] = useState<GPUAdapterInfo>()
  const [checks, setChecks] = useState([false, false, false])

  async function ensureGraph() {
    graph = buildGraph(await readGraphFile(`graph/${graphSize}.graph`))
  }

  useEffect(() => {
    ;(async () => {
      setGPUAdapterInfo(await getGPUAdapterInfo())
    })()
  }, [])

  const dists: { [k: string]: number[][] } = {
    'Pure JS Naive': [[]],
    'Pure JS Heap': [[]],
    WASM: [[]],
    WebGPU: [[]],
  }

  const approaches = [
    {
      name: 'Pure JS Naive',
      description: 'Pure JavaScript w/o Heap Optimization, O(V^2)',
      executor: async () => {
        await ensureGraph()
        const dist = create2DArray(graphSize)
        const { time } = await timeit(() => {
          for (let i = 0; i < graphSize; i++) {
            dist[i] = dijkstraNaive(graph, i)
          }
        })
        dists['Pure JS Naive'] = dist

        return { time, dist }
      },
    },
    {
      name: 'Pure JS Heap',
      description: 'Pure JavaScript w/ Heap Optimization, O(V + ElogV)',
      executor: async () => {
        await ensureGraph()
        const dist = create2DArray(graphSize)
        const { time } = await timeit(() => {
          for (let i = 0; i < graphSize; i++) {
            dist[i] = dijkstraHeapOptim(graph, i)
          }
        })
        dists['Pure JS Heap'] = dist

        return { time, dist }
      },
    },
    {
      name: 'WASM',
      description: 'Rust wasm_bindgen, O(V^2)',
      executor: async () => {
        await ensureGraph()
        const _dist = create2DFloat32Array(graphSize)
        const flattenGraph = new Float32Array(graph.flat())
        const { time } = await timeit(() => {
          for (let i = 0; i < graphSize; i++) {
            _dist[i] = dijkstraWASM(flattenGraph, graphSize, i)
          }
        })
        const dist = _dist.map((v) => Array.from(v))
        dists['WASM'] = dist

        return { time, dist }
      },
    },
    {
      name: 'WebGPU',
      description: 'Parallel, O(V^2)',
      executor: async () => {
        await ensureGraph()
        let _dist: Float32Array = new Float32Array()
        const { time } = await timeit(async () => {
          _dist = await dijkstraWebGPU(graph)
        })
        const dist: number[][] = []
        for (let i = 0; i < graphSize; i++) {
          dist.push(Array.from(_dist.slice(i * graphSize, (i + 1) * graphSize)))
        }
        dists['WebGPU'] = dist

        return { time, dist }
      },
    },
  ]

  function checkAllClose() {
    const baseline = dists['Pure JS Naive'].flat()
    const newChecks = checks.slice()
    for (const [name, dist] of Object.entries(dists)) {
      if (name === 'Pure JS Naive') {
        continue
      }
      const index = approaches.findIndex((v) => v.name == name) - 1
      newChecks[index] = isAllClose(baseline, dist.flat())
    }
    setChecks(newChecks)
  }

  return (
    <>
      <Header></Header>

      <div style={{ border: '1px solid gray', padding: '1em', margin: '1em' }}>
        <p>Please select a graph size</p>
        <select
          value={graphSize}
          onChange={(e) => setGraphSize(+e.target.value)}
        >
          <option value="100">100 Nodes</option>
          <option value="500">500 Nodes</option>
        </select>
      </div>

      {approaches.map((approach, index) => {
        return (
          <ApproachBlock
            key={index}
            name={approach.name}
            description={
              approach.description +
              (approach.name.includes('GPU')
                ? ` (Vendor: ${gpuAdapterInfo?.vendor ?? '...'}, Arch: ${
                    gpuAdapterInfo?.architecture ?? '...'
                  })`
                : '')
            }
            executor={approach.executor}
          ></ApproachBlock>
        )
      })}

      <div style={{ border: '1px solid gray', padding: '1em', margin: '1em' }}>
        <table border={1} style={{ marginBottom: '0.5em' }}>
          <thead></thead>
          <tbody>
            <tr>
              <td>
                <b>Method</b>
              </td>
              <td>Pure JS Naive</td>
              <td>Pure JS Heap</td>
              <td>WASM</td>
              <td>WebGPU</td>
            </tr>
            <tr>
              <td>
                <b>Correctness</b>
              </td>
              <td>Baseline</td>
              {checks.map((v, i) => (
                <td key={i}>{['❌', '✅'][+v]}</td>
              ))}
            </tr>
          </tbody>
        </table>

        <button onClick={checkAllClose}>Check all close</button>
      </div>

      <br />
    </>
  )
}

export default App
