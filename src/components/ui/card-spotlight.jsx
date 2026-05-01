'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'

import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect'
import { cn } from '@/utils/cn'

export const CardSpotlight = ({ children, radius = 320, color = 'rgba(79, 140, 255, 0.20)', className, ...props }) => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const leaveTimeoutRef = useRef(null)

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect()

    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current)
      }
    }
  }, [])

  const handleEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current)
      leaveTimeoutRef.current = null
    }
    setIsHovering(true)
  }

  const handleLeave = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current)
    leaveTimeoutRef.current = setTimeout(() => {
      setIsHovering(false)
    }, 90)
  }

  return (
    <div
      className={cn(
        'group/spotlight relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px z-0 rounded-2xl"
        animate={{ opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          backgroundColor: color,
          maskImage: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent 72%
            )
          `,
          willChange: 'opacity'
        }}
      >
        <CanvasRevealEffect
          animationSpeed={4.2}
          containerClassName="absolute inset-0 bg-transparent pointer-events-none"
          colors={[
            [96, 165, 250],
            [167, 139, 250]
          ]}
          opacities={[0.1, 0.12, 0.14, 0.18, 0.22, 0.26, 0.3, 0.34, 0.38, 0.4]}
          dotSize={2}
          showGradient={false}
        />
      </motion.div>

      <div className="relative z-10">{children}</div>
    </div>
  )
}
