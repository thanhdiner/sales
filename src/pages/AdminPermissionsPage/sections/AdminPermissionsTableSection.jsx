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
  const actionButtonClass =
    'rounded-lg !border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-3)] hover:!text-[var(--admin-text)]'

  const columns = [
    {
      title: 'Mã quyền',
      dataIndex: 'name',
      key: 'name',
      render: name => <span className="font-mono text-sm font-medium text-[var(--admin-text-muted)]">{name}</span>
    },
    {
      title: 'Tên quyền',
      dataIndex: 'title',
      key: 'title',
      render: title => <span className="font-medium text-[var(--admin-text)]">{title}</span>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: description => (
        <span className="text-[var(--admin-text-muted)]">{description || 'Không có mô tả'}</span>
      )
    },
    {
      title: 'Nhóm quyền',
      dataIndex: 'group',
      key: 'group',
      render: group => (
        <span className="text-[var(--admin-text-muted)]">
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
            <Button icon={<EditOutlined />} onClick={() => onEditPermission(record)} className={actionButtonClass} />
          )}

          {canDeletePermission && (
            <Popconfirm
              title="Xóa quyền này?"
              description="Bạn có chắc chắn muốn xóa quyền này không?"
              onConfirm={() => onDeletePermission(record._id)}
              okText="Xóa"
              cancelText="Hủy"
              overlayClassName="admin-permissions-popconfirm"
            >
              <Button
                icon={<DeleteOutlined />}
                danger
                className="admin-permissions-delete-btn rounded-lg"
              />
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
          showTotal: (count, range) => (
            <span className="text-[var(--admin-text-muted)]">{`${range[0]}-${range[1]} của ${count} quyền`}</span>
          ),
          onChange: onPageChange,
          onShowSizeChange: onPageSizeChange
        }}
        className="admin-permissions-table min-w-[720px]"
      />
    </div>
  )
}
