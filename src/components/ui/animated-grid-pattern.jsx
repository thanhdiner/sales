import React, { useEffect, useId, useRef, useState } from 'react'
import { motion } from 'framer-motion'

import { cn } from '@/utils/cn'

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5,
  ...props
}) {
  const id = useId()
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const getPos = () => {
    const cols = Math.max(1, Math.floor(dimensions.width / width))
    const rows = Math.max(1, Math.floor(dimensions.height / height))
    return [Math.floor(Math.random() * cols), Math.floor(Math.random() * rows)]
  }

  const generateSquares = count => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      pos: getPos()
    }))
  }

  const [squares, setSquares] = useState(() => generateSquares(numSquares))

  const updateSquarePosition = idToUpdate => {
    setSquares(currentSquares =>
      currentSquares.map(sq =>
        sq.id === idToUpdate
          ? {
              ...sq,
              pos: getPos()
            }
          : sq
      )
    )
  }

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setSquares(generateSquares(numSquares))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions.width, dimensions.height, numSquares])

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        })
      }
    })

    const observedElement = containerRef.current

    if (observedElement) {
      resizeObserver.observe(observedElement)
    }

    return () => {
      if (observedElement) {
        resizeObserver.unobserve(observedElement)
      }
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30',
        className
      )}
      {...props}
    >
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" strokeDasharray={strokeDasharray} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ pos: [squareX, squareY], id: squareId }, index) => (
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              duration,
              repeat: 1,
              repeatDelay,
              delay: index * 0.1,
              repeatType: 'reverse'
            }}
            onAnimationComplete={() => updateSquarePosition(squareId)}
            key={`${squareX}-${squareY}-${index}`}
            width={width - 1}
            height={height - 1}
            x={squareX * width + 1}
            y={squareY * height + 1}
            fill="currentColor"
            strokeWidth="0"
          />
        ))}
      </svg>
    </svg>
  )
}
