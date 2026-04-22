import { Edit2, Trash2 } from 'lucide-react'
import { Button } from 'antd'
import dayjs from 'dayjs'
import {
  formatCurrency,
  getFlashSaleProgressPercent,
  getFlashSaleStatusMeta
} from '../utils/flashSaleHelpers'

export default function FlashSalesTable({ flashSales, tableLoading, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-gray-800">
      <div className="-mx-2 overflow-x-auto sm:mx-0">
        <table className="min-w-[960px] divide-y divide-gray-200 text-sm dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white">
                Tên Chương Trình
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white">
                Thời Gian
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white">
                Giảm Giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white">
                Số Lượng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white">
                Trạng Thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white">
                Doanh Thu
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white">
                Thao Tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {tableLoading ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-400">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : flashSales.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-400">
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
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{sale.name}</div>
                        <div className="text-sm text-gray-500 dark:text-white">{sale.products.length} sản phẩm</div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 align-top">
                      <div className="text-sm text-gray-900 dark:text-white">{dayjs(sale.startAt).format('YYYY-MM-DD HH:mm')}</div>
                      <div className="text-sm text-gray-500 dark:text-white">
                        đến {dayjs(sale.endAt).format('YYYY-MM-DD HH:mm')}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 align-top">
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        -{sale.discountPercent}%
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 align-top">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {sale.soldQuantity}/{sale.maxQuantity}
                      </div>

                      <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                        <div className="h-2 rounded-full bg-blue-600" style={{ width: `${progressPercent}%` }} />
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 align-top">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusMeta.className}`}>
                        {statusMeta.label}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 align-top text-sm text-gray-900 dark:text-white">
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
    </div>
  )
}
