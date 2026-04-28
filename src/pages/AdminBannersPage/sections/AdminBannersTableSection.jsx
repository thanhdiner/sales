import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  Dropdown,
  Empty,
  Image,
  Pagination,
  Skeleton,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  MoreOutlined
} from '@ant-design/icons'
import { getLocalizedBannerLink, getLocalizedBannerTitle } from '@/utils/bannerLocalization'

const { Text } = Typography
const DEFAULT_PAGE_SIZE = 10

const getStatusTagClassName = value =>
  value ? 'admin-banners-status-tag admin-banners-status-tag--active' : 'admin-banners-status-tag admin-banners-status-tag--inactive'

function BannerStatusTag({ value }) {
  const { t } = useTranslation('adminBanners')

  return (
    <Tag
      icon={<span className="admin-banners-status-dot" />}
      className={getStatusTagClassName(value)}
    >
      {value ? t('status.active') : t('status.inactive')}
    </Tag>
  )
}

function BannerLink({ link, compact = false }) {
  const { t } = useTranslation('adminBanners')

  if (!link) {
    return <Text className="admin-banners-empty-link">{t('table.emptyLink')}</Text>
  }

  const maxLength = compact ? 28 : 34

  return (
    <Tooltip title={link}>
      <a href={link} target="_blank" rel="noreferrer" className="admin-banners-link">
        {link.length > maxLength ? `${link.substring(0, maxLength)}...` : link}
      </a>
    </Tooltip>
  )
}

function BannerImage({ src, alt }) {
  const { t } = useTranslation('adminBanners')

  if (!src) {
    return <div className="admin-banners-image-placeholder">{t('table.noImage')}</div>
  }

  return (
    <Image
      src={src}
      alt={alt || t('common.banner')}
      preview={false}
      className="admin-banners-image"
      wrapperClassName="admin-banners-image-wrapper"
    />
  )
}

function BannerActionMenu({ banner, onEditBanner, onDeleteBanner, getPopupContainer }) {
  const { t } = useTranslation('adminBanners')

  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      getPopupContainer={getPopupContainer}
      menu={{
        items: [
          {
            key: 'edit',
            icon: <EditOutlined />,
            label: t('common.edit')
          },
          {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: t('common.delete'),
            danger: true
          }
        ],
        onClick: ({ key, domEvent }) => {
          domEvent.stopPropagation()

          if (key === 'edit') {
            onEditBanner(banner)
          }

          if (key === 'delete') {
            onDeleteBanner(banner._id)
          }
        }
      }}
    >
      <Button
        type="text"
        icon={<MoreOutlined />}
        aria-label={t('table.openActions')}
        onClick={event => event.stopPropagation()}
        className="admin-banners-menu-btn"
      />
    </Dropdown>
  )
}

function BannerResponsiveItem({ banner, onEditBanner, onDeleteBanner, getPopupContainer }) {
  const { t, i18n } = useTranslation('adminBanners')
  const language = i18n.resolvedLanguage || i18n.language
  const localizedTitle = getLocalizedBannerTitle(banner, language, banner.title || t('common.banner'))
  const localizedLink = getLocalizedBannerLink(banner, language, banner.link || '')

  return (
    <article className="admin-banners-item">
      <div className="admin-banners-item__image">
        <BannerImage src={banner.img} alt={localizedTitle} />
      </div>

      <div className="admin-banners-item__content">
        <h3 className="admin-banners-item__title">{localizedTitle}</h3>
        <div className="admin-banners-item__link">
          <BannerLink link={localizedLink} compact />
        </div>
      </div>

      <div className="admin-banners-item__status">
        <BannerStatusTag value={banner.isActive} />
      </div>

      <div className="admin-banners-item__actions">
        <Button icon={<EditOutlined />} size="small" onClick={() => onEditBanner(banner)} className="admin-banners-action-btn">
          {t('common.edit')}
        </Button>
        <Button
          danger
          icon={<DeleteOutlined />}
          size="small"
          onClick={() => onDeleteBanner(banner._id)}
          className="admin-banners-action-btn admin-banners-action-btn--danger"
        >
          {t('common.delete')}
        </Button>
      </div>

      <div className="admin-banners-item__menu">
        <BannerActionMenu
          banner={banner}
          onEditBanner={onEditBanner}
          onDeleteBanner={onDeleteBanner}
          getPopupContainer={getPopupContainer}
        />
      </div>
    </article>
  )
}

