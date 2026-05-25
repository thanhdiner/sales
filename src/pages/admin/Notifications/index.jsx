import { message } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCircle2, Clock3, Info } from 'lucide-react'
import { getSocket } from '@/services/realtime/socket'
import SEO from '@/components/shared/SEO'
import { StatCard, StatGrid } from '@/components/admin/ui'
import {
  archiveAdminNotifications,
  deleteAdminNotifications,
  getAdminNotifications,
  markAdminNotificationsRead
} from '@/services/admin/commerce/notifications'
import NotificationsFilters from './sections/NotificationsFilters'
import NotificationsHeader from './sections/NotificationsHeader'
import NotificationsList from './sections/NotificationsList'
import NotificationsPagination from './sections/NotificationsPagination'
import { createNotificationStats, getNotificationActionRoute } from './utils'

const defaultFilters = {
  tab: 'all',
  search: '',
  type: 'all',
  priority: 'all',
  status: 'all',
  dateRange: null
}

export default function Notifications() {
  const { t, i18n } = useTranslation('adminNotifications')
  const navigate = useNavigate()
  const language = i18n.resolvedLanguage || i18n.language
  const [notifications, setNotifications] = useState([])
  const [stats, setStats] = useState(createNotificationStats([]))
  const [filters, setFilters] = useState(defaultFilters)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [refreshToken, setRefreshToken] = useState(0)

  const visibleNotifications = useMemo(() => notifications, [notifications])
  const selectedCount = selectedRowKeys.length

  useEffect(() => {
    let ignore = false

    const fetchNotifications = async () => {
      setLoading(true)
      try {
        const response = await getAdminNotifications({ page, limit: pageSize, ...filters })
        if (ignore) return
        const nextTotal = Number(response?.total) || 0
        const maxPage = Math.max(1, Math.ceil(nextTotal / pageSize))
        setNotifications(Array.isArray(response?.notifications) ? response.notifications : [])
        setStats(response?.stats || createNotificationStats([]))
        setTotal(nextTotal)
        setSelectedRowKeys([])
        if (page > maxPage) setPage(maxPage)
      } catch (error) {
        if (!ignore) {
          setNotifications([])
          setStats(createNotificationStats([]))
          setTotal(0)
          message.error(error.message || t('messages.fetchError', { defaultValue: 'Unable to load notifications.' }))
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchNotifications()
    return () => {
      ignore = true
    }
  }, [filters, language, page, pageSize, refreshToken, t])

  useEffect(() => {
    const socket = getSocket()
    const refresh = () => setRefreshToken(value => value + 1)
    const intervalId = window.setInterval(refresh, 30000)

    socket.on('notification:created', refresh)
    socket.on('notification:read', refresh)
    socket.on('notification:deleted', refresh)

    return () => {
      window.clearInterval(intervalId)
      socket.off('notification:created', refresh)
      socket.off('notification:read', refresh)
      socket.off('notification:deleted', refresh)
    }
  }, [])

  const handleFiltersChange = nextFilters => {
    setFilters(nextFilters)
    setPage(1)
  }

  const handleClearFilters = () => {
    setFilters(defaultFilters)
    setPage(1)
  }

  const handlePageChange = (nextPage, nextPageSize) => {
    setPage(nextPage)
    setPageSize(nextPageSize)
  }

  const handleToggleSelect = id => {
    setSelectedRowKeys(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]))
  }

  const markReadByIds = async ids => {
    const readAt = new Date().toISOString()
    setNotifications(prev =>
      prev.map(notification =>
        ids.includes(notification._id) && !notification.readAt
          ? { ...notification, readAt }
          : notification
      )
    )
    await markAdminNotificationsRead(ids)
  }

  const removeByIds = ids => {
    const removed = notifications.filter(notification => ids.includes(notification._id))
    setNotifications(prev => prev.filter(notification => !ids.includes(notification._id)))
    setSelectedRowKeys(prev => prev.filter(id => !ids.includes(id)))
    setTotal(prev => Math.max(prev - ids.length, 0))
    setStats(prev => ({
      ...prev,
      total: Math.max(prev.total - removed.length, 0),
      unread: Math.max(prev.unread - removed.filter(notification => !notification.readAt).length, 0),
      actionRequired: Math.max(prev.actionRequired - removed.filter(notification => notification.actionRequired).length, 0),
      today: Math.max(
        prev.today - removed.filter(notification => {
          const createdAt = new Date(notification.createdAt)
          const today = new Date()
          return createdAt.toDateString() === today.toDateString()
        }).length,
        0
      )
    }))
  }

  const handleMarkAllRead = async () => {
    const readAt = new Date().toISOString()
    setNotifications(prev => prev.map(notification => ({ ...notification, readAt: notification.readAt || readAt })))
    setStats(prev => ({ ...prev, unread: 0 }))
    await markAdminNotificationsRead()
    message.success(t('messages.allRead'))
  }

  const handleMarkRead = async id => {
    await markReadByIds([id])
    setStats(prev => ({ ...prev, unread: Math.max(prev.unread - 1, 0) }))
    message.success(t('messages.markRead'))
  }

  const handleView = async notification => {
    await markReadByIds([notification._id])
    navigate(getNotificationActionRoute(notification))
  }

  const handleArchive = async id => {
    await archiveAdminNotifications([id])
    removeByIds([id])
    message.success(t('messages.archived'))
  }

  const handleDelete = async id => {
    await deleteAdminNotifications([id])
    removeByIds([id])
    message.success(t('messages.deleted'))
  }

  const handleMarkSelectedRead = async () => {
    const unreadSelected = notifications.filter(notification => selectedRowKeys.includes(notification._id) && !notification.readAt).length
    await markReadByIds(selectedRowKeys)
    setStats(prev => ({ ...prev, unread: Math.max(prev.unread - unreadSelected, 0) }))
    setSelectedRowKeys([])
    message.success(t('messages.selectedRead'))
  }

  const handleArchiveSelected = async () => {
    await archiveAdminNotifications(selectedRowKeys)
    removeByIds(selectedRowKeys)
    message.success(t('messages.selectedArchived'))
  }

  const handleDeleteSelected = async () => {
    await deleteAdminNotifications(selectedRowKeys)
    removeByIds(selectedRowKeys)
    message.success(t('messages.selectedDeleted'))
  }

  const handleOpenSettings = () => {
    message.info(t('messages.settingsComing'))
  }

  return (
    <div className="text-[var(--admin-text)]">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-notifications-page mx-auto max-w-7xl">
        <NotificationsHeader
          onMarkAllRead={handleMarkAllRead}
          onOpenSettings={handleOpenSettings}
        />

        <StatGrid className="admin-notifications-stats" columns={4}>
          <StatCard icon={<Bell size={18} />} label={t('stats.total.label')} meta={t('stats.total.description')} value={stats.total} />
          <StatCard icon={<Clock3 size={18} />} label={t('stats.unread.label')} meta={t('stats.unread.description')} value={stats.unread} />
          <StatCard icon={<Info size={18} />} label={t('stats.actionRequired.label')} meta={t('stats.actionRequired.description')} value={stats.actionRequired} />
          <StatCard icon={<CheckCircle2 size={18} />} label={t('stats.today.label')} meta={t('stats.today.description')} value={stats.today} />
        </StatGrid>

        <NotificationsFilters
          filters={filters}
          selectedCount={selectedCount}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          onClearSelection={() => setSelectedRowKeys([])}
          onMarkSelectedRead={handleMarkSelectedRead}
          onArchiveSelected={handleArchiveSelected}
          onDeleteSelected={handleDeleteSelected}
        />

        <NotificationsList
          loading={loading}
          notifications={visibleNotifications}
          selectedRowKeys={selectedRowKeys}
          language={language}
          onToggleSelect={handleToggleSelect}
          onView={handleView}
          onMarkRead={handleMarkRead}
          onArchive={handleArchive}
          onDelete={handleDelete}
        />

        <NotificationsPagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
