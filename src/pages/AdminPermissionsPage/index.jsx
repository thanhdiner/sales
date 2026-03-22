import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, message, Space, Typography, Popconfirm, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ToolOutlined } from '@ant-design/icons'
import slugify from 'slugify'
import { createAdminPermissions, deleteAdminPermission, getAdminPermissions, updatePermissionById } from '@/services/permissionService'
import { getAdminPermissionGroups } from '@/services/permissionGroupsService'
import useAdminPermissions from '@/hooks/useAdminPermissions'
import SEO from '@/components/SEO'

const { Title } = Typography

export default function AdminPermissionsPage() {const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState({ visible: false, editing: null })
  const [form] = Form.useForm()
  const [permissionGroups, setPermissionGroups] = useState([])
  const hasPermissions = useAdminPermissions()

  useEffect(() => {
    fetchData()
    fetchGroups()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const res = await getAdminPermissions()
    setPermissions(res.data)
    setLoading(false)
  }

  const fetchGroups = async () => {
    try {
      const res = await getAdminPermissionGroups()
      setPermissionGroups(res.data.filter(g => g.isActive && !g.deleted))
    } catch {
      setPermissionGroups([])
    }
  }

  useEffect(() => {
    if (modal.visible) {
      if (modal.editing) form.setFieldsValue(modal.editing)
      else form.resetFields()
    }
  }, [modal.visible, modal.editing, form])

  const handleCreate = () => {
    setModal({ visible: true, editing: null })
  }

  const handleEdit = item => {
    setModal({ visible: true, editing: item })
  }

  const handleDelete = async item => {
    setLoading(true)
    try {
      await deleteAdminPermission(item._id)
      message.success('Permission deleted!')
      fetchData()
    } catch (e) {
      message.error('Failed to delete permission')
      setLoading(false)
    }
  }

  const handleOk = async () => {
    try {
      const data = await form.validateFields()
      setLoading(true)
      if (modal.editing) {
        await updatePermissionById(modal.editing._id, data)
        message.success('Permission updated!')
      } else {
        await createAdminPermissions(data)
        message.success('Permission created!')
      }
      setModal({ visible: false, editing: null })
      fetchData()
    } catch (e) {
      if (e?.response?.message === 'Created unsuccessful' || e?.response?.message === 'Updated unsuccessful') {
        message.error(e?.response?.message)
      }
    }
    setLoading(false)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: name => <span className="font-semibold">{name}</span>
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Group',
      dataIndex: 'group',
      key: 'group',
      render: group => <span>{permissionGroups.find(opt => opt.value === group)?.label || group}</span>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          {hasPermissions.includes('edit_permission') && (
            <Button
              icon={<EditOutlined className="dark:text-gray-300" />}
              onClick={() => handleEdit(record)}
              className="text-blue-500 hover:bg-blue-100 dark:bg-gray-500  dark:hover:!bg-gray-400"
            />
          )}
          {hasPermissions.includes('delete_permission') && (
            <Popconfirm title="Are you sure to delete this permission?" onConfirm={() => handleDelete(record)} okText="Yes" cancelText="No">
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
      <SEO title="Admin – Quyền hạn" noIndex />
            <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ToolOutlined className="text-white text-xl" />
            </div>
            <div>
              <Title level={2} className="text-gray-900 mb-0 dark:text-gray-200">
                Permissions
              </Title>
              <p className="text-gray-500 text-sm mt-1">Manage system permissions and access controls</p>
            </div>
          </div>
          {hasPermissions.includes('create_permission') && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white rounded-lg h-10 px-6 w-full sm:w-auto"
            >
              New Permission
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar mb-6">
          <Table
            dataSource={permissions}
            columns={columns}
            rowKey="_id"
            bordered
            loading={loading}
            pagination={false}
            style={{ minWidth: 720 }}
          />
        </div>

        {/* Modal */}
        <Modal
          title={<span className="dark:text-gray-300">{modal.editing ? 'Edit Permission' : 'Create Permission'}</span>}
          open={modal.visible}
          onOk={handleOk}
          onCancel={() => setModal({ visible: false, editing: null })}
          okText={modal.editing ? 'Save' : 'Create'}
          destroyOnClose
          confirmLoading={loading}
          className="custom-modal"
        >
          <Form form={form} layout="vertical" autoComplete="off" initialValues={{ name: '', title: '', description: '', group: '' }}>
            <Form.Item
              label={<span className="dark:text-gray-300">Permission Title</span>}
              name="title"
              rules={[
                { required: true, message: 'Permission title is required' },
                { min: 3, message: 'Permission title must be at least 3 characters' }
              ]}
            >
              <Input
                className="dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400 dark:border-gray-600"
                placeholder="e.g. View Products"
                onChange={e => {
                  const newSlug = slugify(e.target.value, { lower: true, strict: true, replacement: '_' })
                  if (!modal.editing) form.setFieldsValue({ name: newSlug })
                }}
              />
            </Form.Item>
            <Form.Item
              label={<span className="dark:text-gray-300">Permission Name</span>}
              name="name"
              rules={[
                { required: true, message: 'Permission name is required' },
                { min: 3, message: 'Permission name must be at least 3 characters' },
                { pattern: /^[a-z0-9_]+$/, message: 'Only a-z, 0-9, and _' }
              ]}
            >
              <Input
                className="dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400 dark:border-gray-600 dark:disabled:bg:gray-500"
                placeholder="e.g. view_products"
                disabled={!!modal.editing}
              />
            </Form.Item>
            <Form.Item label={<span className="dark:text-gray-300">Description</span>} name="description">
              <Input.TextArea
                className="dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400 dark:border-gray-600"
                rows={3}
                placeholder="Short description about permission"
              />
            </Form.Item>
            <Form.Item
              label={<span className="dark:text-gray-300">Group</span>}
              name="group"
              rules={[{ required: true, message: 'Please select group' }]}
            >
              <Select
                getPopupContainer={trigger => trigger.parentElement}
                dropdownStyle={{ zIndex: 1238 }}
                placeholder="Select group"
                options={permissionGroups}
                allowClear
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}
