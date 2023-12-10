/**
 * The most basic implementation of Dijkstra's algorithm.
 * O(n^2) without heap optimization.
 */
export function dijkstra(graph: number[][], start: number) {
  const size = graph.length
  const dist = new Array(size).fill(Infinity)
  const visited = new Array(size).fill(false)
  dist[start] = 0
  for (let i = 0; i < size; i++) {
    // Find the node with the minimum distance.
    let minDist = Infinity,
      minIndex = -1
    for (let j = 0; j < size; j++) {
      if (!visited[j] && dist[j] < minDist) {
        minDist = dist[j]
        minIndex = j
      }
    }
    if (minIndex === -1) {
      break
    }
    visited[minIndex] = true
    // Relax the distance of all the adjacent nodes.
    for (let j = 0; j < size; j++) {
      if (!visited[j] && graph[minIndex][j] !== Infinity) {
        dist[j] = Math.min(dist[j], dist[minIndex] + graph[minIndex][j])
      }
    }
  }
  return dist
}
