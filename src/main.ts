import { buildGraph, readGraphFile, timeit } from './common'
import { dijkstra as dijkstraPureJS } from './purejs/dijkstra'
import { dijkstra as dijkstraWASM } from './wasm/pkg/wasm'

async function main() {
  const loop = 10
  const size = 100
  console.log(`loop = ${loop}; size = ${size}`)

  const graph = buildGraph(await readGraphFile(`./graph/${size}.graph`))
  const flattenGraph = new Float32Array(graph.flat())

  console.log('PureJS computing...')
  const timePureJS = await timeit(() => {
    for (let _ = 0; _ < loop; _++) {
      for (let i = 0; i < size; i++) {
        dijkstraPureJS(graph, i)
      }
    }
  })
  console.log('Avg Time', Number(timePureJS / loop).toFixed(2), 'ms')

  console.log('WASM computing...')
  const timeWASM = await timeit(() => {
    for (let _ = 0; _ < loop; _++) {
      for (let i = 0; i < size; i++) {
        dijkstraWASM(flattenGraph, size, i)
      }
    }
  })
  console.log('Avg Time', Number(timeWASM / loop).toFixed(2), 'ms')
}

main()
