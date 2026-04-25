import { Edit2, Trash2 } from 'lucide-react'
import { Button, Pagination } from 'antd'
import dayjs from 'dayjs'
import {
  formatCurrency,
  getFlashSaleProgressPercent,
  getFlashSaleStatusMeta
} from '../utils/flashSaleHelpers'

export default function FlashSalesTable({
  flashSales,
  total,
  currentPage,
  pageSize,
  tableLoading,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow)]">
      <div className="-mx-2 overflow-x-auto sm:mx-0">
        <table className="min-w-[960px] divide-y divide-[var(--admin-border)] text-sm">
          <thead className="bg-[var(--admin-surface-2)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--admin-text-muted)]">
                Tên Chương Trình
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--admin-text-muted)]">
                Thời Gian
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--admin-text-muted)]">
                Giảm Giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--admin-text-muted)]">
                Số Lượng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--admin-text-muted)]">
                Trạng Thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--admin-text-muted)]">
                Doanh Thu
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--admin-text-muted)]">
                Thao Tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--admin-border)] bg-[var(--admin-surface)]">
            {tableLoading ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-[var(--admin-text-subtle)]">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : flashSales.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-[var(--admin-text-subtle)]">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              flashSales.map(sale => {
                const statusMeta = getFlashSaleStatusMeta(sale.status)
                const progressPercent = getFlashSaleProgressPercent(sale)

                return (
                  <tr key={sale._id}>
                    <td className="whitespace-nowrap px-6 py-4 align-top">
                      <div>
                        <div className="text-sm font-medium text-[var(--admin-text)]">{sale.name}</div>
                        <div className="text-sm text-[var(--admin-text-muted)]">{sale.products.length} sản phẩm</div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 align-top">
                      <div className="text-sm text-[var(--admin-text)]">{dayjs(sale.startAt).format('YYYY-MM-DD HH:mm')}</div>
                      <div className="text-sm text-[var(--admin-text-muted)]">
                        đến {dayjs(sale.endAt).format('YYYY-MM-DD HH:mm')}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 align-top">
                      <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 dark:border-rose-500/35 dark:bg-rose-500/10 dark:text-rose-200">
                        -{sale.discountPercent}%
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 align-top">
                      <div className="text-sm text-[var(--admin-text)]">
                        {sale.soldQuantity}/{sale.maxQuantity}
                      </div>

                      <div className="mt-1 h-2 w-full rounded-full bg-[var(--admin-surface-3)]">
                        <div className="h-2 rounded-full bg-[var(--admin-accent)]" style={{ width: `${progressPercent}%` }} />
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 align-top">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusMeta.className}`}>
                        {statusMeta.label}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 align-top text-sm text-[var(--admin-text)]">
                      {formatCurrency(sale.revenue)}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium align-top">
                      <div className="flex justify-end space-x-2">
                        <Button type="link" onClick={() => onEdit(sale)} icon={<Edit2 className="h-4 w-4" />} />
                        <Button type="link" danger onClick={() => onDelete(sale._id)} icon={<Trash2 className="h-4 w-4" />} />
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end border-t border-[var(--admin-border)] px-4 py-4 sm:px-6">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          showQuickJumper
          showTotal={(count, range) => `${range[0]}-${range[1]} của ${count} flash sale`}
          onChange={onPageChange}
          onShowSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  )
}

