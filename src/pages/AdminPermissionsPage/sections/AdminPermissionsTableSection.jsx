import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Space, Table } from 'antd'
import { getPermissionGroupLabel } from '../utils'

export default function AdminPermissionsTableSection({
  permissionList,
  total,
  currentPage,
  pageSize,
  permissionGroups,
  loading,
  grantedPermissions,
  onPageChange,
  onPageSizeChange,
  onEditPermission,
  onDeletePermission
}) {
  const canEditPermission = grantedPermissions.includes('edit_permission')
  const canDeletePermission = grantedPermissions.includes('delete_permission')

  const columns = [
    {
      title: 'Mã quyền',
      dataIndex: 'name',
      key: 'name',
      render: name => <span className="font-mono text-sm font-medium text-gray-800 dark:text-gray-200">{name}</span>
    },
    {
      title: 'Tên quyền',
      dataIndex: 'title',
      key: 'title',
      render: title => <span className="font-medium text-gray-900 dark:text-gray-100">{title}</span>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: description => (
        <span className="text-gray-600 dark:text-gray-400">{description || 'Không có mô tả'}</span>
      )
    },
    {
      title: 'Nhóm quyền',
      dataIndex: 'group',
      key: 'group',
      render: group => (
        <span className="text-gray-700 dark:text-gray-300">
          {getPermissionGroupLabel(permissionGroups, group)}
        </span>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 130,
      render: (_, record) => (
        <Space size="small">
          {canEditPermission && (
            <Button icon={<EditOutlined />} onClick={() => onEditPermission(record)} className="rounded-lg" />
          )}

          {canDeletePermission && (
            <Popconfirm
              title="Xóa quyền này?"
              description="Bạn có chắc chắn muốn xóa quyền này không?"
              onConfirm={() => onDeletePermission(record._id)}
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
        dataSource={permissionList}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (count, range) => `${range[0]}-${range[1]} của ${count} quyền`,
          onChange: onPageChange,
          onShowSizeChange: onPageSizeChange
        }}
        className="min-w-[720px]"
      />
    </div>
  )
}
