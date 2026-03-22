import React, { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Switch,
  Space,
  Tag,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Tooltip
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  EyeOutlined,
  PercentageOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { getPromoCodes, createPromoCode, updatePromoCode, deletePromoCode, getPromoCodeDetail } from '@/services/adminPromoCodesService'
import SEO from '@/components/SEO'

const { Option } = Select

export default function AdminPromoCodesPage() {const [promoCodes, setPromoCodes] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [editingCode, setEditingCode] = useState(null)
  const [selectedCode, setSelectedCode] = useState(null)
  const [form] = Form.useForm()
  const discountType = Form.useWatch('discountType', form)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  const fetchPromoCodes = async (page = 1, pageSize = 10) => {
    setLoading(true)
    try {
      const res = await getPromoCodes({ page, limit: pageSize })
      setPromoCodes(res.promoCodes || [])
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize,
        total: res.total || 0
      }))
    } catch (err) {
      message.error('Lỗi khi lấy danh sách mã giảm giá')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromoCodes()
  }, [])

  const handleTableChange = pagination => {
    fetchPromoCodes(pagination.current, pagination.pageSize)
  }

  const handleCreate = () => {
    setEditingCode(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = record => {
    setEditingCode(record)
    form.setFieldsValue({
      ...record,
      expiresAt: record.expiresAt ? dayjs(record.expiresAt) : null
    })
    setModalVisible(true)
  }

  const handleDelete = async id => {
    setLoading(true)
    try {
      await deletePromoCode(id)
      setPromoCodes(prev => prev.filter(item => item._id !== id))
      message.success('Đã xóa mã giảm giá thành công')
      fetchPromoCodes(pagination.current, pagination.pageSize)
    } catch {
      message.error('Xoá mã giảm giá thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async values => {
    setLoading(true)
    try {
      const formData = {
        ...values,
        expiresAt: values.expiresAt ? values.expiresAt.toDate() : null
      }
      if (editingCode) {
        // Update
        await updatePromoCode(editingCode._id, formData)
        message.success('Cập nhật mã giảm giá thành công')
      } else {
        // Create
        await createPromoCode(formData)
        message.success('Tạo mã giảm giá thành công')
      }
      setModalVisible(false)
      fetchPromoCodes(pagination.current, pagination.pageSize)
      form.resetFields()
    } catch (error) {
      message.error(error?.response?.data?.error || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }
  const handleToggleStatus = async record => {
    setLoading(true)
    try {
      await updatePromoCode(record._id, { isActive: !record.isActive })
      message.success(`Đã ${record.isActive ? 'tắt' : 'bật'} mã giảm giá`)
      fetchPromoCodes(pagination.current, pagination.pageSize)
    } catch {
      message.error('Cập nhật trạng thái thất bại')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = text => {
    navigator.clipboard.writeText(text)
    message.success('Đã sao chép mã giảm giá')
  }

  const showDetail = async record => {
    setLoading(true)
    try {
      const res = await getPromoCodeDetail(record._id)
      setSelectedCode(res.promoCode)
      setDetailModalVisible(true)
    } catch {
      message.error('Không lấy được chi tiết mã')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = amount => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getStatusTag = record => {
    if (!record.isActive) return <Tag color="red">Đã tắt</Tag>
    if (record.expiresAt && dayjs(record.expiresAt).isBefore(dayjs())) {
      return <Tag color="orange">Hết hạn</Tag>
    }
    if (record.usageLimit && record.usedCount >= record.usageLimit) {
      return <Tag color="orange">Hết lượt</Tag>
    }
    return <Tag color="green">Hoạt động</Tag>
  }

  const columns = [
    {
      title: 'Mã giảm giá',
      dataIndex: 'code',
      key: 'code',
      render: text => (
        <Space>
          <span className="font-mono font-bold text-blue-600">{text}</span>
          <Button type="text" size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(text)} />
        </Space>
      )
    },
    {
      title: 'Loại giảm giá',
      dataIndex: 'discountType',
      key: 'discountType',
      render: (type, record) => (
        <Space>
          {type === 'percent' ? <PercentageOutlined /> : <DollarOutlined />}
          <span>{type === 'percent' ? `${record.discountValue}%` : formatCurrency(record.discountValue)}</span>
        </Space>
      )
    },
    {
      title: 'Điều kiện',
      key: 'conditions',
      render: (_, record) => (
        <div className="text-sm">
          {record.minOrder > 0 && <div>Đơn tối thiểu: {formatCurrency(record.minOrder)}</div>}
          {record.maxDiscount && <div>Giảm tối đa: {formatCurrency(record.maxDiscount)}</div>}
        </div>
      )
    },
    {
      title: 'Sử dụng',
      key: 'usage',
      render: (_, record) => {
        const percentage = record.usageLimit ? ((record.usedCount / record.usageLimit) * 100).toFixed(1) : 0

        return (
          <div className="text-sm">
      <SEO title="Admin – Mã giảm giá" noIndex />
                  <div>
              {record.usedCount} / {record.usageLimit || '∞'}
            </div>
            {record.usageLimit && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
              </div>
            )}
          </div>
        )
      }
    },
    {
      title: 'Hạn sử dụng',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      render: date => (
        <Space>
          <CalendarOutlined />
          {date ? dayjs(date).format('DD/MM/YYYY') : 'Không giới hạn'}
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => getStatusTag(record)
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined />} onClick={() => showDetail(record)} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title={record.isActive ? 'Tắt' : 'Bật'}>
            <Switch size="small" checked={record.isActive} onChange={() => handleToggleStatus(record)} />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa mã giảm giá này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  // Calculate statistics
  const stats = {
    total: promoCodes.length,
    active: promoCodes.filter(code => code.isActive).length,
    expired: promoCodes.filter(code => code.expiresAt && dayjs(code.expiresAt).isBefore(dayjs())).length,
    totalUsed: promoCodes.reduce((sum, code) => sum + code.usedCount, 0)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen dark:bg-gray-800 rounded-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 dark:text-gray-100">Quản lý mã giảm giá</h1>
        <p className="text-gray-600 dark:text-gray-400">Tạo và quản lý các mã giảm giá cho khách hàng</p>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="dark:bg-gray-800 dark:text-gray-100">
            <Statistic
              title={<span className="dark:text-white">Tổng số mã</span>}
              value={stats.total}
              prefix={<PercentageOutlined />}
              valueStyle={{ color: 'inherit' }}
              className="dark:text-white"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dark:bg-gray-800">
            <Statistic
              title={<span className="dark:text-gray-100">Đang hoạt động</span>}
              value={stats.active}
              valueStyle={{ color: 'inherit' }}
              className="text-[#3f8600] dark:text-white"
              prefix={<PercentageOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dark:bg-gray-800 dark:text-gray-100">
            <Statistic
              title={<span className="dark:text-white">Đã hết hạn</span>}
              value={stats.expired}
              valueStyle={{ color: 'inherit' }}
              className="text-[#cf1322] dark:text-white"
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dark:bg-gray-800 dark:text-gray-100">
            <Statistic
              title={<span className="dark:text-white">Lượt sử dụng</span>}
              value={stats.totalUsed}
              valueStyle={{ color: 'inherit' }}
              className="text-[#1677ff] dark:text-white"
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card className="dark:bg-gray-800 dark:text-gray-100">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold dark:text-white">Danh sách mã giảm giá</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Tạo mã mới
          </Button>
        </div>
        <div className="-mx-2 sm:mx-0 overflow-x-auto">
          <Table
            columns={columns}
            dataSource={promoCodes}
            rowKey="_id"
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => <span className="dark:text-white">Tổng {total} mã giảm giá</span>
            }}
            onChange={handleTableChange}
            scroll={{ x: 900 }}
            className="min-w-[900px]"
          />
        </div>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={
          editingCode ? (
            <span className="dark:text-white">Chỉnh sửa mã giảm giá</span>
          ) : (
            <span className="dark:text-white">Tạo mã giảm giá mới</span>
          )
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            discountType: 'percent',
            minOrder: 0,
            isActive: true
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="code"
                label={<span className="dark:text-white">Mã giảm giá</span>}
                rules={[{ required: true, message: 'Vui lòng nhập mã giảm giá' }]}
              >
                <Input
                  placeholder="VD: WELCOME20"
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="discountType" label={<span className="dark:text-white">Loại giảm giá</span>} rules={[{ required: true }]}>
                <Select>
                  <Option value="percent">Phần trăm (%)</Option>
                  <Option value="amount">Số tiền cố định</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="discountValue"
                label={<span className="dark:text-white">Giá trị giảm</span>}
                rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm' }]}
              >
                <InputNumber
                  max={discountType === 'percent' ? 100 : undefined}
                  formatter={value => (discountType === 'percent' ? `${value}%` : `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','))}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="maxDiscount" label={<span className="dark:text-white">Giảm tối đa (VNĐ)</span>}>
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/[^\d]/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item name="minOrder" label={<span className="dark:text-white">Đơn hàng tối thiểu (VNĐ)</span>}>
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/[^\d]/g, '')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="usageLimit" label={<span className="dark:text-white">Giới hạn sử dụng</span>}>
                <InputNumber min={1} style={{ width: '100%' }} placeholder="Để trống = không giới hạn" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item name="expiresAt" label={<span className="dark:text-white">Ngày hết hạn</span>}>
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày hết hạn"
                  allowClear
                  popupClassName="my-date-popup"
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="isActive" label={<span className="dark:text-white">Trạng thái</span>} valuePropName="checked">
                <Switch checkedChildren="Hoạt động" unCheckedChildren="Tắt" />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button onClick={() => setModalVisible(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingCode ? 'Cập nhật' : 'Tạo mã'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title={<span className="dark:text-white">Chi tiết mã giảm giá</span>}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={500}
      >
        {selectedCode && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg dark:bg-gray-800 dark:outline dark:outline-2 dark:outline-gray-700">
              <div className="text-center">
                <h3 className="text-xl font-bold text-blue-600 font-mono dark:text-white">{selectedCode.code}</h3>
                <p className="text-gray-600 mt-1 dark:text-white">
                  {selectedCode.discountType === 'percent'
                    ? `Giảm ${selectedCode.discountValue}%`
                    : `Giảm ${formatCurrency(selectedCode.discountValue)}`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-white">Đơn tối thiểu</label>
                <p className="text-gray-800 dark:text-white">{formatCurrency(selectedCode.minOrder)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-white">Giảm tối đa</label>
                <p className="text-gray-800 dark:text-white">
                  {selectedCode.maxDiscount ? formatCurrency(selectedCode.maxDiscount) : 'Không giới hạn'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-white">Đã sử dụng</label>
                <p className="text-gray-800 dark:text-white">
                  {selectedCode.usedCount} / {selectedCode.usageLimit || '∞'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-white">Hết hạn</label>
                <p className="text-gray-800 dark:text-white">
                  {selectedCode.expiresAt ? dayjs(selectedCode.expiresAt).format('DD/MM/YYYY HH:mm') : 'Không giới hạn'}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-white">Trạng thái</label>
              <div className="mt-1">{getStatusTag(selectedCode)}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-white">Ngày tạo</label>
              <p className="text-gray-800 dark:text-white">{dayjs(selectedCode.createdAt).format('DD/MM/YYYY HH:mm')}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
