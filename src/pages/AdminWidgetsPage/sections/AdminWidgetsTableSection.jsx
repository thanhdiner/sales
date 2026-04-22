import { Button, Avatar, Space, Table, Tag, Tooltip, Typography } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LinkOutlined
} from '@ant-design/icons'

const { Text } = Typography

export default function AdminWidgetsTableSection({ widgets, loading, onEditWidget, onDeleteWidget }) {
  const columns = [
    {
      title: 'Widget',
      dataIndex: 'title',
      key: 'title',
      width: 280,
      onCell: () => ({
        style: {
          minWidth: 220,
          whiteSpace: 'normal',
          wordBreak: 'break-word'
        }
      }),
      render: (title, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.iconUrl} size={40} className="border border-gray-200 bg-gray-50" />

          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{title}</div>
            <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Thứ tự: {record.order}</div>
          </div>
        </div>
      )
    },
    {
      title: (
        <Space size={6}>
          <LinkOutlined />
          <span>Liên kết</span>
        </Space>
      ),
      dataIndex: 'link',
      key: 'link',
      width: 300,
      render: link =>
        link ? (
          <Tooltip title={link}>
            <a href={link} target="_blank" rel="noreferrer" className="text-gray-700 hover:text-gray-900 dark:text-gray-300">
              {link.length > 36 ? `${link.substring(0, 36)}...` : link}
            </a>
          </Tooltip>
        ) : (
          <Text type="secondary">Không có liên kết</Text>
        )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 160,
      render: value => (
        <Tag
          icon={value ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          color={value ? 'success' : 'default'}
          className="rounded-full px-2 py-1 font-medium"
        >
          {value ? 'Đang hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
      filters: [
        { text: 'Đang hoạt động', value: true },
        { text: 'Tạm dừng', value: false }
      ],
      onFilter: (value, record) => record.isActive === value
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 170,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa widget">
            <Button icon={<EditOutlined />} onClick={() => onEditWidget(record)} className="rounded-lg">
              Sửa
            </Button>
          </Tooltip>

          <Tooltip title="Xóa widget">
            <Button danger icon={<DeleteOutlined />} onClick={() => onDeleteWidget(record._id)} className="rounded-lg">
              Xóa
            </Button>
          </Tooltip>
        </Space>
      )
    }
  ]

  return (
    <div className="overflow-x-auto">
      <Table
        rowKey="_id"
        dataSource={widgets}
        columns={columns}
        loading={loading}
        scroll={{ x: 800 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} widgets`
        }}
        className="min-w-[720px] text-[13.5px] [&_.ant-table-tbody_td]:align-top"
      />
    </div>
  )
}
