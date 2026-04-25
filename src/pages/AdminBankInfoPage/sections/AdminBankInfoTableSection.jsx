import { BankOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Empty, Image, Popconfirm, Space, Switch, Table, Tag, Tooltip, Typography } from 'antd'
import { ADMIN_BANK_INFO_TABLE_PAGE_SIZE } from '../utils'

const { Text } = Typography

export default function AdminBankInfoTableSection({
  data,
  loading,
  activateLoadingId,
  onEdit,
  onDelete,
  onActivate
}) {
  const columns = [
    {
      title: 'Ngân hàng',
      dataIndex: 'bankName',
      key: 'bankName',
      width: 260,
      render: (value, record) => (
        <div className="admin-bank-info-bank-cell">
          <div className="admin-bank-info-bank-icon">
            <BankOutlined />
          </div>

          <div className="min-w-0">
            <div className="admin-bank-info-bank-name">{value}</div>
            <div className="admin-bank-info-bank-sub">
              {record.isActive ? 'Đang hiển thị khi thanh toán' : 'Chưa hiển thị cho khách'}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Số tài khoản',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
      width: 170,
      render: value => (
        <Text copyable className="admin-bank-info-account-number">
          {value}
        </Text>
      )
    },
    {
      title: 'Chủ tài khoản',
      dataIndex: 'accountHolder',
      key: 'accountHolder',
      width: 190,
      render: value => <span className="admin-bank-info-account-holder">{value}</span>
    },
    {
      title: 'Nội dung mẫu',
      dataIndex: 'noteTemplate',
      key: 'noteTemplate',
      width: 260,
      render: value => (
        <Tooltip title={value || 'Chưa cấu hình'}>
          <span className="admin-bank-info-note">{value || 'Chưa cấu hình'}</span>
        </Tooltip>
      )
    },
    {
      title: 'QR Code',
      dataIndex: 'qrCode',
      key: 'qrCode',
      width: 120,
      render: url =>
        url ? (
          <Image
            src={url}
            width={56}
            height={56}
            className="admin-bank-info-qr-image"
            preview={{ mask: <EyeOutlined /> }}
          />
        ) : (
          <Tag className="admin-bank-info-qr-empty">Chưa có</Tag>
        )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 150,
      render: value => (
        <Tag className={`admin-bank-info-status-tag ${value ? 'admin-bank-info-status-tag--active' : 'admin-bank-info-status-tag--inactive'}`}>
          {value ? 'Đang dùng' : 'Tạm tắt'}
        </Tag>
      )
    },
    {
      title: 'Kích hoạt',
      key: 'activate',
      width: 130,
      render: (_, record) => (
        <Switch
          className="admin-bank-info-switch"
          checked={record.isActive}
          loading={activateLoadingId === record._id}
          checkedChildren="Bật"
          unCheckedChildren="Tắt"
          onChange={checked => onActivate(record, checked)}
        />
      )
    },
    {
      title: 'Hành động',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Sửa thông tin">
            <Button icon={<EditOutlined />} onClick={() => onEdit(record)} className="admin-bank-info-action-btn" />
          </Tooltip>

          <Popconfirm
            overlayClassName="admin-bank-info-popconfirm"
            title="Xóa tài khoản này?"
            description="Tài khoản đã xóa sẽ không còn hiển thị ở trang thanh toán."
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => onDelete(record._id)}
          >
            <Tooltip title="Xóa tài khoản">
              <Button icon={<DeleteOutlined />} danger className="admin-bank-info-action-btn admin-bank-info-action-btn--danger" />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div className="admin-bank-info-table-card">
      <div className="admin-bank-info-table-card__head">
        <h2 className="admin-bank-info-table-card__title">Danh sách tài khoản nhận tiền</h2>
        <p className="admin-bank-info-table-card__desc">
          Bản ghi đang dùng sẽ được lấy làm thông tin chuyển khoản cho khách ở trang thanh toán.
        </p>
      </div>

      <div className="admin-bank-info-table-card__wrap">
        <Table
          rowKey="_id"
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={{
            pageSize: ADMIN_BANK_INFO_TABLE_PAGE_SIZE,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} tài khoản`
          }}
          locale={{
            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có tài khoản ngân hàng" />
          }}
          className="admin-bank-info-table"
          scroll={{ x: 1100 }}
        />
      </div>
    </div>
  )
}

