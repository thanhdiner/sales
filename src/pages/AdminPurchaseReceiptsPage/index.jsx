import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Form, Input, InputNumber, Modal, Select, Space, Table, message } from 'antd'
import SEO from '@/components/SEO'
import { getAdminProducts } from '@/services/adminProductService'
import { createPurchaseReceipt, getPurchaseReceipts } from '@/services/adminPurchaseReceiptService'
import './AdminPurchaseReceiptsPage.scss'

const PAGE_LIMIT = 20

const formatCurrency = value => `${Number(value || 0).toLocaleString('vi-VN')}₫`

export default function AdminPurchaseReceiptsPage() {
  const [form] = Form.useForm()
  const [receipts, setReceipts] = useState([])
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const productOptions = useMemo(
    () => products
      .filter(product => product.deliveryType !== 'instant_account')
      .map(product => ({
        value: product._id,
        label: `${product.title} - Tồn: ${product.stock || 0}`,
        product
      })),
    [products]
  )

  const fetchReceipts = useCallback(async (nextPage = page, nextKeyword = keyword) => {
    setLoading(true)
    try {
      const response = await getPurchaseReceipts({ page: nextPage, limit: PAGE_LIMIT, keyword: nextKeyword.trim() })
      setReceipts(response?.receipts || [])
      setTotal(response?.total || 0)
    } catch (error) {
      message.error(error?.message || 'Không lấy được danh sách phiếu nhập')
    } finally {
      setLoading(false)
    }
  }, [keyword, page])

  const fetchProducts = useCallback(async () => {
    try {
      const response = await getAdminProducts({ page: 1, limit: 1000, status: 'all' })
      setProducts(response?.products || [])
    } catch (error) {
      message.error(error?.message || 'Không lấy được danh sách sản phẩm')
    }
  }, [])

  useEffect(() => {
    fetchReceipts(1, '')
    fetchProducts()
  }, [fetchProducts, fetchReceipts])

  const handleSearch = value => {
    const nextKeyword = value.trim()
    setKeyword(nextKeyword)
    setPage(1)
    fetchReceipts(1, nextKeyword)
  }

  const handleCreate = async values => {
    setSubmitting(true)
    try {
      await createPurchaseReceipt(values)
      message.success('Đã tạo phiếu nhập hàng')
      setModalOpen(false)
      form.resetFields()
      await Promise.all([fetchReceipts(1, keyword), fetchProducts()])
      setPage(1)
    } catch (error) {
      message.error(error?.response?.error || error?.message || 'Không tạo được phiếu nhập')
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (value, record) => (
        <div>
          <div className="font-medium text-[var(--admin-text)]">{value}</div>
          <div className="text-xs text-[var(--admin-text-muted)]">Tồn hiện tại: {record.productId?.stock ?? 'N/A'}</div>
        </div>
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 110
    },
    {
      title: 'Giá nhập',
      dataIndex: 'unitCost',
      key: 'unitCost',
      width: 140,
      render: formatCurrency
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalCost',
      key: 'totalCost',
      width: 150,
      render: formatCurrency
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplierName',
      key: 'supplierName',
      render: value => value || '—'
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: value => (value ? new Date(value).toLocaleString('vi-VN') : '—')
    }
  ]

  return (
    <div className="admin-purchase-receipts-page min-h-screen rounded-xl bg-[var(--admin-bg-soft)] p-6">
      <SEO title="Admin – Nhập hàng" noIndex />

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-[var(--admin-text)]">Nhập hàng</h1>
          <p className="text-[var(--admin-text-muted)]">Tạo phiếu nhập cho sản phẩm manual để tăng tồn kho và cập nhật giá vốn.</p>
        </div>

        <Button
          type="primary"
          onClick={() => setModalOpen(true)}
          className="h-10 rounded-lg !border-none !bg-[var(--admin-accent)] px-4 font-medium !text-white hover:!opacity-90"
        >
          Tạo phiếu nhập
        </Button>
      </div>

      <div className="admin-purchase-receipts-card rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[var(--admin-shadow)]">
        <Space className="mb-4" wrap>
          <Input.Search
            className="admin-purchase-receipts-search"
            allowClear
            placeholder="Tìm theo tên sản phẩm"
            onSearch={handleSearch}
            style={{ width: 280 }}
          />
        </Space>

        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={receipts}
          className="admin-purchase-receipts-table"
          pagination={{
            current: page,
            pageSize: PAGE_LIMIT,
            total,
            onChange: nextPage => {
              setPage(nextPage)
              fetchReceipts(nextPage, keyword)
            }
          }}
          scroll={{ x: 900 }}
        />
      </div>

      <Modal
        title={<span className="text-[var(--admin-text)]">Tạo phiếu nhập hàng</span>}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        okText="Tạo phiếu"
        cancelText="Hủy"
        wrapClassName="admin-purchase-receipts-modal"
        okButtonProps={{
          className: 'rounded-lg !border-none !bg-[var(--admin-accent)] !text-white hover:!opacity-90'
        }}
        cancelButtonProps={{
          className:
            'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-3)] hover:!text-[var(--admin-text)]'
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} preserve={false}>
          <Form.Item
            label="Sản phẩm manual"
            name="productId"
            rules={[{ required: true, message: 'Vui lòng chọn sản phẩm' }]}
          >
            <Select
              showSearch
              placeholder="Chọn sản phẩm"
              options={productOptions}
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item
            label="Số lượng nhập"
            name="quantity"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
          >
            <InputNumber min={1} precision={0} className="w-full" />
          </Form.Item>

          <Form.Item
            label="Giá nhập / đơn vị"
            name="unitCost"
            rules={[{ required: true, message: 'Vui lòng nhập giá nhập' }]}
          >
            <InputNumber min={0} precision={0} className="w-full" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value?.replace(/,/g, '') || ''} />
          </Form.Item>

          <Form.Item label="Nhà cung cấp" name="supplierName">
            <Input maxLength={120} placeholder="Tên nhà cung cấp nếu có" />
          </Form.Item>

          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={3} maxLength={500} placeholder="Ghi chú nhập hàng" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
