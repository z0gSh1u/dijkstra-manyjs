import React from 'react'

const titleStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#333',
}

const linkStyle: React.CSSProperties = {
  color: '#0366d6',
  textDecoration: 'none',
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem',
  paddingBottom: 0,
  borderBottom: '1px solid #e1e4e8',
}

export default function Header() {
  return (
    <div style={headerStyle}>
      <div>
        <p style={titleStyle}>🧮 Dijkstra ManyJS</p>
        <p>
          Comparison of Dijkstra Shortest Path algorithm implemented by
          different JavaScript approaches.
        </p>
      </div>
      <div>
        <a
          style={linkStyle}
          href="https://github.com/z0gSh1u/dijkstra-manyjs"
          target="_blank"
        >
          GitHub
        </a>
      </div>
    </div>
  )
}
