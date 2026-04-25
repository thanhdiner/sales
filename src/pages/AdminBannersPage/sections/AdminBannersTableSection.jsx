import {
  Button,
  Image,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LinkOutlined
} from '@ant-design/icons'

const { Text } = Typography

export default function AdminBannersTableSection({ banners, loading, onEditBanner, onDeleteBanner }) {
  const getTablePopupContainer = trigger => trigger?.closest('.admin-banners-page') || trigger?.parentElement || document.body

  const columns = [
    {
      title: 'Ảnh Banner',
      dataIndex: 'img',
      key: 'img',
      width: 170,
      render: img =>
        img ? (
          <div className="admin-banners-image-wrap overflow-hidden rounded-lg">
            <Image width={140} height={72} src={img} alt="Banner" className="object-cover" />
          </div>
        ) : (
          <Text className="!text-[var(--admin-text-subtle)]">Chưa có ảnh</Text>
        )
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: title => <span className="font-medium text-[var(--admin-text)]">{title}</span>
    },
    {
      title: (
        <Space size={6}>
          <LinkOutlined />
          <span>Link</span>
        </Space>
      ),
      dataIndex: 'link',
      key: 'link',
      render: link =>
        link ? (
          <Tooltip title={link}>
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--admin-text-muted)] transition-colors hover:text-[var(--admin-text)]"
            >
              {link.length > 34 ? `${link.substring(0, 34)}...` : link}
            </a>
          </Tooltip>
        ) : (
          <Text className="!text-[var(--admin-text-subtle)]">Không có</Text>
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
          <Tooltip title="Chỉnh sửa banner">
            <Button icon={<EditOutlined />} onClick={() => onEditBanner(record)} className="admin-banners-action-btn rounded-lg">
              Sửa
            </Button>
          </Tooltip>

          <Tooltip title="Xóa banner">
            <Button danger icon={<DeleteOutlined />} onClick={() => onDeleteBanner(record._id)} className="admin-banners-action-btn admin-banners-action-btn--danger rounded-lg">
              Xóa
            </Button>
          </Tooltip>
        </Space>
      )
    }
  ]

  return (
    <div className="admin-banners-table-wrap overflow-x-auto">
      <Table
        rowKey="_id"
        dataSource={banners}
        columns={columns}
        loading={loading}
        getPopupContainer={getTablePopupContainer}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} banners`
        }}
        className="admin-banners-table min-w-[720px]"
      />
    </div>
  )
}
