import React, { useState } from 'react'

type Props = {
  name: string
  description: string
  executor: () => Promise<{ time: number; dist: number[][] }>
}

const BlockStyle: React.CSSProperties = {
  border: '1px solid gray',
  margin: '1em',
  padding: '1em',
}

export default function ApproachBlock({ name, description, executor }: Props) {
  const [timeElapsed, setTimeElapsed] = useState(-1)

  async function handleRunClicked() {
    const { time } = await executor()
    setTimeElapsed(time)
  }

  return (
    <div style={BlockStyle}>
      <p style={{ fontWeight: 'bold' }}>{name}</p>
      <p>{description}</p>
      <p>
        Time Elapsed: {timeElapsed < 0 ? 'N/A' : timeElapsed.toFixed(2) + ' ms'}
      </p>
      <button onClick={handleRunClicked}>Run</button>&nbsp;
    </div>
  )
}
