import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, message, Space, Typography, Popconfirm, Switch, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getAdminPermissions } from '@/services/permissionService'
import { createAdminRole, deleteAdminRole, getAdminRoles, toggleStatusAdminRole, updateAdminRoleById } from '@/services/rolesService'
import useAdminPermissions from '@/hooks/useAdminPermissions'
import titles from '@/utils/titles'

const { Title } = Typography

export default function AdminRolesPage() {
  titles('Roles')

  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState({ visible: false, editing: null })
  const [form] = Form.useForm()
  const [updatingId, setUpdatingId] = useState(null)

  const hasPermissions = useAdminPermissions()

  useEffect(() => {
    fetchData()
    fetchPermissions()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getAdminRoles()
      setRoles(res.data)
    } catch {
      setRoles([])
    }
    setLoading(false)
  }

  const fetchPermissions = async () => {
    try {
      const res = await getAdminPermissions()
      setPermissions(res.data.filter(p => !p.deleted))
    } catch {
      setPermissions([])
    }
  }

  useEffect(() => {
    if (modal.visible) {
      if (modal.editing) form.setFieldsValue(modal.editing)
      else form.resetFields()
    }
  }, [modal.visible, modal.editing, form])

  const handleCreate = () => setModal({ visible: true, editing: null })
  const handleEdit = role => setModal({ visible: true, editing: role })

  const handleDelete = async role => {
    setLoading(true)
    try {
      await deleteAdminRole(role._id)
      message.success('Role deleted!')
      fetchData()
    } catch (e) {
      message.error(e?.response?.data?.message || 'Failed to delete role')
    }
    setLoading(false)
  }

  const handleToggleActive = async role => {
    setUpdatingId(role._id)
    try {
      await toggleStatusAdminRole(role._id)
      message.success(!role.isActive ? 'Đã kích hoạt role!' : 'Đã ẩn role!')
      fetchData()
    } catch {
      message.error('Lỗi khi thay đổi trạng thái')
    }
    setUpdatingId(null)
  }

  const handleOk = async () => {
    try {
      const data = await form.validateFields()
      setLoading(true)
      if (modal.editing) {
        await updateAdminRoleById(modal.editing._id, data)
        message.success('Role updated!')
      } else {
        await createAdminRole(data)
        message.success('Role created!')
      }
      setModal({ visible: false, editing: null })
      fetchData()
    } catch (e) {
      if (e?.status === 400 && e?.response?.data?.message) message.error(e.response.data.message)
      else message.error('Failed to save role')
    }
    setLoading(false)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'label',
      key: 'label'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: perms =>
        perms?.length ? (
          perms.map(p => (
            <span key={p} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs inline-block mr-1">
              {permissions.find(_p => _p.name === p)?.title || p}
            </span>
          ))
        ) : (
          <i className="text-gray-400 text-xs">None</i>
        )
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          checkedChildren="active"
          unCheckedChildren="inactive"
          loading={updatingId === record._id}
          onChange={() => handleToggleActive(record)}
          disabled={!hasPermissions.includes('edit_role')}
        />
      ),
      width: 120
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          {hasPermissions.includes('edit_role') && (
            <Button
              icon={<EditOutlined className="dark:text-gray-300" />}
              onClick={() => handleEdit(record)}
              className="text-blue-500 hover:bg-blue-100 dark:bg-gray-500  dark:hover:!bg-gray-400"
            />
          )}
          {hasPermissions.includes('delete_role') && (
            <Popconfirm
              title="Xoá role này? (Không thể xoá nếu còn user liên kết)"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                icon={<DeleteOutlined className="dark:text-gray-300" />}
                danger
                className="hover:bg-red-100 dark:bg-red-500 dark:hover:!bg-red-400"
              />
            </Popconfirm>
          )}
        </Space>
      ),
      width: 100
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <PlusOutlined className="text-white text-xl" />
            </div>
            <div>
              <Title level={3} className="text-gray-900 dark:text-gray-200">
                Roles
              </Title>
              <p className="text-gray-500 text-sm">Manage your roles here</p>
            </div>
          </div>
          {hasPermissions.includes('create_role') && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg px-6 py-3"
            >
              New Role
            </Button>
          )}
        </div>

        {/* Table */}
        <Table dataSource={roles} columns={columns} rowKey="_id" bordered loading={loading} pagination={false} />

        {/* Modal */}
        <Modal
          title={<span className="dark:text-gray-300">{modal.editing ? 'Edit Role' : 'Create Role'}</span>}
          open={modal.visible}
          onOk={handleOk}
          onCancel={() => setModal({ visible: false, editing: null })}
          okText={modal.editing ? 'Save' : 'Create'}
          destroyOnClose
          confirmLoading={loading}
          className="custom-modal"
        >
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            initialValues={{ label: '', description: '', permissions: [], isActive: true }}
          >
            <Form.Item
              label={<span className="dark:text-gray-300">Name</span>}
              name="label"
              rules={[{ required: true, message: 'Name is required' }]}
            >
              <Input
                placeholder="Nhập tên vai trò"
                className="rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400 dark:border-gray-600"
              />
            </Form.Item>
            <Form.Item label={<span className="dark:text-gray-300">Description</span>} name="description">
              <Input.TextArea
                rows={2}
                placeholder="Mô tả ngắn gọn"
                className="rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400 dark:border-gray-600"
              />
            </Form.Item>
            <Form.Item label={<span className="dark:text-gray-300">Permissions</span>} name="permissions">
              <Select
                mode="multiple"
                allowClear
                options={permissions.map(p => ({ label: p.title, value: p.name }))}
                placeholder="Chọn quyền cho vai trò này"
                className="rounded-lg"
              />
            </Form.Item>
            <Form.Item label={<span className="dark:text-gray-300">Status</span>} name="isActive" valuePropName="checked">
              <Switch checkedChildren="active" unCheckedChildren="inactive" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}
