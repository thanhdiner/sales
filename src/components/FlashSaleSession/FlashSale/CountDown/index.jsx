import React, { useEffect, useState } from 'react'
import './CountDown.scss'

function Countdown({ endTime }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  useEffect(() => {
    if (!endTime) return

    const updateCountdown = () => {
      const now = new Date()
      const end = new Date(endTime)
      const diff = end - now

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: '00',
          minutes: '00',
          seconds: '00'
        })
        return
      }

      const days = Math.floor(diff / (24 * 3600000))
      const hours = Math.floor((diff % (24 * 3600000)) / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)

      setTimeLeft({
        days,
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      })
    }

    updateCountdown()

    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [endTime])

  return (
    <span className="countdown-timer">
      {timeLeft.days > 0 && (
        <>
          <span className="countdown-timer__day">{timeLeft.days} ngày</span>
        </>
      )}

      <span className="countdown-timer__box">{timeLeft.hours}</span>
      <span className="countdown-timer__colon">:</span>
      <span className="countdown-timer__box">{timeLeft.minutes}</span>
      <span className="countdown-timer__colon">:</span>
      <span className="countdown-timer__box">{timeLeft.seconds}</span>
    </span>
  )
}

export default Countdown