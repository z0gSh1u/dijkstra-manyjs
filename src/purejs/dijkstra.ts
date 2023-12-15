import { PriorityQueue } from '@datastructures-js/priority-queue'

/**
 * Dijkstra's algorithm with heap (priority queue) optimization.
 * O(V+ElogV)
 */
export function dijkstraHeapOptim(graph: number[][], start: number) {
  const size = graph.length
  const dist = new Array(size).fill(Infinity)
  const visited = new Array(size).fill(false)
  dist[start] = 0
  // Minimum priority queue for fast access to the closest node.
  const queue = new PriorityQueue<number>((a, b) => dist[a] - dist[b])
  queue.enqueue(start)
  while (!queue.isEmpty()) {
    const minIndex = queue.dequeue()
    if (visited[minIndex]) {
      continue
    }
    visited[minIndex] = true
    for (let j = 0; j < size; j++) {
      if (!visited[j] && graph[minIndex][j] !== Infinity) {
        dist[j] = Math.min(dist[j], dist[minIndex] + graph[minIndex][j])
        queue.enqueue(j)
      }
    }
  }
  return dist
}

/**
 * The most basic implementation of Dijkstra's algorithm without heap optimization.
 * O(V^2)
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
