import { buildGraph, readGraphFile } from '../common'

export async function main() {
  const size = 100
  const graph = buildGraph(await readGraphFile(`./graph/${size}.graph`))
  const flattenGraph = new Float32Array(graph.flat())

  const adapter = (await navigator.gpu.requestAdapter()) as GPUAdapter
  const device = await adapter.requestDevice()

  const module = device.createShaderModule({
    label: 'dijkstra_shader',
    code: `
    @group(0) @binding(0) var<storage, read> graph: array<f32>; // the graph
    @group(0) @binding(1) var<storage, read_write> dist: array<f32>;
          
    @compute @workgroup_size(1) fn dijkstra(
      @builtin(global_invocation_id) gid: vec3<u32>
    ) {
      var size = ${size}u;
      var visited = array<bool, ${size}>();
      var minDist = f32(0x1.fffffep+127f); // infinity
      var minIndex = i32(-1);
    
      for (var i = 0u; i < u32(size); i++) {
        if (!visited[i] && dist[gid.x * size + i] <= minDist) {
          minDist = dist[gid.x * size + i];
          minIndex = i32(i);
        }
        if (minIndex == -1) {
          return;
        }
        visited[minIndex] = true;
        for (var j = 0u; j < u32(size); j++) {
          if (!visited[j] && graph[minIndex * i32(size) + i32(j)] != 0.0f) {
            dist[gid.x * size + j] = min(dist[gid.x * size + j], dist[i32(gid.x) * i32(size) + minIndex] + graph[minIndex * i32(size) + i32(j)]);
          }
        }
      }
    }
    `.trim(),
  })

  const pipeline = device.createComputePipeline({
    label: 'dijkstra',
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
  pass.dispatchWorkgroups(size)
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
