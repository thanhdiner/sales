import { useEffect, useMemo, useState } from 'react'
import { Avatar, Button, Dropdown, Grid, Pagination, Space, Table, Tooltip, Typography } from 'antd'
import { DeleteOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined, LinkOutlined, MoreOutlined } from '@ant-design/icons'
import { AdminStatusPill, AdminTablePanel } from '@/components/admin/ui'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { getLocalizedWidgetTitle } from '../utils'

const { Text } = Typography
const { useBreakpoint } = Grid

const PAGE_SIZE_OPTIONS = [5, 10, 20]

const getStatusTagClass = isActive =>
  isActive ? 'admin-widgets-status-tag admin-widgets-status-tag--active' : 'admin-widgets-status-tag admin-widgets-status-tag--inactive'

const truncateLink = (link, maxLength = 42) => {
  if (!link) {
    return ''
  }

  if (link.length <= maxLength) {
    return link
  }

  return `${link.substring(0, maxLength)}...`
}

export default function AdminWidgetsTableSection({ widgets, loading, onEditWidget, onDeleteWidget, t = key => key }) {
  const screens = useBreakpoint()
  const language = useCurrentLanguage()
  const isTablet = Boolean(screens.md && !screens.xl)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil((widgets.length || 0) / pageSize))

    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, pageSize, widgets.length])

  const total = widgets.length
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const rangeEnd = total === 0 ? 0 : Math.min(currentPage * pageSize, total)
  const summaryText = t('table.summary', { rangeStart, rangeEnd, total })

  const paginatedWidgets = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return widgets.slice(startIndex, startIndex + pageSize)
  }, [currentPage, pageSize, widgets])

  const handlePaginationChange = (nextPage, nextPageSize = pageSize) => {
    if (nextPageSize !== pageSize) {
      setPageSize(nextPageSize)
      setCurrentPage(1)
      return
    }

    setCurrentPage(nextPage)
  }

  const handleTableChange = pagination => {
    const nextPage = pagination?.current || 1
    const nextPageSize = pagination?.pageSize || pageSize

    handlePaginationChange(nextPage, nextPageSize)
  }

  const columns = useMemo(() => {
    const widgetColumn = {
      title: t('table.columns.widget'),
      dataIndex: 'title',
      key: 'title',
      width: isTablet ? 360 : 280,
      onCell: () => ({
        style: {
          minWidth: 220,
          whiteSpace: 'normal',
          wordBreak: 'break-word'
        }
      }),
      render: (title, record) => {
        const localizedTitle = getLocalizedWidgetTitle(record, language, title || '')

        return (
          <div className="admin-widgets-widget-cell">
            <Avatar src={record.iconUrl} size={40} className="admin-widgets-widget-avatar" />

            <div className="admin-widgets-widget-info">
              <div className="admin-widgets-widget-title">{localizedTitle}</div>
              <div className="admin-widgets-widget-order">{t('table.widgetOrder', { order: record.order })}</div>

              {isTablet ? (
                record.link ? (
                  <Tooltip title={record.link}>
                    <a href={record.link} target="_blank" rel="noreferrer" className="admin-widgets-link admin-widgets-link--tablet">
                      {truncateLink(record.link, 46)}
                    </a>
                  </Tooltip>
                ) : (
                  <Text className="admin-widgets-empty-link">{t('table.noLink')}</Text>
                )
              ) : null}
            </div>
          </div>
        )
      }
    }

    const linkColumn = {
      title: (
        <Space size={6}>
          <LinkOutlined />
          <span>{t('table.columns.link')}</span>
        </Space>
      ),
      dataIndex: 'link',
      key: 'link',
      width: 300,
      render: link =>
        link ? (
          <Tooltip title={link}>
            <a href={link} target="_blank" rel="noreferrer" className="admin-widgets-link">
              {truncateLink(link, 42)}
            </a>
          </Tooltip>
        ) : (
          <Text className="admin-widgets-empty-link">{t('table.noLink')}</Text>
        )
    }

    const statusColumn = {
      title: t('table.columns.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 160,
      render: value => (
        <AdminStatusPill
          dot={false}
          icon={value ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          tone={value ? 'success' : 'neutral'}
          className={getStatusTagClass(value)}
        >
          {value ? t('status.active') : t('status.inactive')}
        </AdminStatusPill>
      ),
      filters: [
        { text: t('status.active'), value: true },
        { text: t('status.inactive'), value: false }
      ],
      onFilter: (value, record) => record.isActive === value
    }

    const actionColumn = {
      title: t('table.columns.actions'),
      key: 'action',
      width: 170,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t('table.actions.editTooltip')}>
            <Button icon={<EditOutlined />} onClick={() => onEditWidget(record)} className="admin-widgets-btn admin-widgets-btn--table">
              {t('table.actions.edit')}
            </Button>
          </Tooltip>

          <Tooltip title={t('table.actions.deleteTooltip')}>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDeleteWidget(record._id)}
              className="admin-widgets-btn admin-widgets-btn--table admin-widgets-btn--danger"
            >
              {t('table.actions.delete')}
            </Button>
          </Tooltip>
        </Space>
      )
    }

    return isTablet ? [widgetColumn, statusColumn, actionColumn] : [widgetColumn, linkColumn, statusColumn, actionColumn]
  }, [isTablet, language, onDeleteWidget, onEditWidget, t])

  return (
    <AdminTablePanel className="admin-widgets-table-wrapper" bodyClassName="admin-widgets-table-panel__body">
      <div className="admin-widgets-table-desktop-tablet">
        <Table
          rowKey="_id"
          dataSource={paginatedWidgets}
          columns={columns}
          loading={loading}
          scroll={{ x: isTablet ? 680 : 900 }}
          onChange={handleTableChange}
          pagination={{
            current: currentPage,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: !isTablet,
            pageSizeOptions: PAGE_SIZE_OPTIONS.map(option => String(option)),
            showTotal: () => summaryText,
            onChange: handlePaginationChange
          }}
          className={`admin-widgets-table ${isTablet ? 'admin-widgets-table--tablet min-w-[660px]' : 'min-w-[920px]'} text-[13.5px] [&_.ant-table-tbody_td]:align-top`}
        />
      </div>

      <div className="admin-widgets-mobile">
        <div className="admin-widgets-mobile-list">
          {loading ? (
            <div className="admin-widgets-mobile-empty">{t('table.loading')}</div>
          ) : paginatedWidgets.length === 0 ? (
            <div className="admin-widgets-mobile-empty">{t('table.empty')}</div>
          ) : (
            paginatedWidgets.map(widget => (
              <article className="admin-widgets-mobile-card" key={widget._id}>
                <div className="admin-widgets-mobile-card__head">
                  <div className="admin-widgets-mobile-card__main">
                    <Avatar src={widget.iconUrl} size={46} className="admin-widgets-widget-avatar" />

                    <div className="admin-widgets-mobile-card__info">
                      <h4 className="admin-widgets-mobile-card__title">
                        {getLocalizedWidgetTitle(widget, language, widget.title || '')}
                      </h4>
                      <p className="admin-widgets-mobile-card__order">{t('table.widgetOrder', { order: widget.order })}</p>
                    </div>
                  </div>

                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'edit',
                          icon: <EditOutlined />,
                          label: t('table.actions.edit')
                        },
                        {
                          key: 'delete',
                          icon: <DeleteOutlined />,
                          label: t('table.actions.delete'),
                          danger: true
                        }
                      ],
                      onClick: ({ key }) => {
                        if (key === 'edit') {
                          onEditWidget(widget)
                        }

                        if (key === 'delete') {
                          onDeleteWidget(widget._id)
                        }
                      }
                    }}
                    trigger={['click']}
                    placement="bottomRight"
                    overlayClassName="admin-widgets-mobile-dropdown"
                  >
                    <Button type="text" icon={<MoreOutlined />} className="admin-widgets-mobile-card__menu" />
                  </Dropdown>
                </div>

                {widget.link ? (
                  <a href={widget.link} target="_blank" rel="noreferrer" className="admin-widgets-link admin-widgets-link--mobile">
                    {truncateLink(widget.link, 36)}
                  </a>
                ) : (
                  <Text className="admin-widgets-empty-link">{t('table.noLink')}</Text>
                )}

                <div className="admin-widgets-mobile-card__status-row">
                  <AdminStatusPill
                    icon={widget.isActive ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    dot={false}
                    tone={widget.isActive ? 'success' : 'neutral'}
                    className={getStatusTagClass(widget.isActive)}
                  >
                    {widget.isActive ? t('status.active') : t('status.inactive')}
                  </AdminStatusPill>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="admin-widgets-mobile-footer">
          <span className="admin-widgets-mobile-footer__summary">{summaryText}</span>

          <div className="admin-widgets-mobile-footer__controls">
            <Pagination
              size="small"
              current={currentPage}
              pageSize={pageSize}
              total={total}
              showSizeChanger={false}
              onChange={handlePaginationChange}
              className="admin-widgets-mobile-pagination"
            />

            <select
              className="admin-widgets-mobile-page-size"
              value={String(pageSize)}
              onChange={event => handlePaginationChange(1, Number(event.target.value))}
            >
              {PAGE_SIZE_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {t('table.pageSize', { count: option })}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </AdminTablePanel>
  )
}
