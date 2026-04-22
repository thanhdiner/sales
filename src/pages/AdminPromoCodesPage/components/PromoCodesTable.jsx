import {
  CopyOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  EyeOutlined,
  PercentageOutlined,
  PlusOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import { Button, Card, Popconfirm, Space, Switch, Table, Tag, Tooltip } from 'antd'
import dayjs from 'dayjs'
import {
  formatCurrency,
  getPromoCodeStatusMeta,
  getPromoCodeUsagePercentage
} from '../utils/promoCodeHelpers'

export default function PromoCodesTable({
  promoCodes,
  loading,
  pagination,
  onCreate,
  onTableChange,
  onCopy,
  onShowDetail,
  onEdit,
  onToggleStatus,
  onDelete
}) {
  const columns = [
    {
      title: 'Mã giảm giá',
      dataIndex: 'code',
      key: 'code',
      render: text => (
        <Space>
          <span className="font-mono font-bold text-blue-600">{text}</span>
          <Button type="text" size="small" icon={<CopyOutlined />} onClick={() => onCopy(text)} />
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
        const percentage = getPromoCodeUsagePercentage(record)

        return (
          <div className="text-sm">
            <div>
              {record.usedCount} / {record.usageLimit || '∞'}
            </div>

            {record.usageLimit && (
              <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: `${percentage}%` }} />
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
      render: (_, record) => {
        const statusMeta = getPromoCodeStatusMeta(record)
        return <Tag color={statusMeta.color}>{statusMeta.label}</Tag>
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined />} onClick={() => onShowDetail(record)} />
          </Tooltip>

          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          </Tooltip>

          <Tooltip title={record.isActive ? 'Tắt' : 'Bật'}>
            <Switch size="small" checked={record.isActive} onChange={() => onToggleStatus(record)} />
          </Tooltip>

          <Popconfirm
            title="Bạn có chắc chắn muốn xóa mã giảm giá này?"
            onConfirm={() => onDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Card className="dark:bg-gray-800 dark:text-gray-100">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold dark:text-white">Danh sách mã giảm giá</h2>

        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          Tạo mã mới
        </Button>
      </div>

      <div className="-mx-2 overflow-x-auto sm:mx-0">
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
          onChange={onTableChange}
          scroll={{ x: 900 }}
          className="min-w-[900px]"
        />
      </div>
    </Card>
  )
}
