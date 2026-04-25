import { Avatar, Button, Popconfirm, Select, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ADMIN_ACCOUNT_STATUS_OPTIONS } from '../utils'

const { Option } = Select

const tableWrapperClass =
  'admin-accounts-table custom-scrollbar overflow-x-auto rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow)]'

const tableContentClass = 'admin-accounts-table-content'
const tableRowClass = 'admin-accounts-row'
const tableCellClass = 'align-middle'

const userCellClass = 'flex items-center gap-3'
const avatarClass =
  'h-10 w-10 flex-shrink-0 rounded-lg bg-[var(--admin-surface-3)] object-cover'
const userInfoClass = 'min-w-0'
const fullNameClass = 'font-semibold text-[var(--admin-text)]'
const usernameClass = 'text-[12px] text-[var(--admin-text-subtle)]'

const statusSelectClass = 'admin-accounts-status-select w-25'
const statusSelectDropdownClass = 'admin-accounts-select-dropdown'

const actionsClass = 'flex gap-[8px]'
const actionButtonClass =
  'admin-accounts-action-btn !border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!bg-[var(--admin-surface-3)] hover:!text-[var(--admin-text)]'
const dangerButtonClass =
  'admin-accounts-action-btn admin-accounts-action-btn-danger !border-[var(--admin-danger-border)] !bg-[var(--admin-danger-bg-soft)] !text-[var(--admin-danger-text)] hover:!border-[var(--admin-danger-border)] hover:!bg-[color-mix(in_srgb,var(--admin-danger-bg-soft)_85%,var(--admin-surface-2))] hover:!text-[var(--admin-danger-text)]'

const popconfirmClass = 'admin-accounts-popconfirm'

const tableScrollConfig = { x: 900 }
const tableStyle = { minWidth: 820 }

function getAvatarFallback(record) {
  if (record.avatarUrl || !record.fullName) {
    return null
  }

  return record.fullName.trim().split(' ').pop()?.charAt(0)?.toUpperCase()
}

function getRoleLabel(value, roles) {
  if (value && typeof value === 'object') {
    return value.label || value.name || 'Unknown Role'
  }

  const foundRole = roles.find(role => role._id === value)
  return foundRole ? foundRole.label || foundRole.name : 'Unknown Role'
}

export default function AdminAccountsTableSection({
  data,
  total,
  currentPage,
  pageSize,
  roles,
  loading,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  onChangeStatus
}) {
  const columns = [
    {
      title: 'User Name',
      dataIndex: 'username',
      className: tableCellClass,
      render: (_, record) => (
        <div className={userCellClass}>
          <Avatar src={record.avatarUrl} size={40} shape="square" className={avatarClass}>
            {getAvatarFallback(record)}
          </Avatar>

          <div className={userInfoClass}>
            <div className={fullNameClass}>{record.fullName}</div>
            <div className={usernameClass}>{record.username}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      className: tableCellClass
    },
    {
      title: 'Role',
      dataIndex: 'role_id',
      className: tableCellClass,
      render: value => getRoleLabel(value, roles)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      className: tableCellClass,
      render: (value, record) => (
        <Select
          value={value}
          className={statusSelectClass}
          onChange={newStatus => onChangeStatus(record._id, newStatus)}
          popupClassName={statusSelectDropdownClass}
          size="small"
        >
          {ADMIN_ACCOUNT_STATUS_OPTIONS.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      )
    },
    {
      title: 'Action',
      key: 'actions',
      className: tableCellClass,
      render: (_, record) => (
        <div className={actionsClass}>
          <Button className={actionButtonClass} icon={<EditOutlined />} onClick={() => onEdit(record)} />

          <Popconfirm
            title="Bạn chắc chắn muốn xoá?"
            onConfirm={() => onDelete(record._id)}
            okText="Xoá"
            cancelText="Huỷ"
            overlayClassName={popconfirmClass}
          >
            <Button className={dangerButtonClass} icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      )
    }
  ]

  return (
    <div className={tableWrapperClass}>
      <Table
        columns={columns}
        className={tableContentClass}
        dataSource={data}
        loading={loading}
        rowKey="_id"
        rowClassName={() => tableRowClass}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (count, range) => `${range[0]}-${range[1]} của ${count} tài khoản`,
          onChange: onPageChange,
          onShowSizeChange: onPageSizeChange
        }}
        scroll={tableScrollConfig}
        style={tableStyle}
      />
    </div>
  )
}