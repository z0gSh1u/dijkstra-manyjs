use std::usize;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn dijkstra(graph_flatten: &[f32], size: usize, start: usize) -> Vec<f32> {
    dijkstra_impl(&graph_flatten.to_vec(), size, start)
}

/// Dijkstra's algorithm in Rust.
fn dijkstra_impl(graph: &Vec<f32>, size: usize, start: usize) -> Vec<f32> {
    let mut dist = vec![f32::MAX; size];
    let mut visited = vec![false; size];

    dist[start] = 0.0;

    for _ in 0..size {
        // Find the node with the minimum distance.
        let mut current: Option<usize> = None;
        for (i, &dis_i) in dist.iter().enumerate() {
            if !visited[i] && (current == None || dis_i < dist[current.unwrap()]) {
                current = Some(i);
            }
        }
        if current == None {
            break;
        }
        // Relax the distance of all the adjacent nodes.
        let current = current.unwrap();
        visited[current] = true;
        for (i, &w) in graph[current * size..current * size + size]
            .iter()
            .enumerate()
        {
            if !visited[i] && w != f32::MAX {
                dist[i] = f32::min(dist[i], dist[current] + w);
            }
        }
    }

    dist
}
