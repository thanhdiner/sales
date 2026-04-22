import React from 'react'
import OrderListItem from './OrderListItem'

const OrdersList = ({ orders, onSelectOrder }) => {
  return (
    <div className="space-y-4">
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