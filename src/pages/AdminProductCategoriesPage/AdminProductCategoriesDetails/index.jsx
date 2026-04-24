import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Skeleton } from 'antd'
import { ArrowLeftOutlined, EditOutlined, FolderOpenOutlined, HistoryOutlined, TagOutlined } from '@ant-design/icons'
import SEO from '@/components/SEO'
import { getProductCategoryById } from '@/services/adminProductCategoryService'
import { formatDate } from '@/helpers/formatDate'
import { capitalize } from '@/utils/capitalize'
import AdminProductCategoryThumbnail from './components/AdminProductCategoryThumbnail'
import './AdminProductCategoriesDetails.scss'

const getStatusClasses = status => {
  if (status === 'active') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
  }

  return 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'
}

const getOverviewCards = category => [
  {
    label: 'Trạng thái',
    value: capitalize(category.status || 'inactive'),
    icon: <TagOutlined />,
    tone: 'from-emerald-500/15 via-white to-white dark:from-emerald-500/10 dark:via-gray-900 dark:to-gray-900'
  },
  {
    label: 'Vị trí hiển thị',
    value: category.position ?? '—',
    icon: <FolderOpenOutlined />,
    tone: 'from-sky-500/15 via-white to-white dark:from-sky-500/10 dark:via-gray-900 dark:to-gray-900'
  },
  {
    label: 'Ngày tạo',
    value: formatDate(category.createdAt),
    icon: <HistoryOutlined />,
    tone: 'from-violet-500/15 via-white to-white dark:from-violet-500/10 dark:via-gray-900 dark:to-gray-900'
  },
  {
    label: 'Cập nhật gần nhất',
    value: category.updatedAt ? formatDate(category.updatedAt) : '—',
    icon: <HistoryOutlined />,
    tone: 'from-amber-500/15 via-white to-white dark:from-amber-500/10 dark:via-gray-900 dark:to-gray-900'
  }
]

function DetailBlock({ title, subtitle, children }) {
  return (
    <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

function MetaItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/60">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-200">{value || '—'}</p>
    </div>
  )
}

