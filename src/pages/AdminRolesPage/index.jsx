import { useEffect, useMemo, useState } from 'react'
import { Table, Button, Modal, Form, Input, message, Space, Typography, Popconfirm, Switch, Select, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getAdminPermissions } from '@/services/permissionService'
import { createAdminRole, deleteAdminRole, getAdminRoles, toggleStatusAdminRole, updateAdminRoleById } from '@/services/rolesService'
import useAdminPermissions from '@/hooks/useAdminPermissions'
import { useModalBodyScroll } from '@/hooks/useModalBodyScroll'
import SEO from '@/components/SEO'

const { Title, Text } = Typography
const DEFAULT_PAGE_SIZE = 10

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

  const paginatedRoles = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return roles.slice(startIndex, startIndex + pageSize)
  }, [currentPage, pageSize, roles])

  const hasPermissions = useAdminPermissions()

  useEffect(() => {
    fetchData()
    fetchPermissions()
  }, [])

  useEffect(() => {
    if (modal.visible) {
      if (modal.editing) {
        form.setFieldsValue(modal.editing)
      } else {
        form.resetFields()
        form.setFieldsValue({ label: '', description: '', permissions: [], isActive: true })
      }
    }
  }, [modal.visible, modal.editing, form])

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
      fetchData()
    } catch (error) {
      message.error(error?.response?.data?.message || 'Không thể xóa vai trò')
      setLoading(false)
    }
  }

  const handleToggleActive = async role => {
    setUpdatingId(role._id)

    try {
      await toggleStatusAdminRole(role._id)
      message.success(!role.isActive ? 'Đã kích hoạt vai trò' : 'Đã tạm dừng vai trò')
      fetchData()
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
      fetchData()
    } catch (error) {
      if (error?.status === 400 && error?.response?.data?.message) {
        message.error(error.response.data.message)
      } else if (error?.errorFields) {
        return
      } else {
        message.error('Không thể lưu vai trò')
      }

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
      render: label => <span className="font-medium text-gray-900 dark:text-gray-100">{label}</span>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: description => <span className="text-gray-600 dark:text-gray-400">{description || 'Không có mô tả'}</span>
    },
    {
      title: 'Quyền',
      dataIndex: 'permissions',
      key: 'permissions',
      render: rolePermissions =>
        rolePermissions?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {rolePermissions.map(permission => (
              <Tag key={permission} className="m-0 rounded-full border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700">
                {getPermissionTitle(permission)}
              </Tag>
            ))}
          </div>
        ) : (
          <span className="text-xs text-gray-400">Chưa có quyền</span>
        )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 150,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          checkedChildren="Bật"
          unCheckedChildren="Tắt"
          loading={updatingId === record._id}
          onChange={() => handleToggleActive(record)}
          disabled={!hasPermissions.includes('edit_role')}
        />
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 130,
      render: (_, record) => (
        <Space size="small">
          {hasPermissions.includes('edit_role') && (
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} className="rounded-lg" />
          )}

          {hasPermissions.includes('delete_role') && (
            <Popconfirm
              title="Xóa vai trò này?"
              description="Không thể xóa nếu vai trò vẫn đang được gán cho người dùng."
              onConfirm={() => handleDelete(record)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button icon={<DeleteOutlined />} danger className="rounded-lg" />
            </Popconfirm>
          )}
        </Space>
      )
    }
  ]

  return (
    <div className="min-h-screen rounded-xl bg-slate-50 p-6 dark:bg-gray-900">
      <SEO title="Admin – Vai trò" noIndex />

      <div className="mx-auto max-w-7xl">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Title level={2} className="!mb-1 !text-2xl !font-semibold !text-gray-900 dark:!text-white">
                Vai trò
              </Title>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Quản lý vai trò và phân quyền truy cập cho tài khoản quản trị.
              </Text>
            </div>

            {hasPermissions.includes('create_role') && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
                className="h-10 rounded-lg bg-gray-900 px-4 font-medium shadow-none hover:!bg-gray-800 sm:w-auto"
              >
                Thêm vai trò
              </Button>
            )}
          </div>

          <div className="overflow-x-auto">
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
              className="min-w-[720px]"
            />
          </div>
        </div>

        <Modal
          title={
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {modal.editing ? 'Chỉnh sửa vai trò' : 'Thêm vai trò'}
            </span>
          }
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
            className: 'rounded-lg bg-gray-900 font-medium hover:!bg-gray-800'
          }}
          cancelButtonProps={{
            className: 'rounded-lg'
          }}
        >
          <div ref={contentRef}>
            <Form
              form={form}
              layout="vertical"
              autoComplete="off"
              initialValues={{ label: '', description: '', permissions: [], isActive: true }}
              className="mt-4"
            >
              <Form.Item label="Tên vai trò" name="label" rules={[{ required: true, message: 'Vui lòng nhập tên vai trò' }]}>
                <Input
                  placeholder="Ví dụ: Quản trị sản phẩm"
                  className="rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400"
                />
              </Form.Item>

              <Form.Item label="Mô tả" name="description">
                <Input.TextArea
                  rows={3}
                  placeholder="Mô tả ngắn về vai trò"
                  className="rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-400"
                />
              </Form.Item>

              <Form.Item label="Quyền hạn" name="permissions">
                <Select
                  mode="multiple"
                  allowClear
                  options={permissions.map(permission => ({ label: permission.title, value: permission.name }))}
                  placeholder="Chọn quyền cho vai trò này"
                  className="rounded-lg"
                  maxTagCount="responsive"
                  listHeight={256}
                  getPopupContainer={trigger => trigger.parentElement}
                />
              </Form.Item>

              <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </div>
  )
}