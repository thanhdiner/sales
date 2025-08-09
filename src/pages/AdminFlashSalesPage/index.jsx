import React, { useState, useEffect, useMemo } from 'react'
import { Plus, Edit2, Trash2, Clock, Tag, TrendingUp, ShoppingCart } from 'lucide-react'
import { Modal, Select, Input, Button, DatePicker, InputNumber, message } from 'antd'
import dayjs from 'dayjs'
import debounce from 'lodash.debounce'
import { getAdminFlashSales, createFlashSale, updateFlashSaleById, deleteFlashSale } from '@/services/adminFlashSalesService'
import { getAdminProducts } from '@/services/productService'
import titles from '@/utils/titles'

const { Option } = Select

const FlashSaleAdmin = () => {
  titles('Quản lý Flash Sale')

  const [flashSales, setFlashSales] = useState([])
  const [productList, setProductList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    startAt: null,
    endAt: null,
    discountPercent: '',
    maxQuantity: '',
    products: []
  })
  const [tableLoading, setTableLoading] = useState(false)
  const [productLoading, setProductLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    fetchFlashSales()
  }, [])

  const handleOpenCreate = async () => {
    setProductLoading(true)
    try {
      const res = await getAdminProducts({ page: 1, limit: 20 })
      setProductList(res.products || [])
    } catch {
      setProductList([])
    }
    setShowModal(true)
    setEditingItem(null)
    setFormData({
      name: '',
      startAt: null,
      endAt: null,
      discountPercent: '',
      maxQuantity: '',
      products: []
    })
    setProductLoading(false)
  }

  // Fetch 20 sản phẩm đầu và list sản phẩm đang được chọn khi edit
  const handleEdit = async item => {
    setProductLoading(true)
    try {
      const res = await getAdminProducts({ page: 1, limit: 20 })
      let selectedIds = item.products.map(p => (typeof p === 'object' ? p._id : p))
      let mergedProducts = [...res.products]
      selectedIds.forEach(id => {
        if (!mergedProducts.find(p => p._id === id)) {
          mergedProducts.push({ _id: id, title: 'Đang tải...' })
        }
      })
      setProductList(mergedProducts)
      setEditingItem(item)
      setFormData({
        name: item.name,
        startAt: dayjs(item.startAt),
        endAt: dayjs(item.endAt),
        discountPercent: item.discountPercent,
        maxQuantity: item.maxQuantity,
        products: selectedIds
      })
      setShowModal(true)
    } catch {
      setProductList([])
    }
    setProductLoading(false)
  }

  const handleDelete = _id => {
    Modal.confirm({
      title: <span className="dark:text-white">Xác nhận xóa</span>,
      content: <span className="dark:text-white">Bạn có chắc chắn muốn xóa flash sale này?</span>,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteFlashSale(_id)
          message.success('Đã xóa flash sale thành công')
          fetchFlashSales()
        } catch (err) {
          message.error(err.message || 'Xóa thất bại')
        }
      }
    })
  }

  // SERVER-SIDE SEARCH khi gõ vào select (debounced)
  const handleSearchProduct = async value => {
    setProductLoading(true)
    try {
      const res = await getAdminProducts({ page: 1, limit: 20, productName: value })
      setProductList(res.products || [])
    } catch {
      setProductList([])
    }
    setProductLoading(false)
  }
  // Debounce hàm search 400ms
  const debouncedSearchProduct = useMemo(() => debounce(handleSearchProduct, 400), [])

  useEffect(() => {
    // Huỷ debounce khi unmount tránh memory leak
    return () => debouncedSearchProduct.cancel()
  }, [debouncedSearchProduct])

  const fetchFlashSales = async () => {
    try {
      setTableLoading(true)
      const res = await getAdminFlashSales()
      setFlashSales(res.flashSales || [])
    } catch {
      setFlashSales([])
    } finally {
      setTableLoading(false)
    }
  }

  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = status => {
    switch (status) {
      case 'active':
        return 'Đang diễn ra'
      case 'scheduled':
        return 'Đã lên lịch'
      case 'completed':
        return 'Đã kết thúc'
      default:
        return 'Không xác định'
    }
  }

  const formatCurrency = amount => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.startAt ||
      !formData.endAt ||
      !formData.discountPercent ||
      !formData.maxQuantity ||
      formData.products.length === 0
    ) {
      message.warning('Vui lòng nhập đầy đủ thông tin!')
      return
    }
    setSubmitLoading(true)

    const dataToSend = {
      name: formData.name,
      startAt: formData.startAt.toISOString(),
      endAt: formData.endAt.toISOString(),
      discountPercent: parseInt(formData.discountPercent),
      maxQuantity: parseInt(formData.maxQuantity),
      products: formData.products
    }

    try {
      if (editingItem) {
        await updateFlashSaleById(editingItem._id, dataToSend)
        message.success('Cập nhật thành công')
      } else {
        await createFlashSale(dataToSend)
        message.success('Tạo flash sale thành công')
      }
      setShowModal(false)
      setEditingItem(null)
      setFormData({
        name: '',
        startAt: null,
        endAt: null,
        discountPercent: '',
        maxQuantity: '',
        products: []
      })
      fetchFlashSales()
    } catch (err) {
      message.error(err.message || 'Có lỗi xảy ra')
    } finally {
      setSubmitLoading(false)
    }
  }

  const totalRevenue = flashSales.reduce((sum, sale) => sum + sale.revenue, 0)
  const activeSales = flashSales.filter(sale => sale.status === 'active').length
  const totalProducts = flashSales.reduce((sum, sale) => sum + sale.soldQuantity, 0)

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 dark:bg-gray-800 rounded-xl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">Quản Lý Flash Sale</h1>
          <p className="text-gray-600 dark:text-gray-400">Quản lý các chương trình khuyến mãi flash sale</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800 dark:text-gray-100 dark:outline dark:outline-2 dark:outline-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Tổng Doanh Thu</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800 dark:text-gray-100 dark:outline dark:outline-2 dark:outline-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Sale Đang Diễn Ra</p>
                <p className="text-2xl font-bold text-blue-600">{activeSales}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800 dark:text-gray-100 dark:outline dark:outline-2 dark:outline-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Tổng Sản Phẩm Bán</p>
                <p className="text-2xl font-bold text-purple-600">{totalProducts}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 dark:bg-gray-800 dark:text-gray-100 dark:outline dark:outline-2 dark:outline-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Tổng Chương Trình</p>
                <p className="text-2xl font-bold text-orange-600">{flashSales.length}</p>
              </div>
              <Tag className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <div className="flex flex-wrap gap-3">{/* Filters sau này */}</div>
          <div>
            <Button type="primary" icon={<Plus className="h-4 w-4" />} onClick={handleOpenCreate} className="w-full sm:w-auto">
              Tạo Flash Sale Mới
            </Button>
          </div>
        </div>

        {/* Flash Sales Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden dark:bg-gray-800">
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="min-w-[960px] divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">
                    Tên Chương Trình
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">
                    Thời Gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">
                    Giảm Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">
                    Số Lượng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">
                    Doanh Thu
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {tableLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : flashSales.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  flashSales.map(sale => (
                    <tr key={sale._id}>
                      <td className="px-6 py-4 whitespace-nowrap align-top">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{sale.name}</div>
                          <div className="text-sm text-gray-500 dark:text-white">{sale.products.length} sản phẩm</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap align-top">
                        <div className="text-sm text-gray-900 dark:text-white">{dayjs(sale.startAt).format('YYYY-MM-DD HH:mm')}</div>
                        <div className="text-sm text-gray-500 dark:text-white">đến {dayjs(sale.endAt).format('YYYY-MM-DD HH:mm')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap align-top">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          -{sale.discountPercent}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap align-top">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {sale.soldQuantity}/{sale.maxQuantity}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(sale.soldQuantity / sale.maxQuantity) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap align-top">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            sale.status
                          )}`}
                        >
                          {getStatusText(sale.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white align-top">
                        {formatCurrency(sale.revenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                        <div className="flex justify-end space-x-2">
                          <Button type="link" onClick={() => handleEdit(sale)} icon={<Edit2 className="h-4 w-4" />} />
                          <Button type="link" danger onClick={() => handleDelete(sale._id)} icon={<Trash2 className="h-4 w-4" />} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        <Modal
          title={
            editingItem ? (
              <span className="dark:text-white">Chỉnh Sửa Flash Sale</span>
            ) : (
              <span className="dark:text-white">Tạo Flash Sale Mới</span>
            )
          }
          open={showModal}
          onCancel={() => {
            setShowModal(false)
            setEditingItem(null)
            setFormData({
              name: '',
              startAt: null,
              endAt: null,
              discountPercent: '',
              maxQuantity: '',
              products: []
            })
          }}
          onOk={handleSubmit}
          confirmLoading={submitLoading}
          destroyOnClose
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                Tên chương trình <span className="text-red-500">*</span>
              </label>
              <Input
                required
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Nhập tên chương trình flash sale"
                className="dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                  Ngày & giờ bắt đầu <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  showTime
                  value={formData.startAt}
                  onChange={val => handleChange('startAt', val)}
                  className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-500"
                  format="YYYY-MM-DD HH:mm"
                  placeholder="Ngày bắt đầu"
                  getPopupContainer={trigger => trigger.parentNode}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                  Ngày & giờ kết thúc <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  showTime
                  value={formData.endAt}
                  onChange={val => handleChange('endAt', val)}
                  className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-500"
                  format="YYYY-MM-DD HH:mm"
                  placeholder="Ngày kết thúc"
                  getPopupContainer={trigger => trigger.parentNode}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                  Phần trăm giảm giá (%) <span className="text-red-500">*</span>
                </label>
                <InputNumber
                  required
                  min={1}
                  max={90}
                  value={formData.discountPercent}
                  onChange={val => handleChange('discountPercent', val)}
                  className="w-full"
                  placeholder="Nhập % giảm giá"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                  Số lượng tối đa <span className="text-red-500">*</span>
                </label>
                <InputNumber
                  required
                  min={1}
                  value={formData.maxQuantity}
                  onChange={val => handleChange('maxQuantity', val)}
                  className="w-full"
                  placeholder="Nhập số lượng"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                Sản phẩm áp dụng <span className="text-red-500">*</span>
              </label>
              <Select
                mode="multiple"
                allowClear
                showSearch
                onSearch={debouncedSearchProduct}
                filterOption={false}
                placeholder="Chọn sản phẩm áp dụng"
                value={formData.products}
                onChange={val => handleChange('products', val)}
                className="w-full"
                optionFilterProp="children"
                getPopupContainer={trigger => trigger.parentNode}
                loading={productLoading}
              >
                {productList.map(product => (
                  <Option key={product._id} value={product._id}>
                    {product.title}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default FlashSaleAdmin
