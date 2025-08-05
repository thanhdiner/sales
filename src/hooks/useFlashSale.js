import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import flashSaleService, { flashSaleHelpers } from '../services/flashSaleService'

export const useFlashSale = () => {
  const [flashSales, setFlashSales] = useState([])
  const [loading, setLoading] = useState(false)
  const [statistics, setStatistics] = useState(null)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  // Fetch flash sales with pagination and filters
  const fetchFlashSales = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const response = await flashSaleService.getFlashSales({
        currentPage: params.current || 1,
        limitItems: params.pageSize || 10,
        name: params.name || '',
        status: params.status || '',
        sortField: params.sortField || 'createdAt',
        sortOrder: params.sortOrder || 'descend',
        ...params
      })

      setFlashSales(response.flashsales || [])
      setPagination({
        current: response.currentPage || 1,
        pageSize: response.limitItems || 10,
        total: response.total || 0
      })
    } catch (error) {
      console.error('Error fetching flash sales:', error)
      message.error('Không thể tải danh sách flash sale')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    try {
      const response = await flashSaleService.getFlashSaleStatistics()
      setStatistics(response.data)
    } catch (error) {
      console.error('Error fetching statistics:', error)
      message.error('Không thể tải thống kê')
    }
  }, [])

  // Create new flash sale
  const createFlashSale = useCallback(
    async flashSaleData => {
      setLoading(true)
      try {
        // Validate data
        const errors = flashSaleHelpers.validateFlashSaleData(flashSaleData)
        if (errors.length > 0) {
          message.error(errors[0])
          return { success: false, errors }
        }

        const response = await flashSaleService.createFlashSale(flashSaleData)
        message.success('Tạo flash sale thành công!')

        // Refresh data
        await fetchFlashSales()
        await fetchStatistics()

        return { success: true, data: response.data }
      } catch (error) {
        console.error('Error creating flash sale:', error)
        const errorMessage = error.response?.data?.error || 'Không thể tạo flash sale'
        message.error(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [fetchFlashSales, fetchStatistics]
  )

  // Update flash sale
  const updateFlashSale = useCallback(
    async (id, updateData) => {
      setLoading(true)
      try {
        // Validate data
        const errors = flashSaleHelpers.validateFlashSaleData(updateData)
        if (errors.length > 0) {
          message.error(errors[0])
          return { success: false, errors }
        }

        const response = await flashSaleService.updateFlashSale(id, updateData)
        message.success('Cập nhật flash sale thành công!')

        // Refresh data
        await fetchFlashSales()
        await fetchStatistics()

        return { success: true, data: response.flashsale }
      } catch (error) {
        console.error('Error updating flash sale:', error)
        const errorMessage = error.response?.data?.error || 'Không thể cập nhật flash sale'
        message.error(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [fetchFlashSales, fetchStatistics]
  )

  // Delete flash sale
  const deleteFlashSale = useCallback(
    async id => {
      try {
        await flashSaleService.deleteFlashSale(id)
        message.success('Xóa flash sale thành công!')

        // Refresh data
        await fetchFlashSales()
        await fetchStatistics()

        return { success: true }
      } catch (error) {
        console.error('Error deleting flash sale:', error)
        const errorMessage = error.response?.data?.error || 'Không thể xóa flash sale'
        message.error(errorMessage)
        return { success: false, error: errorMessage }
      }
    },
    [fetchFlashSales, fetchStatistics]
  )

  // Delete multiple flash sales
  const deleteManyFlashSales = useCallback(
    async ids => {
      try {
        await flashSaleService.deleteManyFlashSales(ids)
        message.success(`Đã xóa ${ids.length} flash sale thành công!`)

        // Refresh data
        await fetchFlashSales()
        await fetchStatistics()

        return { success: true }
      } catch (error) {
        console.error('Error deleting multiple flash sales:', error)
        const errorMessage = error.response?.data?.error || 'Không thể xóa flash sales'
        message.error(errorMessage)
        return { success: false, error: errorMessage }
      }
    },
    [fetchFlashSales, fetchStatistics]
  )

  // Change flash sale status
  const changeFlashSaleStatus = useCallback(async id => {
    try {
      const response = await flashSaleService.changeFlashSaleStatus(id)
      message.success('Thay đổi trạng thái thành công!')

      // Update local state
      setFlashSales(prev => prev.map(fs => (fs._id === id ? { ...fs, isActive: response.isActive } : fs)))

      return { success: true, data: response }
    } catch (error) {
      console.error('Error changing flash sale status:', error)
      const errorMessage = error.response?.data?.error || 'Không thể thay đổi trạng thái'
      message.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  // Change multiple flash sale statuses
  const changeManyFlashSaleStatus = useCallback(
    async (ids, isActive) => {
      try {
        await flashSaleService.changeManyFlashSaleStatus(ids, isActive)
        message.success(`Đã thay đổi trạng thái ${ids.length} flash sale!`)

        // Refresh data
        await fetchFlashSales()

        return { success: true }
      } catch (error) {
        console.error('Error changing multiple flash sale statuses:', error)
        const errorMessage = error.response?.data?.error || 'Không thể thay đổi trạng thái'
        message.error(errorMessage)
        return { success: false, error: errorMessage }
      }
    },
    [fetchFlashSales]
  )

  // Change multiple flash sale positions
  const changeManyFlashSalePosition = useCallback(
    async data => {
      try {
        await flashSaleService.changeManyFlashSalePosition(data)
        message.success(`Đã cập nhật vị trí ${data.length} flash sale!`)

        // Refresh data
        await fetchFlashSales()

        return { success: true }
      } catch (error) {
        console.error('Error changing flash sale positions:', error)
        const errorMessage = error.response?.data?.error || 'Không thể thay đổi vị trí'
        message.error(errorMessage)
        return { success: false, error: errorMessage }
      }
    },
    [fetchFlashSales]
  )

  // Get flash sale by ID
  const getFlashSaleById = useCallback(async id => {
    try {
      const response = await flashSaleService.getFlashSaleById(id)
      return { success: true, data: response.flashsale }
    } catch (error) {
      console.error('Error fetching flash sale details:', error)
      const errorMessage = error.response?.data?.message || 'Không thể tải chi tiết flash sale'
      message.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  // Get active flash sales (for client)
  const getActiveFlashSales = useCallback(async () => {
    try {
      const response = await flashSaleService.getActiveFlashSales()
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error fetching active flash sales:', error)
      return { success: false, error: 'Không thể tải flash sale đang hoạt động' }
    }
  }, [])

  // Initialize data
  useEffect(() => {
    fetchFlashSales()
    fetchStatistics()
  }, [fetchFlashSales, fetchStatistics])

  return {
    // State
    flashSales,
    loading,
    statistics,
    pagination,

    // Actions
    fetchFlashSales,
    fetchStatistics,
    createFlashSale,
    updateFlashSale,
    deleteFlashSale,
    deleteManyFlashSales,
    changeFlashSaleStatus,
    changeManyFlashSaleStatus,
    changeManyFlashSalePosition,
    getFlashSaleById,
    getActiveFlashSales,

    // Helpers
    helpers: flashSaleHelpers
  }
}

export default useFlashSale
