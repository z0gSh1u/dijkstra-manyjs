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
 * Create 2D JS array.
 */
export function create2DArray(rows: number, cols?: number, fill = 0) {
  return Array(rows)
    .fill(0)
    .map(() => Array(cols ?? rows).fill(fill))
}

/**
 * Create 2D array where dim-0 is JS array and dim-1 is Float32Array.
 */
export function create2DFloat32Array(rows: number, cols?: number, fill = 0) {
  return Array(rows)
    .fill(0)
    .map(() => new Float32Array(cols ?? rows).fill(fill)) as Float32Array[]
}

/**
 * A very simple template engine for WGSL.
 */
export function compileWGSLTemplate(
  template: string,
  args: { [k: string]: number | boolean | string }
) {
  let code = template
  for (const [k, v] of Object.entries(args)) {
    code = code.replace(new RegExp(`##${k}##`, 'g'), v.toString())
  }
  return code
}

/**
 * Check if two arrays are equal element by element.
 */
export function isAllClose(a: number[], b: number[], eps = 1e-6) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= eps)
}

/**
 * Time a function with [ms].
 */
export async function timeit<T>(fn: (...args: any) => T) {
  const tic = performance.now()
  const result: Awaited<ReturnType<typeof fn>> = await fn()
  const toc = performance.now()

  return { time: toc - tic, result }
}
