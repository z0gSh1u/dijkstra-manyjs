// This is the implementation of Dijkstra's algorithm in pure JavaScript.
// by z0gSh1u @ 2023/12

import FastPriorityQueue from 'fastpriorityqueue'

/**
 * Dijkstra's algorithm with heap (priority queue) optimization.
 * O(V+ElogV)
 */
export function dijkstraHeapOptim(graph: number[][], start: number) {
  const size = graph.length
  const dist: number[] = new Array(size).fill(Infinity)
  const visited: boolean[] = new Array(size).fill(false)
  dist[start] = 0
  // Minimum priority queue for fast access to the closest node.
  const queue = new FastPriorityQueue<number>((a, b) => dist[a] < dist[b])
  queue.add(start)
  while (!queue.isEmpty()) {
    const minIndex = queue.poll()!
    if (visited[minIndex]) {
      continue
    }
    visited[minIndex] = true
    // Relax the distance of all the adjacent nodes.
    for (let j = 0; j < size; j++) {
      if (!visited[j] && graph[minIndex][j] !== Infinity) {
        dist[j] = Math.min(dist[j], dist[minIndex] + graph[minIndex][j])
        queue.add(j)
      }
    }
  }
  return dist
}

/**
 * The most basic implementation of Dijkstra's algorithm without heap optimization.
 * O(V^2)
 */
export function dijkstraNaive(graph: number[][], start: number) {
  const size = graph.length
  const dist: number[] = new Array(size).fill(Infinity)
  const visited: boolean[] = new Array(size).fill(false)
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
