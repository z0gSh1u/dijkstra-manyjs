@group(0) @binding(0) var<storage, read> graph: array<f32>;
@group(0) @binding(1) var<storage, read_write> dist: array<f32>;
      
@compute @workgroup_size(16, 1, 1) fn dijkstra(
  @builtin(global_invocation_id) gid: vec3<u32>,
  @builtin(num_workgroups) nw: vec3<u32>
) {
  var size = ##SIZE##u;

  var nodeId = gid.y * nw.x + gid.x; // not lid

  var visited = array<bool, ##SIZE##>();
  for (var i = 0u; i < size; i++) {
    visited[i] = false;
    dist[nodeId * size + i] = f32(1e+10); // Infinity
  }
  dist[nodeId * size + nodeId] = 0.0;

  for (var i = 0u; i < size; i++) {
    var minDist = f32(1e+10); // Infinity
    var minIndex = i32(-1);
    for (var j = 0u; j < size; j++) {
      if (!visited[j] && dist[nodeId * size + j] < minDist) {
        minDist = dist[nodeId * size + j];
        minIndex = i32(j);
      }
    }
    if (minIndex == -1) {
      break;
    }
    visited[minIndex] = true;
    for (var j = 0u; j < size; j++) {
      if (!visited[j] && graph[u32(minIndex) * size + j] != 0.0) {
        dist[nodeId * size + j] = min(dist[nodeId * size + j], 
          dist[nodeId * size + u32(minIndex)] + graph[u32(minIndex) * size + j]);
      }
    }  
  }
}