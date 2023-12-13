import { buildGraph, readGraphFile } from '../common'
import ShaderCode from './dijkstra.wgsl'

export async function main() {
  const size = 500
  const inf = 0
  const graph = buildGraph(await readGraphFile(`./graph/${size}.graph`))
  let flattenGraph = new Float32Array(graph.flat())
  flattenGraph = flattenGraph.map((v) => (v === Infinity ? inf : v))

  const adapter = (await navigator.gpu.requestAdapter()) as GPUAdapter
  const adapterInfo = await adapter.requestAdapterInfo()
  console.log(adapterInfo)

  const device = await adapter.requestDevice()

  const module = device.createShaderModule({
    label: 'dijkstra_shader',
    code: ShaderCode,
  })

  const pipeline = device.createComputePipeline({
    label: 'dijkstra_pipeline',
    layout: 'auto',
    compute: {
      module,
      entryPoint: 'dijkstra',
    },
  })

  const graphBuffer = device.createBuffer({
    label: 'graph_buffer',
    size: size * size * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  })

  device.queue.writeBuffer(
    graphBuffer,
    0,
    flattenGraph.buffer,
    flattenGraph.byteOffset,
    flattenGraph.byteLength
  )

  const distBuffer = device.createBuffer({
    label: 'dist_buffer',
    size: size * size * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  })

  const distReadBuffer = device.createBuffer({
    label: 'dist_read_buffer',
    size: size * size * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
  })

  const bindGroup = device.createBindGroup({
    label: 'dijkstra_bindGroup',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: graphBuffer } },
      { binding: 1, resource: { buffer: distBuffer } },
    ],
  })

  const encoder = device.createCommandEncoder()
  const pass = encoder.beginComputePass()
  pass.setPipeline(pipeline)
  pass.setBindGroup(0, bindGroup)
  pass.dispatchWorkgroups(100, 5, 1)
  pass.end()
  encoder.copyBufferToBuffer(
    distBuffer,
    0,
    distReadBuffer,
    0,
    size * size * Float32Array.BYTES_PER_ELEMENT
  )
  device.queue.submit([encoder.finish()])

  await device.queue.onSubmittedWorkDone()
  await distReadBuffer.mapAsync(GPUMapMode.READ)
  const result = new Float32Array(distReadBuffer.getMappedRange())

  console.log(result)
}
