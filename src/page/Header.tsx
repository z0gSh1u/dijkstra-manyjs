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
  gap: '2em',
  padding: '1em',
  paddingBottom: 0,
  borderBottom: '1px solid #e1e4e8',
}

export default function Header() {
  return (
    <div style={headerStyle}>
      <div>
        <p style={titleStyle}>🧮 Dijkstra ManyJS</p>
        <p style={{ lineHeight: 1.5 }}>
          Comparison of Dijkstra Shortest Path algorithm (from every node to
          every node) implemented by different JavaScript approaches. The graph
          is stored by adjacency matrix. WebGL is not included because its{' '}
          <a
            href="https://www.khronos.org/webgl/public-mailing-list/public_webgl/2009/msg00000.php"
            target="_blank"
          >
            Compute Shader is deprecated
          </a>
          .
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
