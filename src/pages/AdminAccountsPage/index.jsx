import React, { useState, useEffect, useCallback } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Typography, Avatar, Upload } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { getAdminRoles } from '@/services/rolesService'

const {
  getAdminAccounts,
  createAdminAccount,
  updateAdminAccount,
  deleteAdminAccount,
  changeStatusAdminAccount
} = require('@/services/adminAccountsService')
const { Title } = Typography

const { Option } = Select

function AdminAccountsPage() {const [data, setData] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form] = Form.useForm()
  const [oldAvatar, setOldAvatar] = useState('')
  const [avatarToDelete, setAvatarToDelete] = useState('')
  const [isRemoveAvatar, setIsRemoveAvatar] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [accounts, rolesData] = await Promise.all([getAdminAccounts(), getAdminRoles()])
      setData(accounts.data)
      setRoles(rolesData.data)

      if (!editing && rolesData.data?.length) {
        form.setFieldsValue({ role_id: rolesData.data[0]._id })
      }
    } catch (err) {
      message.error('Không thể tải danh sách tài khoản.')
    } finally {
      setLoading(false)
    }
  }, [editing, form])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSave = () => {
    form
      .validateFields()
      .then(async values => {
        setSubmitLoading(true)
        try {
          const formData = new FormData()
          const file = values.avatarUrl?.[0]?.originFileObj
          formData.append('username', values.username)
          formData.append('email', values.email)
          if (!editing) formData.append('password', values.password)
          if (editing && values.newPassword) formData.append('newPassword', values.newPassword)
          formData.append('fullName', values.fullName)
          formData.append('role_id', String(values.role_id))
          formData.append('status', values.status)
          if (file) {
            formData.append('avatarUrl', file)
            if (oldAvatar) formData.append('oldImage', oldAvatar)
          } else {
            if (isRemoveAvatar && editing) {
              formData.append('oldImage', avatarToDelete)
              formData.append('deleteImage', true)
              formData.append('avatarUrl', '')
            }
          }
          if (editing) {
            const res = await updateAdminAccount(editing._id, formData)
            setData(prev => prev.map(acc => (acc._id === res.data._id ? res.data : acc)))
            message.success('Cập nhật tài khoản thành công!')
          } else {
            const res = await createAdminAccount(formData)
            setData(prev => [...prev, res.data])
            message.success('Tạo tài khoản mới thành công!')
          }
          setModalOpen(false)
          setEditing(null)
          setIsRemoveAvatar(false)
          setAvatarToDelete('')
          form.resetFields()
        } catch (e) {
          if (e?.status === 400 && e?.response?.message) message.error(e.response.message)
          else message.error('Failed to save account')
        } finally {
          setSubmitLoading(false)
        }
      })
      .catch(() => setSubmitLoading(false))
  }

  const handleDelete = async id => {
    setLoading(true)
    try {
      await deleteAdminAccount(id)
      setData(prev => prev.filter(acc => acc._id !== id))
      message.success('Đã xoá tài khoản.')
    } catch (e) {
      if (e?.response?.message) message.error(e.response.message)
      else message.error('Xoá thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const openModal = account => {
    setEditing(account)
    setModalOpen(true)
    if (account) {
      setOldAvatar(account.avatarUrl || '')
      const roleField = typeof account.role_id === 'object' && account.role_id?._id ? account.role_id._id : account.role_id

      form.setFieldsValue({
        ...account,
        role_id: roleField,
        avatarUrl: account.avatarUrl
          ? [
              {
                uid: account._id,
                name: account.avatarUrl.split('/').pop(),
                status: 'done',
                url: account.avatarUrl
              }
            ]
          : []
      })
    } else {
      setOldAvatar('')
      form.resetFields()
      if (roles?.length) form.setFieldsValue({ status: 'active', role_id: roles[0]._id })
    }
  }

  const handleChangeStatus = async (id, newStatus) => {
    setLoading(true)
    try {
      await changeStatusAdminAccount(id, newStatus)
      setData(prev => prev.map(acc => (acc._id === id ? { ...acc, status: newStatus } : acc)))
      message.success('Cập nhật trạng thái thành công!')
    } catch (e) {
      if (e?.response?.message) message.error(e.response.message)
      else message.error('Cập nhật trạng thái thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'username',
      className: 'ant-table-cell-style',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatarUrl} size={40} shape="square" className="flex-shrink-0 bg-[#eee] rounded-lg w-10 h-10 object-cover">
            {!record.avatarUrl && record.fullName ? record.fullName?.trim()?.split(' ')?.pop()?.charAt(0)?.toUpperCase() : null}
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
      render: (value, record) => {
        if (value && typeof value === 'object') {
          return value.label || value.name || 'Unknown Role'
        }
        const found = roles.find(r => r._id === value)
        return found ? found.label || found.name : 'Unknown Role'
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      className: 'align-middle',
      render: (value, record) => (
        <Select value={value} className="w-25" onChange={newStatus => handleChangeStatus(record._id, newStatus)} size="small">
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
          <Option value="banned">Banned</Option>
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
            className="dark:bg-gray-500  dark:hover:!bg-gray-400"
            icon={<EditOutlined className="dark:text-gray-300" />}
            onClick={() => openModal(record)}
          />
          <Popconfirm title="Bạn chắc chắn muốn xoá?" onConfirm={() => handleDelete(record._id)} okText="Xoá" cancelText="Huỷ">
            <Button className="dark:bg-red-500 dark:hover:!bg-red-400" icon={<DeleteOutlined className="dark:text-gray-300" />} danger />
          </Popconfirm>
        </div>
      )
    }
  ]

  return (
    <>
      <SEO title="Admin – Tài khoản" noIndex />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Title level={3} className="m-0 text-gray-900 dark:text-gray-200">
          Accounts Management
        </Title>
        <Button
          type="primary"
          onClick={() => openModal(null)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md p-2 w-full sm:w-auto"
        >
          Thêm tài khoản
        </Button>
      </div>
      <div className="overflow-x-auto custom-scrollbar bg-white dark:bg-gray-900 shadow-md rounded-md">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="_id"
          pagination={false}
          scroll={{ x: 900 }}
          style={{ minWidth: 820 }}
        />
      </div>
      <Modal
        open={modalOpen}
        title={<span className="dark:text-gray-300">{editing ? 'Sửa tài khoản' : 'Thêm tài khoản'}</span>}
        onCancel={() => {
          setModalOpen(false)
          setEditing(null)
          form.resetFields()
        }}
        onOk={handleSave}
        destroyOnClose
        confirmLoading={submitLoading}
        okButtonProps={{ disabled: submitLoading }}
        cancelButtonProps={{ disabled: submitLoading }}
        style={{ maxWidth: '95%' }}
      >
        <Form form={form} layout="vertical" initialValues={{ status: 'active' }}>
          <Form.Item
            name="username"
            label={<span className="dark:text-gray-300">Username</span>}
            rules={[
              { required: true, min: 4 },
              { pattern: /^[a-zA-Z0-9_]+$/, message: 'Chỉ nhập chữ cái, số, hoặc dấu _; không dùng ký tự đặc biệt!' }
            ]}
          >
            <Input
              className="dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400 dark:border-gray-600"
              autoFocus
              disabled={!!editing}
              placeholder="Nhập tên người dùng"
            />
          </Form.Item>
          <Form.Item name="email" label={<span className="dark:text-gray-300">Email</span>} rules={[{ required: true, type: 'email' }]}>
            <Input
              className="dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400 dark:border-gray-600"
              placeholder="Nhập email"
            />
          </Form.Item>
          {editing && (
            <Form.Item
              name="newPassword"
              label={<span className="dark:text-gray-300">New Password</span>}
              rules={[{ min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }]}
            >
              <Input.Password
                className="dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400 dark:border-gray-600"
                placeholder="Nhập mật khẩu mới (không bắt buộc)"
                autoComplete="new-password"
              />
            </Form.Item>
          )}
          {!editing && (
            <Form.Item
              name="password"
              label={<span className="dark:text-gray-300">Password</span>}
              rules={[{ required: true, min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }]}
            >
              <Input.Password
                className="dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400 dark:border-gray-600"
                placeholder="Nhập mật khẩu"
              />
            </Form.Item>
          )}
          <Form.Item
            name="fullName"
            label={<span className="dark:text-gray-300">Full Name</span>}
            rules={[{ required: true, message: 'Tên đầy đủ là bắt buộc!' }]}
          >
            <Input
              className="dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400 dark:border-gray-600"
              placeholder="Nhập tên đầy đủ"
            />
          </Form.Item>
          <Form.Item name="role_id" label={<span className="dark:text-gray-300">Role</span>} rules={[{ required: true }]}>
            <Select getPopupContainer={trigger => trigger.parentElement}>
              {roles.map(role => (
                <Option key={role._id} value={role._id}>
                  {role.label || role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label={<span className="dark:text-gray-300">Status</span>} rules={[{ required: true }]}>
            <Select getPopupContainer={trigger => trigger.parentElement}>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="banned">Banned</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="avatarUrl"
            label={<span className="dark:text-gray-300">Avatar Image</span>}
            valuePropName="fileList"
            getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              accept="image/*"
              beforeUpload={file => {
                setIsRemoveAvatar(false)
                const isImage = file.type.startsWith('image/')
                if (!isImage) message.error('You can only upload avatar image files!')
                return isImage ? false : Upload.LIST_IGNORE
              }}
              onRemove={file => {
                setAvatarToDelete(oldAvatar)
                setOldAvatar('')
                setIsRemoveAvatar(true)
                return true
              }}
            >
              <div>
                <PlusOutlined />
                <div className="mt-2 dark:text-gray-300">Add Avatar</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default AdminAccountsPage