function ResponsiveSkeletonList() {
  return (
    <div className="admin-banners-collection admin-banners-collection--loading">
      {Array.from({ length: 4 }).map((_, index) => (
        <article key={index} className="admin-banners-item admin-banners-item--loading">
          <div className="admin-banners-item__image">
            <Skeleton.Image active className="admin-banners-skeleton-image" />
          </div>
          <div className="admin-banners-item__content">
            <Skeleton active title={{ width: '70%' }} paragraph={{ rows: 2, width: ['55%', '42%'] }} />
          </div>
        </article>
      ))}
    </div>
  )
}

export default function AdminBannersTableSection({ banners, loading, onEditBanner, onDeleteBanner }) {
  const { t, i18n } = useTranslation('adminBanners')
  const language = i18n.resolvedLanguage || i18n.language
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const getPopupContainer = trigger => trigger?.closest('.admin-banners-page') || trigger?.parentElement || document.body

  const paginatedBanners = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return banners.slice(start, start + pageSize)
  }, [banners, currentPage, pageSize])

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(banners.length / pageSize))

    if (currentPage > maxPage) {
      setCurrentPage(maxPage)
    }
  }, [banners.length, currentPage, pageSize])

  const handlePaginationChange = (page, nextPageSize) => {
    if (nextPageSize !== pageSize) {
      setPageSize(nextPageSize)
      setCurrentPage(1)
      return
    }

    setCurrentPage(page)
  }

  const handleTableChange = pagination => {
    handlePaginationChange(pagination.current || 1, pagination.pageSize || pageSize)
  }

  const showTotal = (total, range) => t('table.showTotal', {
    rangeStart: range[0],
    rangeEnd: range[1],
    total
  })

  const columns = [
    {
      title: t('table.image'),
      dataIndex: 'img',
      key: 'img',
      width: 190,
      render: (img, record) => (
        <div className="admin-banners-table-image">
          <BannerImage src={img} alt={getLocalizedBannerTitle(record, language, record.title || t('common.banner'))} />
        </div>
      )
    },
    {
      title: t('table.title'),
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <span className="admin-banners-title-cell">
          {getLocalizedBannerTitle(record, language, title || t('common.banner'))}
        </span>
      )
    },
    {
      title: (
        <Space size={6}>
          <LinkOutlined />
          <span>{t('table.link')}</span>
        </Space>
      ),
      dataIndex: 'link',
      key: 'link',
      render: (link, record) => <BannerLink link={getLocalizedBannerLink(record, language, link || '')} />
    },
    {
      title: t('table.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 170,
      render: value => <BannerStatusTag value={value} />,
      filters: [
        { text: t('status.active'), value: true },
        { text: t('status.inactive'), value: false }
      ],
      onFilter: (value, record) => record.isActive === value
    },
    {
      title: t('table.actions'),
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t('table.editTooltip')}>
            <Button icon={<EditOutlined />} onClick={() => onEditBanner(record)} className="admin-banners-action-btn rounded-lg">
              {t('common.edit')}
            </Button>
          </Tooltip>

          <Tooltip title={t('table.deleteTooltip')}>
            <Button danger icon={<DeleteOutlined />} onClick={() => onDeleteBanner(record._id)} className="admin-banners-action-btn admin-banners-action-btn--danger rounded-lg">
              {t('common.delete')}
            </Button>
          </Tooltip>
        </Space>
      )
    }
  ]

  return (
    <>
      <div className="admin-banners-table-wrap">
        <Table
          rowKey="_id"
          dataSource={banners}
          columns={columns}
          loading={loading}
          getPopupContainer={getPopupContainer}
          pagination={{
            current: currentPage,
            pageSize,
            showSizeChanger: true,
            showTotal
          }}
          locale={{
            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('table.empty')} />
          }}
          onChange={handleTableChange}
          className="admin-banners-table"
        />
      </div>

      <div className="admin-banners-responsive">
        {loading ? (
          <ResponsiveSkeletonList />
        ) : banners.length > 0 ? (
          <>
            <div className="admin-banners-collection">
              {paginatedBanners.map(banner => (
                <BannerResponsiveItem
                  key={banner._id}
                  banner={banner}
                  onEditBanner={onEditBanner}
                  onDeleteBanner={onDeleteBanner}
                  getPopupContainer={getPopupContainer}
                />
              ))}
            </div>

            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={banners.length}
              showSizeChanger
              showTotal={showTotal}
              onChange={handlePaginationChange}
              size="small"
              className="admin-banners-responsive-pagination"
            />
          </>
        ) : (
          <div className="admin-banners-empty-state">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('table.empty')} />
          </div>
        )}
      </div>
    </>
  )
}
