import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Space, Switch, Table } from 'antd'

export default function AdminPermissionGroupsTableSection({
  groups,
  total,
  currentPage,
  pageSize,
  loading,
  updatingId,
  permissions,
  onPageChange,
  onPageSizeChange,
  onEditGroup,
  onDeleteGroup,
  onToggleGroupActive
}) {
  const canEditGroup = permissions.includes('edit_permission_group')
  const canDeleteGroup = permissions.includes('delete_permission_group')

  const columns = [
    {
      title: 'Tên nhóm',
      dataIndex: 'label',
      key: 'label',
      render: text => <span className="font-medium text-gray-900 dark:text-gray-100">{text}</span>
    },
    {
      title: 'Mã nhóm',
      dataIndex: 'value',
      key: 'value',
      render: text => <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{text}</span>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: text => <span className="text-gray-600 dark:text-gray-400">{text || 'Không có mô tả'}</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 150,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          checkedChildren="Bật"
          unCheckedChildren="Tắt"
          loading={updatingId === record._id}
          onChange={() => onToggleGroupActive(record)}
          disabled={!canEditGroup}
        />
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 130,
      render: (_, record) => (
        <Space size="small">
          {canEditGroup && (
            <Button icon={<EditOutlined />} onClick={() => onEditGroup(record)} className="rounded-lg" />
          )}

          {canDeleteGroup && (
            <Popconfirm
              title="Xóa nhóm quyền này?"
              description="Chỉ nên xóa khi không có quyền nào đang liên kết với nhóm này."
              onConfirm={() => onDeleteGroup(record._id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button icon={<DeleteOutlined />} danger className="rounded-lg" />
            </Popconfirm>
          )}
        </Space>
      )
    }
  ]

  return (
    <div className="overflow-x-auto">
      <Table
        dataSource={groups}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (count, range) => `${range[0]}-${range[1]} của ${count} nhóm quyền`,
          onChange: onPageChange,
          onShowSizeChange: onPageSizeChange
        }}
        className="min-w-[680px]"
      />
    </div>
  )
}
