import SimpleSelect from '@/components/shared/SimpleSelect'

const filterItems = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chờ xác nhận', value: 'pending' },
  { label: 'Đang xử lý', value: 'confirmed' },
  { label: 'Hoàn tất', value: 'completed' },
  { label: 'Đã bàn giao', value: 'shipping' },
  { label: 'Đã hủy', value: 'cancelled' }
]

function OrdersStatusFilter({ activeStatus, onChange }) {
  return (
    <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-4">
      <SimpleSelect
        label="Lọc trạng thái"
        options={filterItems}
        value={activeStatus || 'all'}
        onChange={onChange}
      />
    </div>
  )
}

export default OrdersStatusFilter
