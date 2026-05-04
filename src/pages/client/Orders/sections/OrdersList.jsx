import OrderListItem from '../components/OrderListItem'

const OrdersList = ({ orders, onSelectOrder }) => {
  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Không tìm thấy đơn hàng</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Thử đổi trạng thái hoặc từ khóa tìm kiếm khác.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {orders.map(order => (
        <OrderListItem
          key={order._id}
          order={order}
          onSelectOrder={onSelectOrder}
        />
      ))}
    </div>
  )
}

export default OrdersList
