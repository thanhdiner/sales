import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getActiveWidgets } from '@/services/widgetsService'
import './Widgets.scss'
import WidgetsSkeleton from '../WidgetsSkeleton'

function Widgets() {
  const [widgets, setWidgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    async function fetchWidgets() {
      try {
        const res = await getActiveWidgets()
        setWidgets(res.data || [])
      } catch {
        setWidgets([])
      } finally {
        setLoading(false)
      }
    }
    fetchWidgets()
  }, [])

  // detect mobile viewport only on client
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767.98px)')
    const apply = e => setIsMobile(e.matches)
    apply(mq)
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  if (loading) return <WidgetsSkeleton />
  if (widgets.length === 0) return <div>No widgets available</div>

  const viewport = { once: true, amount: 0.2 }
  const visibleWidgets = isMobile ? (expanded ? widgets : widgets.slice(0, 2)) : widgets

  return (
    <motion.div
      className="widgets dark:bg-gray-800"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="widgets__list">
        {visibleWidgets.map((widget, index) => (
          <motion.div
            key={widget._id}
            className="widgets__item"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
            viewport={viewport}
          >
            {widget.link ? (
              widget.link.startsWith('http') ? (
                <Link to={widget.link}>
                  <div className="widgets__icon--wrap">
                    <img src={widget.iconUrl} alt={widget.title} />
                  </div>
                  <p className="widgets__title dark:text-gray-300">{widget.title}</p>
                </Link>
              ) : (
                <Link to={widget.link}>
                  <div className="widgets__icon--wrap">
                    <img src={widget.iconUrl} alt={widget.title} />
                  </div>
                  <p className="widgets__title dark:text-gray-300">{widget.title}</p>
                </Link>
              )
            ) : (
              <div>
                <div className="widgets__icon--wrap">
                  <img src={widget.iconUrl} alt={widget.title} />
                </div>
                <p className="widgets__title dark:text-gray-300">{widget.title}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      {isMobile && widgets.length > 2 && (
        <motion.div
          className="widgets__toggle-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          viewport={viewport}
        >
          <button
            type="button"
            className="widgets__toggle dark:text-gray-200 mb-2"
            onClick={() => setExpanded(p => !p)}
            aria-expanded={expanded}
          >
            {expanded ? 'Thu gọn' : 'Xem thêm'}
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Widgets
