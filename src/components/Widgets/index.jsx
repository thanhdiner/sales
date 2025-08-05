import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getActiveWidgets } from '@/services/widgetsService'
import './Widgets.scss'
import WidgetsSkeleton from '../WidgetsSkeleton'

function Widgets() {
  const [widgets, setWidgets] = useState([])
  const [loading, setLoading] = useState(true)

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

  if (loading) return <WidgetsSkeleton />
  if (widgets.length === 0) return <div>No widgets available</div>

  return (
    <div className="widgets">
      <div className="widgets__list">
        {widgets.map(widget => (
          <div key={widget._id} className="widgets__item">
            {widget.link ? (
              widget.link.startsWith('http') ? (
                <Link to={widget.link}>
                  <div className="widgets__icon--wrap">
                    <img src={widget.iconUrl} alt={widget.title} />
                  </div>
                  <p className="widgets__title">{widget.title}</p>
                </Link>
              ) : (
                <Link to={widget.link}>
                  <div className="widgets__icon--wrap">
                    <img src={widget.iconUrl} alt={widget.title} />
                  </div>
                  <p className="widgets__title">{widget.title}</p>
                </Link>
              )
            ) : (
              <div>
                <div className="widgets__icon--wrap">
                  <img src={widget.iconUrl} alt={widget.title} />
                </div>
                <p className="widgets__title">{widget.title}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Widgets
