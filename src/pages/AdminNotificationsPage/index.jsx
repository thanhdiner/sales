import { message } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import SEO from '@/components/SEO'
import { adminNotificationsMock } from './data'
import AdminNotificationsFiltersSection from './sections/AdminNotificationsFiltersSection'
import AdminNotificationsHeaderSection from './sections/AdminNotificationsHeaderSection'
import AdminNotificationsListSection from './sections/AdminNotificationsListSection'
import AdminNotificationsPaginationSection from './sections/AdminNotificationsPaginationSection'
import AdminNotificationsStatsSection from './sections/AdminNotificationsStatsSection'
import {
  createNotificationStats,
  getNotificationActionRoute,
  notificationMatchesFilters
} from './utils'

const defaultFilters = {
  tab: 'all',
  search: '',
  type: 'all',
  priority: 'all',
  status: 'all',
  dateRange: null
}

export default function AdminNotificationsPage() {
  const { t, i18n } = useTranslation('adminNotifications')
  const navigate = useNavigate()
  const language = i18n.resolvedLanguage || i18n.language
  const [notifications, setNotifications] = useState(adminNotificationsMock)
  const [filters, setFilters] = useState(defaultFilters)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const stats = useMemo(() => createNotificationStats(notifications), [notifications])

  const filteredNotifications = useMemo(
    () =>
      notifications
        .filter(notification => notificationMatchesFilters(notification, filters, language))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [filters, language, notifications]
  )

  const visibleNotifications = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    return filteredNotifications.slice(startIndex, startIndex + pageSize)
  }, [filteredNotifications, page, pageSize])

  const selectedCount = selectedRowKeys.length

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredNotifications.length / pageSize))
    if (page > maxPage) setPage(maxPage)
  }, [filteredNotifications.length, page, pageSize])

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

  const markReadByIds = ids => {
    const readAt = new Date().toISOString()
    setNotifications(prev =>
      prev.map(notification =>
        ids.includes(notification._id) && !notification.readAt
          ? { ...notification, readAt }
          : notification
      )
    )
  }

  const removeByIds = ids => {
    setNotifications(prev => prev.filter(notification => !ids.includes(notification._id)))
    setSelectedRowKeys(prev => prev.filter(id => !ids.includes(id)))
  }

  const handleMarkAllRead = () => {
    markReadByIds(notifications.map(notification => notification._id))
    message.success(t('messages.allRead'))
  }

  const handleMarkRead = id => {
    markReadByIds([id])
    message.success(t('messages.markRead'))
  }

  const handleView = notification => {
    markReadByIds([notification._id])
    navigate(getNotificationActionRoute(notification))
  }

  const handleArchive = id => {
    removeByIds([id])
    message.success(t('messages.archived'))
  }

  const handleDelete = id => {
    removeByIds([id])
    message.success(t('messages.deleted'))
  }

  const handleMarkSelectedRead = () => {
    markReadByIds(selectedRowKeys)
    setSelectedRowKeys([])
    message.success(t('messages.selectedRead'))
  }

  const handleArchiveSelected = () => {
    removeByIds(selectedRowKeys)
    message.success(t('messages.selectedArchived'))
  }

  const handleDeleteSelected = () => {
    removeByIds(selectedRowKeys)
    message.success(t('messages.selectedDeleted'))
  }

  const handleOpenSettings = () => {
    message.info(t('messages.settingsComing'))
  }

  return (
    <div className="min-h-screen rounded-xl bg-[var(--admin-bg-soft)] p-3 text-[var(--admin-text)] sm:p-4 lg:p-6">
      <SEO title={t('seo.title')} noIndex />

      <div className="mx-auto max-w-7xl space-y-5">
        <AdminNotificationsHeaderSection
          onMarkAllRead={handleMarkAllRead}
          onOpenSettings={handleOpenSettings}
        />

        <AdminNotificationsStatsSection stats={stats} />

        <AdminNotificationsFiltersSection
          filters={filters}
          selectedCount={selectedCount}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          onClearSelection={() => setSelectedRowKeys([])}
          onMarkSelectedRead={handleMarkSelectedRead}
          onArchiveSelected={handleArchiveSelected}
          onDeleteSelected={handleDeleteSelected}
        />

        <AdminNotificationsListSection
          loading={false}
          notifications={visibleNotifications}
          selectedRowKeys={selectedRowKeys}
          language={language}
          onToggleSelect={handleToggleSelect}
          onView={handleView}
          onMarkRead={handleMarkRead}
          onArchive={handleArchive}
          onDelete={handleDelete}
        />

        <AdminNotificationsPaginationSection
          page={page}
          pageSize={pageSize}
          total={filteredNotifications.length}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
