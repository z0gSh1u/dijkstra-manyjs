@group(0) @binding(0) var<storage, read> graph: array<f32>; // the graph
@group(0) @binding(1) var<storage, read_write> dist: array<f32>;
      
@compute @workgroup_size(1) fn dijkstra(
  @builtin(global_invocation_id) gid: vec3<u32>
) {
  var size = 100u;
  var visited = array<bool, 100>();
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