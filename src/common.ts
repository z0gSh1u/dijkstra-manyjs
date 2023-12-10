/**
 * Read a text file.
 */
export async function readGraphFile(path: string) {
  return await (await fetch(path)).text()
}

/**
 * Build graph from .graph file.
 */
export function buildGraph(content: string): number[][] {
  const lines = content
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((v) => v.trim())
  const size = parseInt(lines[0])
  const graph = new Array(size).fill(0).map(() => new Array(size).fill(0))
  for (let i = 1; i <= size; i++) {
    const line = lines[i].split(/[ ]+/).map((v) => v.trim())
    for (let j = 0; j < size; j++) {
      graph[i - 1][j] = line[j] === 'Inf' ? Infinity : parseFloat(line[j])
    }
  }
  return graph
}

/**
 * Time a function.
 */
export async function timeit(fn: () => any) {
  const tic = performance.now()
  await fn()
  const toc = performance.now()

  return toc - tic
}
