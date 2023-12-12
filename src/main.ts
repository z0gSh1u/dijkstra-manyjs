import { buildGraph, readGraphFile, timeit } from './common'
import { dijkstra as dijkstraPureJS } from './purejs/dijkstra'
import { dijkstra as dijkstraWASM } from './wasm/pkg/wasm'
// import G6 from '@antv/g6'

// function reformatGraph(graph: number[][]) {
//   const size = graph.length
//   const nodes = Array(size)
//     .fill(0)
//     .map((_, i) => ({ id: String(i) }))
//   const edges = []
//   for (let from = 0; from < size; from++) {
//     for (let to = 0; to < size; to++) {
//       if (graph[from][to] !== Infinity) {
//         edges.push({
//           source: String(from),
//           target: String(to),
//         })
//       }
//     }
//   }
//   return {
//     nodes,
//     edges,
//   }
// }

async function main() {
  const loop = 10
  const size = 100
  console.log(`loop = ${loop}; size = ${size}`)

  const graph = buildGraph(await readGraphFile(`./graph/${size}.graph`))
  const flattenGraph = new Float32Array(graph.flat())

  // const g6Data = reformatGraph(graph)
  // const g6Graph = new G6.Graph({
  //   container: 'graph-container',
  //   width: 1024,
  //   height: 1024,
  // })
  // g6Graph.data(g6Data)
  // g6Graph.render()

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
