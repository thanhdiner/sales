import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { getActiveWidgets } from '@/services/widgetsService'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import './Widgets.scss'
import WidgetsSkeleton from '../WidgetsSkeleton'

function Widgets() {
  const { t } = useTranslation('clientHome')
  const language = useCurrentLanguage()
  const [isMobile, setIsMobile] = useState(false)

  const { data: widgets = [], isPending } = useQuery({
    queryKey: ['widgets', language],
    queryFn: async () => {
      const res = await getActiveWidgets()
      return res.data || []
    },
    placeholderData: previousData => previousData,
    staleTime: 5 * 60 * 1000
  })
  const loading = isPending && widgets.length === 0

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767.98px)')
    const apply = e => setIsMobile(e.matches)

    apply(mq)
    mq.addEventListener('change', apply)

    return () => mq.removeEventListener('change', apply)
  }, [])

  if (loading) return <WidgetsSkeleton />

  if (widgets.length === 0) {
    return <div>{t('widgets.empty')}</div>
  }

  const visibleWidgets = isMobile ? widgets.slice(0, 10) : widgets

  return (
    <div className="widgets dark:bg-gray-800">
      <div className="widgets__list">
        {visibleWidgets.map(widget => {
          const content = (
            <>
              <div className="widgets__icon--wrap">
                <img src={widget.iconUrl} alt={widget.title} />
              </div>

              <p className="widgets__title dark:text-gray-300">{widget.title}</p>
            </>
          )

          return (
            <div key={widget._id} className="widgets__item">
              {widget.link ? <Link to={widget.link}>{content}</Link> : <div>{content}</div>}
            </div>
          )
        })}
      </div>

      {isMobile && widgets.length > visibleWidgets.length && <div className="widgets__mobile-fade" aria-hidden="true" />}
    </div>
  )
}

export default Widgets
