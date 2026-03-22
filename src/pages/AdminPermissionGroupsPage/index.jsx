import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, message, Space, Typography, Popconfirm, Switch } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ToolOutlined } from '@ant-design/icons'
import slugify from 'slugify'
import {
  createAdminPermissionGroup,
  deleteAdminPermissionGroup,
  getAdminPermissionGroups,
  toggleAdminPermissionGroupActive,
  updateAdminPermissionGroupById
} from '@/services/permissionGroupsService'

import useAdminPermissions from '@/hooks/useAdminPermissions'
import SEO from '@/components/SEO'

const { Title } = Typography

export default function AdminPermissionGroupsPage() {const permissions = useAdminPermissions()

  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState({ visible: false, editing: null })
  const [form] = Form.useForm()
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getAdminPermissionGroups()
      setGroups(res.data)
    } catch (e) {
      message.error('Failed to fetch groups')
    }
    setLoading(false)
  }

  useEffect(() => {
    if (modal.visible) {
      if (modal.editing) form.setFieldsValue(modal.editing)
      else form.resetFields()
    }
  }, [modal.visible, modal.editing, form])

  const handleCreate = () => setModal({ visible: true, editing: null })
  const handleEdit = item => setModal({ visible: true, editing: item })

  const handleDelete = async item => {
    setLoading(true)
    try {
      await deleteAdminPermissionGroup(item._id)
      message.success('Group deleted!')
      fetchData()
    } catch (e) {
      if (e?.status === 400 && e?.response?.message) message.error(e.response.message)
      else message.error('Failed to delete group')
      setLoading(false)
    }
  }

  const handleOk = async () => {
    try {
      const data = await form.validateFields()
      setLoading(true)
      if (!modal.editing && data.label && !data.value) {
        data.value = slugify(data.label, { lower: true, strict: true, replacement: '_' })
      }
      if (modal.editing) {
        await updateAdminPermissionGroupById(modal.editing._id, data)
        message.success('Group updated!')
      } else {
        await createAdminPermissionGroup(data)
        message.success('Group created!')
      }
      setModal({ visible: false, editing: null })
      fetchData()
    } catch (e) {
      if (e?.status === 400 && e?.response?.message) message.error(e.response.message)
      else message.error('Failed to save group')
    }
    setLoading(false)
  }

  const columns = [
    {
      title: 'Label',
      dataIndex: 'label',
      key: 'label',
      render: text => <span className="font-semibold">{text}</span>
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          checkedChildren="active"
          unCheckedChildren="inactive"
          loading={updatingId === record._id}
          onChange={() => handleToggleActive(record)}
          disabled={!permissions.includes('edit_permission_group')}
        />
      ),
      width: 120
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          {permissions.includes('edit_permission_group') && (
            <Button
              icon={<EditOutlined className="dark:text-gray-300" />}
              onClick={() => handleEdit(record)}
              className="text-blue-500 hover:bg-blue-100 dark:bg-gray-500  dark:hover:!bg-gray-400"
            />
          )}
          {permissions.includes('delete_permission_group') && (
            <Popconfirm
              title="Xoá group này? (Chỉ xóa khi không có permission nào liên kết)"
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

  const handleToggleActive = async record => {
    setUpdatingId(record._id)
    try {
      await toggleAdminPermissionGroupActive(record._id, !record.isActive)
      message.success(`${!record.isActive ? 'active' : 'inactive'} group thành công!`)
      fetchData()
    } catch (e) {
      if (e?.status === 400 && e?.response?.message) message.error(e.response.message)
      else message.error('Lỗi khi thay đổi trạng thái')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 p-6">
      <SEO title="Admin – Nhóm quyền" noIndex />
            <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ToolOutlined className="text-white text-xl" />
            </div>
            <div>
              <Title level={2} className="text-gray-900 mb-0 dark:text-gray-200">
                Permission Groups
              </Title>
              <p className="text-gray-500 text-sm mt-1">Manage your permission groups here</p>
            </div>
          </div>
          {permissions.includes('create_permission_group') && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none rounded-lg h-10 px-6 w-full sm:w-auto"
            >
              New Group
            </Button>
          )}
        </div>
        <div className="overflow-x-auto custom-scrollbar mb-6">
          <Table
            dataSource={groups}
            columns={columns}
            rowKey="_id"
            bordered
            loading={loading}
            pagination={false}
            style={{ minWidth: 680 }}
          />
        </div>

        {/* Modal */}
        <Modal
          title={<span className="dark:text-gray-300">{modal.editing ? 'Edit Group' : 'Create Group'}</span>}
          open={modal.visible}
          onOk={handleOk}
          onCancel={() => setModal({ visible: false, editing: null })}
          okText={modal.editing ? 'Save' : 'Create'}
          destroyOnClose
          confirmLoading={loading}
          className="custom-modal"
        >
          <Form form={form} layout="vertical" autoComplete="off" initialValues={{ label: '', value: '', description: '', isActive: true }}>
            <Form.Item
              label={<span className="dark:text-gray-300"> Group Label</span>}
              name="label"
              rules={[
                { required: true, message: 'Label is required' },
                { min: 3, message: 'Label must be at least 3 characters' }
              ]}
            >
              <Input
                className="dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400 dark:border-gray-600"
                placeholder="e.g. Quản lý sản phẩm"
                onChange={e => {
                  if (!modal.editing) {
                    const slug = slugify(e.target.value, { lower: true, strict: true, replacement: '_' })
                    form.setFieldsValue({ value: slug })
                  }
                }}
              />
            </Form.Item>
            <Form.Item
              label={<span className="dark:text-gray-300">Group Value</span>}
              name="value"
              rules={[
                { required: true, message: 'Value is required' },
                { pattern: /^[a-z0-9_]+$/, message: 'Only a-z, 0-9, and _' }
              ]}
            >
              <Input
                className="dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400 dark:border-gray-600"
                placeholder="e.g. product"
                disabled={!!modal.editing}
              />
            </Form.Item>
            <Form.Item
              label={<span className="dark:text-gray-300">Description</span>}
              name="description"
              rules={[{ max: 300, message: 'Description max 300 chars' }]}
            >
              <Input.TextArea
                className="dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400 dark:border-gray-600"
                rows={3}
                placeholder="Short description about group"
              />
            </Form.Item>
            <Form.Item label={<span className="dark:text-gray-300">Kích hoạt</span>} name="isActive" valuePropName="checked">
              <Switch checkedChildren="active" unCheckedChildren="inactive" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}
