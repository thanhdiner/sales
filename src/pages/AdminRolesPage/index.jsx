import { useEffect, useMemo, useState } from 'react'
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Typography, message } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import SEO from '@/components/SEO'
import useAdminPermissions from '@/hooks/useAdminPermissions'
import { useModalBodyScroll } from '@/hooks/useModalBodyScroll'
import { getAdminPermissions } from '@/services/permissionService'
import { createAdminRole, deleteAdminRole, getAdminRoles, toggleStatusAdminRole, updateAdminRoleById } from '@/services/rolesService'
import './AdminRolesPage.scss'

const { Title, Text } = Typography

const DEFAULT_PAGE_SIZE = 10
const ROLE_INITIAL_VALUES = {
  label: '',
  description: '',
  permissions: [],
  isActive: true
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState({ visible: false, editing: null })
  const [form] = Form.useForm()
  const [updatingId, setUpdatingId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const { bodyStyle, contentRef } = useModalBodyScroll(modal.visible)
  const grantedPermissions = useAdminPermissions()

  const canCreateRole = grantedPermissions.includes('create_role')
  const canEditRole = grantedPermissions.includes('edit_role')
  const canDeleteRole = grantedPermissions.includes('delete_role')

  const paginatedRoles = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return roles.slice(startIndex, startIndex + pageSize)
  }, [currentPage, pageSize, roles])

  useEffect(() => {
    fetchData()
    fetchPermissions()
  }, [])

  useEffect(() => {
    if (!modal.visible) {
      return
    }

    if (modal.editing) {
      form.setFieldsValue(modal.editing)
      return
    }

    form.resetFields()
    form.setFieldsValue(ROLE_INITIAL_VALUES)
  }, [form, modal.editing, modal.visible])

  const fetchData = async () => {
    setLoading(true)

    try {
      const res = await getAdminRoles()
      setRoles(res.data || [])
    } catch {
      setRoles([])
    } finally {
      setLoading(false)
    }
  }

  const fetchPermissions = async () => {
    try {
      const res = await getAdminPermissions()
      setPermissions((res.data || []).filter(permission => !permission.deleted))
    } catch {
      setPermissions([])
    }
  }

  const handleCreate = () => setModal({ visible: true, editing: null })

  const handleEdit = role => setModal({ visible: true, editing: role })

  const handleDelete = async role => {
    setLoading(true)

    try {
      await deleteAdminRole(role._id)
      message.success('Đã xóa vai trò')
      await fetchData()
    } catch (error) {
      message.error(error?.response?.data?.message || 'Không thể xóa vai trò')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async role => {
    setUpdatingId(role._id)

    try {
      await toggleStatusAdminRole(role._id)
      message.success(!role.isActive ? 'Đã kích hoạt vai trò' : 'Đã tạm dừng vai trò')
      await fetchData()
    } catch {
      message.error('Không thể thay đổi trạng thái')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleOk = async () => {
    try {
      const data = await form.validateFields()
      setLoading(true)

      if (modal.editing) {
        await updateAdminRoleById(modal.editing._id, data)
        message.success('Đã cập nhật vai trò')
      } else {
        await createAdminRole(data)
        message.success('Đã tạo vai trò')
      }

      setModal({ visible: false, editing: null })
      await fetchData()
    } catch (error) {
      if (error?.status === 400 && error?.response?.data?.message) {
        message.error(error.response.data.message)
      } else if (!error?.errorFields) {
        message.error('Không thể lưu vai trò')
      }
    } finally {
      setLoading(false)
    }
  }

  const getPermissionTitle = permissionName => {
    return permissions.find(permission => permission.name === permissionName)?.title || permissionName
  }

  const columns = [
    {
      title: 'Vai trò',
      dataIndex: 'label',
      key: 'label',
      render: label => <span className="admin-roles-table__role-label">{label}</span>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: description => <span className="admin-roles-table__description">{description || 'Không có mô tả'}</span>
    },
    {
      title: 'Quyền',
      dataIndex: 'permissions',
      key: 'permissions',
      render: rolePermissions =>
        rolePermissions?.length ? (
          <div className="admin-roles-table__permission-list">
            {rolePermissions.map(permission => (
              <Tag key={permission} className="admin-roles-permission-tag">
                {getPermissionTitle(permission)}
              </Tag>
            ))}
          </div>
        ) : (
          <span className="admin-roles-table__empty">Chưa có quyền</span>
        )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 150,
      render: (isActive, record) => (
        <Switch
          className="admin-roles-switch"
          checked={isActive}
          checkedChildren="Bật"
          unCheckedChildren="Tắt"
          loading={updatingId === record._id}
          onChange={() => handleToggleActive(record)}
          disabled={!canEditRole}
        />
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          {canEditRole && (
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} className="admin-roles-action-btn" />
          )}

          {canDeleteRole && (
            <Popconfirm
              title="Xóa vai trò này?"
              description="Không thể xóa nếu vai trò vẫn đang được gán cho người dùng."
              onConfirm={() => handleDelete(record)}
              okText="Xóa"
              cancelText="Hủy"
              overlayClassName="admin-roles-popconfirm"
            >
              <Button icon={<DeleteOutlined />} danger className="admin-roles-action-btn admin-roles-action-btn--danger" />
            </Popconfirm>
          )}
        </Space>
      )
    }
  ]

  return (
    <div className="admin-roles-page">
      <SEO title="Admin - Vai trò" noIndex />

      <div className="admin-roles-page__inner">
        <section className="admin-roles-card">
          <div className="admin-roles-header">
            <div>
              <Title level={2} className="admin-roles-header__title">
                Vai trò
              </Title>
              <Text className="admin-roles-header__description">
                Quản lý vai trò và phân quyền truy cập cho tài khoản quản trị.
              </Text>
            </div>

            {canCreateRole && (
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} className="admin-roles-btn admin-roles-btn--primary">
                Thêm vai trò
              </Button>
            )}
          </div>

          <div className="admin-roles-table-wrap">
            <Table
              dataSource={paginatedRoles}
              columns={columns}
              rowKey="_id"
              loading={loading}
              pagination={{
                current: currentPage,
                pageSize,
                total: roles.length,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (count, range) => `${range[0]}-${range[1]} của ${count} vai trò`,
                onChange: page => setCurrentPage(page),
                onShowSizeChange: (page, size) => {
                  setCurrentPage(page)
                  setPageSize(size)
                }
              }}
              className="admin-roles-table min-w-[760px]"
            />
          </div>
        </section>

        <Modal
          className="admin-roles-modal"
          rootClassName="admin-roles-modal"
          wrapClassName="admin-roles-modal"
          title={<span className="admin-roles-modal__title">{modal.editing ? 'Chỉnh sửa vai trò' : 'Thêm vai trò'}</span>}
          open={modal.visible}
          onOk={handleOk}
          onCancel={() => setModal({ visible: false, editing: null })}
          okText={modal.editing ? 'Lưu' : 'Tạo'}
          cancelText="Hủy"
          destroyOnClose
          confirmLoading={loading}
          centered
          styles={{ body: bodyStyle }}
          okButtonProps={{
            className: 'admin-roles-btn admin-roles-btn--primary'
          }}
          cancelButtonProps={{
            className: 'admin-roles-btn admin-roles-btn--default'
          }}
        >
          <div ref={contentRef}>
            <Form form={form} layout="vertical" autoComplete="off" initialValues={ROLE_INITIAL_VALUES} className="admin-roles-form">
              <Form.Item label="Tên vai trò" name="label" rules={[{ required: true, message: 'Vui lòng nhập tên vai trò' }]}>
                <Input placeholder="Ví dụ: Quản trị sản phẩm" className="admin-roles-input" />
              </Form.Item>

              <Form.Item label="Mô tả" name="description">
                <Input.TextArea rows={3} placeholder="Mô tả ngắn về vai trò" className="admin-roles-input" />
              </Form.Item>

              <Form.Item label="Quyền hạn" name="permissions">
                <Select
                  mode="multiple"
                  allowClear
                  options={permissions.map(permission => ({ label: permission.title, value: permission.name }))}
                  placeholder="Chọn quyền cho vai trò này"
                  className="admin-roles-select"
                  maxTagCount="responsive"
                  listHeight={256}
                  getPopupContainer={trigger => trigger?.parentElement || document.body}
                  dropdownClassName="admin-roles-select-dropdown"
                />
              </Form.Item>

              <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
                <Switch className="admin-roles-switch" checkedChildren="Bật" unCheckedChildren="Tắt" />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </div>
  )
}