function AdminProductCategoriesDetails() {
  const { id } = useParams()
  const [productCategory, setProductCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      setIsLoading(true)
      setHasError(false)
      try {
        const { productCategory } = await getProductCategoryById(id)
        setProductCategory(productCategory)
      } catch (err) {
        console.error('Failed to fetch product category:', err)
        setProductCategory(null)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [id])

  const updateHistory = useMemo(() => {
    if (!productCategory?.updateBy?.length) return []

    return productCategory.updateBy.map((item, index) => ({
      id: `${item.account_id || 'unknown'}-${item.updatedAt || index}`,
      accountId: item.account_id || '—',
      updatedAt: item.updatedAt ? formatDate(item.updatedAt) : '—'
    }))
  }, [productCategory])

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-gray-900 md:p-6">
      <SEO title="Admin – Chi tiết danh mục" noIndex />

      <div className="mx-auto max-w-7xl space-y-6">
        {isLoading ? (
          <>
            <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8">
              <Skeleton active paragraph={{ rows: 3 }} title={{ width: '36%' }} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton.Button key={index} active block style={{ height: 140, borderRadius: 24 }} />
              ))}
            </div>
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_360px]">
              <Skeleton active paragraph={{ rows: 10 }} className="rounded-[28px] border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800" />
              <Skeleton active paragraph={{ rows: 8 }} className="rounded-[28px] border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800" />
            </div>
          </>
        ) : !productCategory ? (
          <div className="rounded-[32px] border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">Danh mục sản phẩm</p>
            <h1 className="mt-3 text-3xl font-semibold text-gray-900 dark:text-white">
              {hasError ? 'Không thể tải dữ liệu danh mục' : 'Không tìm thấy danh mục'}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
              Kiểm tra lại đường dẫn hoặc quay về trang quản lý danh mục để chọn một bản ghi khác.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/admin/product-categories">
                <Button size="large" className="h-11 rounded-xl px-5">
                  Quay lại danh sách
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <header className="overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-7 text-white md:px-8 md:py-9">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                  <div className="max-w-4xl">
                    <Link
                      to="/admin/product-categories"
                      className="inline-flex items-center gap-2 text-sm font-medium text-slate-200 transition hover:text-white"
                    >
                      <ArrowLeftOutlined />
                      Quay lại danh sách danh mục
                    </Link>

                    <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                      Product category overview
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
                      {productCategory.title}
                    </h1>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusClasses(productCategory.status)}`}
                      >
                        {capitalize(productCategory.status || 'inactive')}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-slate-100">
                        Slug: {productCategory.slug || '—'}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-slate-100">
                        Danh mục cha: {productCategory?.parent_id?.title || 'Không có'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link to="/admin/product-categories">
                      <Button size="large" className="h-11 rounded-xl border-white/20 bg-white/10 px-5 text-white hover:!border-white hover:!bg-white/20 hover:!text-white">
                        Danh sách danh mục
                      </Button>
                    </Link>
                    <Link to={`/admin/product-categories/edit/${productCategory._id}`}>
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="large"
                        className="h-11 rounded-xl bg-white px-5 font-medium !text-slate-900 shadow-none hover:!bg-slate-100"
                      >
                        Chỉnh sửa danh mục
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 bg-white p-4 dark:bg-gray-800 md:grid-cols-2 xl:grid-cols-4 md:p-6">
                {getOverviewCards(productCategory).map(card => (
                  <div
                    key={card.label}
                    className={`rounded-[24px] border border-gray-200 bg-gradient-to-br ${card.tone} p-5 dark:border-gray-700`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
                        <p className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">{card.value}</p>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-base text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-200">
                        {card.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </header>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_360px]">
              <div className="space-y-6">
                <DetailBlock title="Tổng quan" subtitle="Các thông tin định danh và trạng thái hiển thị của danh mục.">
                  <div className="grid gap-4 md:grid-cols-2">
                    <MetaItem label="Tên danh mục" value={productCategory.title} />
                    <MetaItem label="Slug" value={productCategory.slug} />
                    <MetaItem label="Danh mục cha" value={productCategory?.parent_id?.title || 'Không có'} />
                    <MetaItem label="Vị trí" value={productCategory.position ?? '—'} />
                  </div>
                </DetailBlock>

                <DetailBlock title="Mô tả" subtitle="Nội dung giới thiệu hiển thị cho danh mục sản phẩm này.">
                  {productCategory.description ? (
                    <div className="admin-product-category-richtext text-sm leading-7 text-gray-600 dark:text-gray-300">
                      <div dangerouslySetInnerHTML={{ __html: productCategory.description }} />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Danh mục này chưa có mô tả ngắn.</p>
                  )}
                </DetailBlock>

                <DetailBlock title="Nội dung chi tiết" subtitle="Phần nội dung mở rộng nếu danh mục có cấu hình thêm.">
                  {productCategory.content ? (
                    <div className="admin-product-category-richtext text-sm leading-7 text-gray-600 dark:text-gray-300">
                      <div dangerouslySetInnerHTML={{ __html: productCategory.content }} />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Danh mục này chưa có nội dung chi tiết.</p>
                  )}
                </DetailBlock>

                <DetailBlock title="Lịch sử cập nhật" subtitle="Theo dõi các lần chỉnh sửa gần đây của danh mục.">
                  {updateHistory.length ? (
                    <div className="space-y-3">
                      {updateHistory.map(item => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/60 md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{item.accountId}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Tài khoản thực hiện cập nhật</p>
                          </div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-300">{item.updatedAt}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Chưa có lịch sử cập nhật được ghi nhận.</p>
                  )}
                </DetailBlock>
              </div>

              <aside className="space-y-6">
                <AdminProductCategoryThumbnail thumbnail={productCategory.thumbnail} title={productCategory.title} />

                <DetailBlock title="Thông tin quản trị" subtitle="Metadata nội bộ để theo dõi bản ghi này.">
                  <div className="space-y-3">
                    <MetaItem label="Người tạo" value={productCategory.createdBy?.account_id || '—'} />
                    <MetaItem label="Ngày tạo" value={formatDate(productCategory.createdAt)} />
                    <MetaItem label="Cập nhật gần nhất" value={productCategory.updatedAt ? formatDate(productCategory.updatedAt) : '—'} />
                  </div>
                </DetailBlock>

                <DetailBlock title="Thao tác nhanh" subtitle="Điều hướng nhanh tới các trang quản trị liên quan.">
                  <div className="space-y-3">
                    <Link to="/admin/product-categories" className="block">
                      <Button size="large" className="h-11 w-full rounded-xl">
                        Quay lại danh sách
                      </Button>
                    </Link>
                    <Link to={`/admin/product-categories/edit/${productCategory._id}`} className="block">
                      <Button type="primary" size="large" icon={<EditOutlined />} className="h-11 w-full rounded-xl bg-gray-900 shadow-none hover:!bg-gray-800">
                        Chỉnh sửa ngay
                      </Button>
                    </Link>
                  </div>
                </DetailBlock>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminProductCategoriesDetails
