import { Avatar, Button, Popconfirm, Select, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ADMIN_ACCOUNT_STATUS_OPTIONS } from '../utils'

const { Option } = Select

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
      className: 'ant-table-cell-style',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.avatarUrl}
            size={40}
            shape="square"
            className="h-10 w-10 flex-shrink-0 rounded-lg bg-[#eee] object-cover"
          >
            {!record.avatarUrl && record.fullName
              ? record.fullName?.trim()?.split(' ')?.pop()?.charAt(0)?.toUpperCase()
              : null}
          </Avatar>

          <div>
            <div className="font-semibold">{record.fullName}</div>
            <div className="text-[12px] text-[#888]">{record.username}</div>
          </div>
        </div>
      )
    },
    { title: 'Email', dataIndex: 'email', className: 'align-middle' },
    {
      title: 'Role',
      dataIndex: 'role_id',
      className: 'align-middle',
      render: value => {
        if (value && typeof value === 'object') {
          return value.label || value.name || 'Unknown Role'
        }

        const foundRole = roles.find(role => role._id === value)
        return foundRole ? foundRole.label || foundRole.name : 'Unknown Role'
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      className: 'align-middle',
      render: (value, record) => (
        <Select
          value={value}
          className="w-25"
          onChange={newStatus => onChangeStatus(record._id, newStatus)}
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
      className: 'align-middle',
      render: (_, record) => (
        <div className="flex gap-[8px]">
          <Button
            className="dark:bg-gray-500 dark:hover:!bg-gray-400"
            icon={<EditOutlined className="dark:text-gray-300" />}
            onClick={() => onEdit(record)}
          />

          <Popconfirm
            title="Bạn chắc chắn muốn xoá?"
            onConfirm={() => onDelete(record._id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button
              className="dark:bg-red-500 dark:hover:!bg-red-400"
              icon={<DeleteOutlined className="dark:text-gray-300" />}
              danger
            />
          </Popconfirm>
        </div>
      )
    }
  ]

  return (
    <div className="custom-scrollbar overflow-x-auto rounded-md bg-white shadow-md dark:bg-gray-900">
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="_id"
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
        scroll={{ x: 900 }}
        style={{ minWidth: 820 }}
      />
    </div>
  )
}
