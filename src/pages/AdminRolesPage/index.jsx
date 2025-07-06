import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, message, Space, Typography, Popconfirm, Switch, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getAdminPermissions } from '../../services/permissionService'
import { createAdminRole, deleteAdminRole, getAdminRoles, toggleStatusAdminRole, updateAdminRoleById } from '../../services/rolesService'

const { Title } = Typography

export default function AdminRolesPage() {
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState({ visible: false, editing: null })
  const [form] = Form.useForm()
  const [updatingId, setUpdatingId] = useState(null)

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
            <span key={p} style={{ background: '#f0f0ff', padding: '1px 8px', margin: '0 2px', borderRadius: 6, display: 'inline-block' }}>
              {permissions.find(_p => _p.name === p)?.title || p}
            </span>
          ))
        ) : (
          <i style={{ color: '#888' }}>None</i>
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
            title="Xoá role này? (Không thể xoá nếu còn user liên kết)"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
      width: 100
    }
  ]

  return (
    <div className="admin-roles-page">
      <div className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title level={3}>Roles</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          New Role
        </Button>
      </div>
      <Table dataSource={roles} columns={columns} rowKey="_id" bordered loading={loading} pagination={false} />

      <Modal
        title={modal.editing ? 'Edit Role' : 'Create Role'}
        open={modal.visible}
        onOk={handleOk}
        onCancel={() => setModal({ visible: false, editing: null })}
        okText={modal.editing ? 'Save' : 'Create'}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{ label: '', description: '', permissions: [], isActive: true }}
        >
          <Form.Item label="Name" name="label" rules={[{ required: true, message: 'Name is required' }]}>
            <Input placeholder="Nhập tên vai trò" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={2} placeholder="Mô tả ngắn gọn" />
          </Form.Item>
          <Form.Item label="Permissions" name="permissions">
            <Select
              mode="multiple"
              allowClear
              options={permissions.map(p => ({ label: p.title, value: p.name }))}
              placeholder="Chọn quyền cho vai trò này"
            />
          </Form.Item>
          <Form.Item label="Status" name="isActive" valuePropName="checked">
            <Switch checkedChildren="active" unCheckedChildren="inactive" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
