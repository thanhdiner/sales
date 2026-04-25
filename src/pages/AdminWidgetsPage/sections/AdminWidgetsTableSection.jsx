import { Avatar, Button, Space, Table, Tag, Tooltip, Typography } from 'antd'
import { DeleteOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined, LinkOutlined } from '@ant-design/icons'

const { Text } = Typography

const getStatusTagClass = isActive =>
  isActive ? 'admin-widgets-status-tag admin-widgets-status-tag--active' : 'admin-widgets-status-tag admin-widgets-status-tag--inactive'

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
        <div className="admin-widgets-widget-cell">
          <Avatar src={record.iconUrl} size={40} className="admin-widgets-widget-avatar" />

          <div className="admin-widgets-widget-info">
            <div className="admin-widgets-widget-title">{title}</div>
            <div className="admin-widgets-widget-order">Thứ tự: {record.order}</div>
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
            <a href={link} target="_blank" rel="noreferrer" className="admin-widgets-link">
              {link.length > 36 ? `${link.substring(0, 36)}...` : link}
            </a>
          </Tooltip>
        ) : (
          <Text className="admin-widgets-empty-link">Không có liên kết</Text>
        )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 160,
      render: value => (
        <Tag icon={value ? <EyeOutlined /> : <EyeInvisibleOutlined />} className={getStatusTagClass(value)}>
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
            <Button icon={<EditOutlined />} onClick={() => onEditWidget(record)} className="admin-widgets-btn admin-widgets-btn--table">
              Sửa
            </Button>
          </Tooltip>

          <Tooltip title="Xóa widget">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDeleteWidget(record._id)}
              className="admin-widgets-btn admin-widgets-btn--table admin-widgets-btn--danger"
            >
              Xóa
            </Button>
          </Tooltip>
        </Space>
      )
    }
  ]

  return (
    <div className="admin-widgets-table-wrapper">
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
        className="admin-widgets-table min-w-[720px] text-[13.5px] [&_.ant-table-tbody_td]:align-top"
      />
    </div>
  )
}
