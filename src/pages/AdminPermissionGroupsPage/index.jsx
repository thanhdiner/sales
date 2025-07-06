import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, message, Space, Typography, Popconfirm, Switch } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import slugify from 'slugify'
import {
  createAdminPermissionGroup,
  deleteAdminPermissionGroup,
  getAdminPermissionGroups,
  toggleAdminPermissionGroupActive,
  updateAdminPermissionGroupById
} from '../../services/permissionGroupsService'

const { Title } = Typography

export default function AdminPermissionGroupsPage() {
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
        />
      ),
      width: 120
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Xoá group này? (Chỉ xóa khi không có permission nào liên kết)"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
      width: 120
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
    <div className="admin-permission-groups-page">
      <div className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title level={3}>Permission Groups</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          New Group
        </Button>
      </div>
      <Table dataSource={groups} columns={columns} rowKey="_id" bordered loading={loading} pagination={false} />
      <Modal
        title={modal.editing ? 'Edit Group' : 'Create Group'}
        open={modal.visible}
        onOk={handleOk}
        onCancel={() => setModal({ visible: false, editing: null })}
        okText={modal.editing ? 'Save' : 'Create'}
        destroyOnClose
      >
        <Form form={form} layout="vertical" autoComplete="off" initialValues={{ label: '', value: '', description: '', isActive: true }}>
          <Form.Item
            label="Group Label"
            name="label"
            rules={[
              { required: true, message: 'Label is required' },
              { min: 3, message: 'Label must be at least 3 characters' }
            ]}
          >
            <Input
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
            label="Group Value"
            name="value"
            rules={[
              { required: true, message: 'Value is required' },
              { pattern: /^[a-z0-9_]+$/, message: 'Only a-z, 0-9, and _' }
            ]}
          >
            <Input placeholder="e.g. product" disabled={!!modal.editing} />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ max: 300, message: 'Description max 300 chars' }]}>
            <Input.TextArea rows={3} placeholder="Short description about group" />
          </Form.Item>
          <Form.Item label="Kích hoạt" name="isActive" valuePropName="checked">
            <Switch checkedChildren="active" unCheckedChildren="inactive" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
