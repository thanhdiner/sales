import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { formatCurrency, getDashboardLocale } from '../utils/dashboardTransforms'

const sparklinePoints = '0,44 14,28 27,32 41,16 55,14 69,35 83,27 97,8 111,31 125,21 139,2'

function useAnimatedNumber(value, duration = 650) {
  const target = Number(value) || 0
  const [displayValue, setDisplayValue] = useState(target)
  const valueRef = useRef(target)

  useEffect(() => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (reduceMotion) {
      valueRef.current = target
      setDisplayValue(target)
      return undefined
    }

    let frameId
    const startValue = valueRef.current
    const startTime = performance.now()

    const tick = now => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const nextValue = startValue + (target - startValue) * eased
      valueRef.current = nextValue
      setDisplayValue(nextValue)
      if (progress < 1) frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [target])

  return displayValue
}

export default function StatCard({
  title,
  value,
  change,
  trend,
  icon,
  color = 'var(--dashboard-success)',
  subInfo = [],
  isCurrency,
  sparkline,
  caption
}) {
  const { t, i18n } = useTranslation('adminDashboard')
  const locale = getDashboardLocale(i18n.language)
  const animatedValue = useAnimatedNumber(value)
  const displayValue = useMemo(
    () => isCurrency ? formatCurrency(animatedValue, locale) : Math.round(animatedValue).toLocaleString(locale),
    [animatedValue, isCurrency, locale]
  )
  const TrendIcon = trend === 'down' ? ArrowDown : ArrowUp
  const normalizedTrend = trend === 'down' ? 'down' : 'up'
  const sparkId = `spark-${title.replace(/[^\w-]+/g, '-')}`

  return (
    <article className={`stat-card ${isCurrency ? 'stat-card--currency' : ''}`} style={{ '--stat-color': color }}>
      <div className="stat-card-head">
        <div className="stat-icon" aria-hidden="true">
          {React.cloneElement(icon, { size: 30, strokeWidth: 1.8 })}
        </div>

        <span className="stat-title" title={title}>
          {title}
        </span>
      </div>

      <div className="stat-value-row">
        <div className="stat-value">{displayValue}</div>
        <span className={`stat-change ${normalizedTrend}`}>
          <TrendIcon size={13} />
          {Number(change) || 0}%
        </span>
      </div>

      {sparkline ? (
        <div className="stat-sparkline-wrap">
          {caption && <span className="stat-caption">{caption}</span>}
          <svg className="stat-sparkline" viewBox="0 0 139 52" role="img" aria-label={t('stats.trendAria', { title })}>
            <defs>
              <linearGradient id={sparkId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--dashboard-success)" stopOpacity="0.42" />
                <stop offset="100%" stopColor="var(--dashboard-success)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline points={`0,52 ${sparklinePoints} 139,52`} fill={`url(#${sparkId})`} stroke="none" />
            <polyline points={sparklinePoints} fill="none" stroke="var(--dashboard-success)" strokeLinecap="round" strokeWidth="2.5" />
          </svg>
        </div>
      ) : (
        <div className="stat-sub-list">
          {subInfo.map((item, index) => (
            <div key={`${item.label}-${index}`} className="stat-sub-info">
              <span>{item.label}:</span>
              <strong>{(Number(item.value) || 0).toLocaleString(locale)}</strong>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
