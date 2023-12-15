import React, { useState } from 'react'

type Props = {
  name: string
  description: string
  executor: () => { time: number; dist: number[][] }
}

const BlockStyle: React.CSSProperties = {
  border: '1px solid black',
  margin: '10px',
  padding: '10px',
}

export default function ApproachBlock({ name, description, executor }: Props) {
  const [timeElapsed, setTimeElapsed] = useState(-1)

  function handleRunClicked() {
    executor()
    setTimeElapsed(-1)
  }

  return (
    <div style={BlockStyle}>
      <button onClick={handleRunClicked}>Run</button>
      <p>
        {name}
        {description}
        {timeElapsed}
      </p>
    </div>
  )
}
