import React from 'react'
import { motion } from 'framer-motion'

import { cn } from '@/utils/cn'

function FloatingPaths({ position = 1 }) {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: `M-${360 - i * 5 * position} -${180 + i * 6}C-${360 - i * 5 * position} -${180 + i * 6} -${300 - i * 4 * position} ${210 - i * 5} ${150 - i * 5 * position} ${320 - i * 6}C${580 - i * 4 * position} ${430 - i * 6} ${650 - i * 4 * position} ${820 - i * 6} ${650 - i * 4 * position} ${820 - i * 6}`,
    width: 0.65 + i * 0.04,
    color: position === 1 ? `rgba(239,68,68,${0.23 + i * 0.014})` : `rgba(248,113,113,${0.2 + i * 0.013})`
  }))

  return (
    <svg className="h-full w-full" viewBox="0 0 696 316" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {paths.map(path => (
        <motion.path
          key={`${position}-${path.id}`}
          d={path.d}
          stroke={path.color}
          strokeWidth={path.width}
          strokeOpacity={0.24 + path.id * 0.013}
          initial={{ pathLength: 0.25, opacity: 0.62 }}
          animate={{
            pathLength: 1,
            opacity: [0.48, 0.9, 0.48],
            pathOffset: [0, 1, 0]
          }}
          transition={{
            duration: 17 + path.id * 0.4,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear'
          }}
        />
      ))}
    </svg>
  )
}

export function BackgroundPaths({ className }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <div className="h-full w-full">
        <FloatingPaths position={1} />
      </div>
      <div className="absolute inset-0 h-full w-full opacity-100">
        <FloatingPaths position={-1} />
      </div>
    </div>
  )
}
