import React, { useEffect, useState } from 'react'
import './CountDown.scss'

function Countdown({ endTime }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (!endTime) return
    const interval = setInterval(() => {
      const now = new Date()
      const end = new Date(endTime)
      const diff = end - now
      if (diff <= 0) {
        setTimeLeft('00:00:00')
        clearInterval(interval)
        return
      }
      const d = Math.floor(diff / (24 * 3600000))
      const h = Math.floor((diff % (24 * 3600000)) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      let text = ''
      if (d > 0) {
        text = `${d} ngày ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      } else {
        text = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      }
      setTimeLeft(text)
    }, 1000)
    return () => clearInterval(interval)
  }, [endTime])

  return <span className="countdown-timer">{timeLeft}</span>
}

export default Countdown
