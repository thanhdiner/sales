function CartHeader({ itemCount, t }) {
  return (
    <div className="mb-6 rounded-xl bg-white px-5 py-5 shadow-sm ring-1 ring-gray-200 dark:bg-gray-950 dark:ring-gray-800">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 lg:text-3xl">{t('page.title')}</h1>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('page.itemCount', { count: itemCount })}</p>
    </div>
  )
}

export default CartHeader
