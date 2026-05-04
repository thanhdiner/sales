import debounce from 'lodash.debounce'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ClientBreadcrumb from '@/components/client/Breadcrumb'
import MobileBackButton from '@/components/shared/MobileBackButton'
import SearchInput from '@/components/shared/SearchInput'
import SEO from '@/components/shared/SEO'
import { getMyOrders } from '@/services/client/commerce/order'
import { removeVietnameseTones } from '@/utils/removeVietnameseTones'
import OrdersEmptyState from './components/OrdersEmptyState'
import OrdersList from './sections/OrdersList'
import OrdersLoadingState from './components/OrdersLoadingState'
import OrdersHeader from './sections/OrdersHeader'
import OrdersStatusFilter from './sections/OrdersStatusFilter'

const FILTERABLE_STATUSES = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled']
const SEARCH_DEBOUNCE_MS = 300

const normalizeSearchValue = value => removeVietnameseTones(String(value || '')).toLowerCase().trim()

const isFuzzySubsequenceMatch = (query, text) => {
  if (!query) return true
  if (!text) return false

  let queryIndex = 0

  for (const character of text) {
    if (character === query[queryIndex]) queryIndex += 1
    if (queryIndex === query.length) return true
  }

  return false
}

const getOrderSearchText = order => {
  const productNames = (order.orderItems || []).map(item => item.name).join(' ')
  return normalizeSearchValue(`${order._id || ''} ${productNames}`)
}

export default function Orders() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const querySearchValue = searchParams.get('q') || ''
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState(querySearchValue)
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(querySearchValue)

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)

      try {
        const response = await getMyOrders()
        if (response.success) setOrders(response.orders)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const updateDebouncedSearchValue = useMemo(
    () => debounce(nextValue => setDebouncedSearchValue(nextValue), SEARCH_DEBOUNCE_MS),
    []
  )

  useEffect(() => {
    setSearchValue(querySearchValue)
    setDebouncedSearchValue(querySearchValue)
  }, [querySearchValue])

  useEffect(() => {
    updateDebouncedSearchValue(searchValue)
    return () => updateDebouncedSearchValue.cancel()
  }, [searchValue, updateDebouncedSearchValue])

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams)
    const trimmedSearch = debouncedSearchValue.trim()

    if (trimmedSearch) nextParams.set('q', trimmedSearch)
    else nextParams.delete('q')

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true })
    }
  }, [debouncedSearchValue, searchParams, setSearchParams])

  const activeStatus = searchParams.get('status')
  const filteredOrders = useMemo(() => {
    const normalizedSearch = normalizeSearchValue(debouncedSearchValue)

    return orders.filter(order => {
      const matchesStatus = FILTERABLE_STATUSES.includes(activeStatus) ? order.status === activeStatus : true
      const orderSearchText = getOrderSearchText(order)
      const matchesSearch = normalizedSearch
        ? orderSearchText.includes(normalizedSearch) || isFuzzySubsequenceMatch(normalizedSearch, orderSearchText)
        : true

      return matchesStatus && matchesSearch
    })
  }, [activeStatus, debouncedSearchValue, orders])

  const handleStatusFilterChange = status => {
    const nextParams = new URLSearchParams(searchParams)

    if (status === 'all') nextParams.delete('status')
    else nextParams.set('status', status)

    setSearchParams(nextParams)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-4 py-12 dark:bg-gray-900">
        <SEO title="Lịch sử mua hàng" noIndex />

        <div className="mx-auto max-w-5xl">
          <ClientBreadcrumb
            className="mb-4 hidden md:flex"
            label="Điều hướng lịch sử mua hàng"
            items={[
              { label: 'Trang chủ', to: '/' },
              { label: 'Lịch sử mua hàng' }
            ]}
          />

          <MobileBackButton label="Quay lại" />

          <div className="flex min-h-[50vh] items-center justify-center">
            <OrdersLoadingState />
          </div>
        </div>
      </div>
    )
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen bg-white px-4 py-12 dark:bg-gray-900">
        <SEO title="Lịch sử mua hàng" noIndex />

        <div className="mx-auto max-w-xl">
          <ClientBreadcrumb
            className="mb-4 hidden md:flex"
            label="Điều hướng lịch sử mua hàng"
            items={[
              { label: 'Trang chủ', to: '/' },
              { label: 'Lịch sử mua hàng' }
            ]}
          />

          <MobileBackButton label="Quay lại" />

          <div className="flex min-h-[50vh] items-center justify-center">
            <OrdersEmptyState onStartShopping={() => navigate('/')} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-gray-900 md:bg-white md:py-10 md:dark:bg-gray-900">
      <SEO title="Lịch sử mua hàng" noIndex />

      <div className="mx-auto max-w-4xl">
        <ClientBreadcrumb
          className="mb-4 hidden md:flex"
          label="Điều hướng lịch sử mua hàng"
          items={[
            { label: 'Trang chủ', to: '/' },
            { label: 'Lịch sử mua hàng' }
          ]}
        />

        <MobileBackButton label="Lịch sử mua hàng" />
        <OrdersHeader />

        <SearchInput
          value={searchValue}
          onChange={event => setSearchValue(event.target.value)}
          onClear={() => setSearchValue('')}
          placeholder="Tìm theo mã đơn / tên sản phẩm..."
          className="mb-4 w-full"
        />

        <OrdersStatusFilter activeStatus={activeStatus} onChange={handleStatusFilterChange} />
        <OrdersList
          orders={filteredOrders}
          onSelectOrder={orderId => navigate(`/orders/${orderId}`)}
        />
      </div>
    </div>
  )
}
