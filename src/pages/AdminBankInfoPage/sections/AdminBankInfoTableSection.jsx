import {
  BankOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined
} from '@ant-design/icons'
import {
  Button,
  Card,
  Image,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tag,
  Typography
} from 'antd'
import AdminBankInfoHeaderSection from './AdminBankInfoHeaderSection'
import { ADMIN_BANK_INFO_TABLE_PAGE_SIZE } from '../utils'

const { Text } = Typography

export default function AdminBankInfoTableSection({
  data,
  loading,
  onCreate,
  onEdit,
  onDelete,
  onActivate
}) {
  const columns = [
    {
      title: 'Ngân hàng',
      dataIndex: 'bankName',
      key: 'bankName',
      width: 180,
      render: value => (
        <Space>
          <BankOutlined style={{ color: '#1890ff' }} />
          <span className="break-words whitespace-normal font-medium">{value}</span>
        </Space>
      )
    },
    {
      title: 'Số tài khoản',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
      width: 160
    },
    {
      title: 'Chủ tài khoản',
      dataIndex: 'accountHolder',
      key: 'accountHolder',
      width: 180
    },
    {
      title: 'Nội dung mẫu',
      dataIndex: 'noteTemplate',
      key: 'noteTemplate',
      width: 240,
      render: value => (
        <span className="break-words whitespace-normal text-gray-700 dark:text-gray-300">
          {value}
        </span>
      )
    },
    {
      title: 'QR Code',
      dataIndex: 'qrCode',
      key: 'qrCode',
      width: 110,
      render: url =>
        url ? (
          <Image
            src={url}
            width={60}
            height={60}
            style={{ objectFit: 'cover', borderRadius: 6 }}
            preview={{ mask: <EyeOutlined /> }}
          />
        ) : (
          <Tag>Chưa có</Tag>
        )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: value => (value ? <Tag color="green">Đang dùng</Tag> : <Tag>Nháp</Tag>)
    },
    {
      title: 'Kích hoạt',
      key: 'activate',
      width: 110,
      render: (_, record) => (
        <Switch checked={record.isActive} onChange={checked => onActivate(record, checked)} />
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 140,
      render: (_, record) => (
        <Space size="small" wrap>
          <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Sửa
          </Button>

          <Popconfirm
            title="Xoá bản ghi?"
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={() => onDelete(record._id)}
          >
            <Button size="small" icon={<DeleteOutlined />} danger ghost>
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Card
      className="rounded-xl shadow-lg dark:bg-gray-800"
      title={<AdminBankInfoHeaderSection onCreate={onCreate} />}
    >
      <Text className="mb-3 block text-gray-500">
        Bản ghi <b>Đang dùng</b> sẽ hiển thị cho khách hàng ở trang thanh toán.
      </Text>

      <div className="custom-scrollbar overflow-x-auto">
        <Table
          rowKey="_id"
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={{ pageSize: ADMIN_BANK_INFO_TABLE_PAGE_SIZE }}
          className="rounded-lg"
          scroll={{ x: 1100 }}
          style={{ minWidth: 950 }}
        />
      </div>
    </Card>
  )
}
