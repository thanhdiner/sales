const OrdersHeader = () => {
  return (
    <header className="mb-5">
      <p className="mb-2 hidden text-sm font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400 md:block">
        Orders
      </p>

      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white md:text-3xl">
        Lịch sử mua hàng
      </h1>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300 md:text-base md:leading-7">
        Theo dõi trạng thái đơn hàng và xem lại thông tin bàn giao tài khoản số của bạn.
      </p>
    </header>
  )
}

export default OrdersHeader
