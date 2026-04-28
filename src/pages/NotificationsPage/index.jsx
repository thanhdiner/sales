import { useEffect, useMemo, useRef, useState } from 'react'
import { Bell, CheckCheck, CreditCard, Package, PackageCheck, Search, ShoppingCart, Truck, XCircle } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import {
  CLIENT_NOTIFICATIONS_UPDATED_EVENT,
  formatNotificationRelativeTime,
  getClientOrderRoute,
  getNotificationCategory,
  getNotificationItemBody,
  getNotificationItemTime,
  getNotificationItemTitle,
  getUnreadCount,
  loadStoredNotifications,
  markAllNotificationsReadIfNeeded,
  markNotificationReadIfNeeded,
  updateStoredNotifications
} from '@/Layout/LayoutDefault/components/NotificationBell/notificationUtils'

const statusIcons = {
  pending: ShoppingCart,
  confirmed: Package,
  shipping: Truck,
  completed: PackageCheck,
  cancelled: XCircle
}

const categoryIcons = {
  orders: Package,
  payments: CreditCard,
  system: Bell
}

const filterKeys = ['all', 'unread', 'orders', 'payments', 'system']
const PAGE_SIZE = 10

const getValidFilter = value => (filterKeys.includes(value) ? value : 'all')

const getIconClassName = notification => {
  if (notification.read) {
    return 'border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }

  if (notification.status === 'completed') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
  }

  if (notification.status === 'cancelled') {
    return 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300'
  }

  if (notification.status === 'shipping') {
    return 'border-sky-200 bg-sky-50 text-sky-600 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300'
  }

  return 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300'
}

function NotificationsPage() {
  const { t } = useTranslation('clientHeader')
  const language = useCurrentLanguage()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [notifications, setNotifications] = useState(() => loadStoredNotifications())
  const [activeFilter, setActiveFilter] = useState(() => getValidFilter(searchParams.get('filter')))
  const [searchInput, setSearchInput] = useState(() => searchParams.get('q') || '')
  const [appliedSearchTerm, setAppliedSearchTerm] = useState(() => searchParams.get('q') || '')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const loadMoreRef = useRef(null)

  useEffect(() => {
    const handleUpdated = event => {
      const nextNotifications = event.detail?.notifications
      setNotifications(Array.isArray(nextNotifications) ? nextNotifications : loadStoredNotifications())
    }

    window.addEventListener(CLIENT_NOTIFICATIONS_UPDATED_EVENT, handleUpdated)
    window.addEventListener('storage', handleUpdated)

    return () => {
      window.removeEventListener(CLIENT_NOTIFICATIONS_UPDATED_EVENT, handleUpdated)
      window.removeEventListener('storage', handleUpdated)
    }
  }, [])

  useEffect(() => {
    const nextFilter = getValidFilter(searchParams.get('filter'))
    const nextSearch = searchParams.get('q') || ''

    setActiveFilter(nextFilter)
    setSearchInput(nextSearch)
    setAppliedSearchTerm(nextSearch)
  }, [searchParams])

  const unreadCount = getUnreadCount(notifications)
  const filteredNotifications = useMemo(() => {
    const normalizedSearch = appliedSearchTerm.trim().toLowerCase()

    return notifications.filter(notification => {
      const category = getNotificationCategory(notification)
      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'unread' ? !notification.read : category === activeFilter)

      if (!matchesFilter) return false
      if (!normalizedSearch) return true

      return [
        getNotificationItemTitle(notification),
        getNotificationItemBody(notification),
        notification.orderId,
        category
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(normalizedSearch))
    })
  }, [activeFilter, appliedSearchTerm, notifications])

  const visibleNotifications = useMemo(
    () => filteredNotifications.slice(0, visibleCount),
    [filteredNotifications, visibleCount]
  )
  const hasMoreNotifications = visibleCount < filteredNotifications.length

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [activeFilter, appliedSearchTerm, notifications])

  useEffect(() => {
    const target = loadMoreRef.current

    if (!target || !hasMoreNotifications) return undefined

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount(current => Math.min(current + PAGE_SIZE, filteredNotifications.length))
        }
      },
      { rootMargin: '180px 0px' }
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [filteredNotifications.length, hasMoreNotifications, visibleCount])

  const updateUrlParams = ({ filter = activeFilter, q = appliedSearchTerm } = {}) => {
    const nextParams = new URLSearchParams()
    const normalizedFilter = getValidFilter(filter)
    const normalizedSearch = q.trim()

    if (normalizedFilter !== 'all') {
      nextParams.set('filter', normalizedFilter)
    }

    if (normalizedSearch) {
      nextParams.set('q', normalizedSearch)
    }

    setSearchParams(nextParams)
  }

  const handleFilterChange = filterKey => {
    updateUrlParams({ filter: filterKey })
  }

  const handleSearchSubmit = event => {
    event.preventDefault()
    updateUrlParams({ q: searchInput })
  }

  const syncNotifications = nextNotifications => {
    setNotifications(nextNotifications)
    updateStoredNotifications(nextNotifications)
  }

  const handleMarkAllRead = () => {
    syncNotifications(markAllNotificationsReadIfNeeded(notifications))
  }

  const handleMarkRead = notificationId => {
    syncNotifications(markNotificationReadIfNeeded(notifications, notificationId))
  }

  const handleViewOrder = notification => {
    syncNotifications(markNotificationReadIfNeeded(notifications, notification.id))
    navigate(getClientOrderRoute(notification.orderId))
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950">
      <SEO title={t('notification.pageTitle')} noIndex />

      <div className="mx-auto max-w-6xl space-y-5">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold tracking-normal text-gray-950 dark:text-white">
                {t('notification.pageTitle')}
              </h1>

              <p className="mb-0 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">
                {t('notification.pageDescription')}
              </p>
            </div>

            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <CheckCheck className="h-4 w-4" />
              {t('notification.markAllRead')}
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {filterKeys.map(filterKey => (
                <button
                  type="button"
                  key={filterKey}
                  onClick={() => handleFilterChange(filterKey)}
                  className={`h-9 rounded-lg px-4 text-sm font-semibold transition ${
                    activeFilter === filterKey
                      ? 'bg-gray-950 text-white dark:bg-white dark:text-gray-950'
                      : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {t(`notification.filters.${filterKey}`)}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearchSubmit} className="flex w-full gap-2 lg:w-[420px]">
              <label className="relative block min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchInput}
                  onChange={event => setSearchInput(event.target.value)}
                  placeholder={t('notification.searchPlaceholder')}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-500"
                />
              </label>

              <button
                type="submit"
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
              >
                <Search className="h-4 w-4" />
                {t('notification.searchButton')}
              </button>
            </form>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {filteredNotifications.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
              <Bell className="mb-3 h-10 w-10 opacity-40" />
              <p className="mb-0 text-sm">{t('notification.emptyList')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleNotifications.map(notification => {
                const category = getNotificationCategory(notification)
                const Icon = statusIcons[notification.status] || categoryIcons[category] || Bell
                const title = getNotificationItemTitle(notification)
                const body = getNotificationItemBody(notification)

                return (
                  <article
                    key={`${notification.id}-${notification.time}`}
                    className={`rounded-2xl border p-4 transition ${
                      notification.read
                        ? 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
                        : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/80'
                    }`}
                  >
                    <div className="flex gap-4">
                      <span className={`mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${getIconClassName(notification)}`}>
                        <Icon className="h-5 w-5" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h2 className="mb-1 truncate text-base font-bold text-gray-950 dark:text-white">
                            {title}
                          </h2>

                          {!notification.read && <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-gray-950 dark:bg-white" />}
                        </div>

                        <p className="mb-2 text-sm leading-6 text-gray-700 dark:text-gray-200">
                          {body}
                        </p>

                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <p className="mb-0 text-sm text-gray-500 dark:text-gray-400">
                            {t(`notification.meta.${category}`)} - {formatNotificationRelativeTime(getNotificationItemTime(notification), language)}
                          </p>

                          <div className="flex flex-wrap gap-3">
                            {notification.orderId && (
                              <button
                                type="button"
                                onClick={() => handleViewOrder(notification)}
                                className="text-sm font-semibold text-gray-950 underline underline-offset-4 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
                              >
                                {t('notification.viewOrder')}
                              </button>
                            )}

                            {!notification.read && (
                              <button
                                type="button"
                                onClick={() => handleMarkRead(notification.id)}
                                className="text-sm font-semibold text-gray-600 underline underline-offset-4 hover:text-gray-950 dark:text-gray-300 dark:hover:text-white"
                              >
                                {t('notification.markRead')}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
              {hasMoreNotifications && (
                <div ref={loadMoreRef} className="flex min-h-10 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  {t('notification.loadingMore')}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default NotificationsPage
