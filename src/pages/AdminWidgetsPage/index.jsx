import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
  Space,
  Card,
  Typography,
  Avatar,
  Tag,
  Tooltip,
  Divider,
  Upload
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  AppstoreOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons'
import { createWidget, deleteWidgetById, getAdminWidgets, updateWidgetById } from '@/services/adminWidgetsService'
import titles from '@/utils/titles'

const { Title, Text } = Typography

export default function AdminWidgetsPage() {
  titles('Quản lý Widgets')

  const [widgets, setWidgets] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingWidget, setEditingWidget] = useState(null)
  const [form] = Form.useForm()
  const [oldIcon, setOldIcon] = useState('')
  const [iconToDelete, setIconToDelete] = useState('')
  const [isRemoveIcon, setIsRemoveIcon] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    fetchWidgets()
  }, [])

  const fetchWidgets = async () => {
    setLoading(true)
    try {
      const res = await getAdminWidgets()
      setWidgets(
        (res.data || []).map(w => ({
          ...w,
          isActive: w.isActive === true || w.isActive === 'true' || w.isActive === 1 || w.isActive === '1'
        }))
      )
    } catch {
      message.error('Failed to load widgets')
    } finally {
      setLoading(false)
    }
  }

  const openModal = widget => {
    setEditingWidget(widget)
    if (widget) {
      setOldIcon(widget.iconUrl || '')
      form.setFieldsValue({
        ...widget,
        isActive: widget.isActive === true || widget.isActive === 'true' || widget.isActive === 1 || widget.isActive === '1',
        iconUrl: widget.iconUrl
          ? [
              {
                uid: widget._id,
                name: widget.iconUrl.split('/').pop(),
                status: 'done',
                url: widget.iconUrl
              }
            ]
          : []
      })
    } else {
      setOldIcon('')
      form.resetFields()
    }
    setModalVisible(true)
  }

  const onFinish = async values => {
    setSubmitLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('link', values.link || '')
      formData.append('order', values.order || 0)
      formData.append('isActive', values.isActive ? 'true' : 'false')

      const file = values.iconUrl?.[0]?.originFileObj
      if (file) {
        formData.append('iconUrl', file)
        if (oldIcon) formData.append('oldImage', oldIcon)
      } else if (isRemoveIcon && editingWidget) {
        formData.append('oldImage', iconToDelete)
        formData.append('deleteImage', true)
        formData.append('iconUrl', '')
      }

      if (editingWidget) {
        await updateWidgetById(editingWidget._id, formData)
        message.success('Widget updated successfully! 🎉')
      } else {
        await createWidget(formData)
        message.success('Widget created successfully! ✨')
      }
      setModalVisible(false)
      fetchWidgets()
      setIsRemoveIcon(false)
      setIconToDelete('')
      setOldIcon('')
    } catch (err) {
      message.error(err.message || 'Failed to save widget')
    } finally {
      setSubmitLoading(false)
    }
  }

  const deleteWidget = id => {
    Modal.confirm({
      title: <span className="dark:text-gray-100">🗑️ Xác nhận xóa</span>,
      content: <span className="dark:text-gray-100">Bạn có chắc chắn muốn xóa widget này không?</span>,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteWidgetById(id)
          message.success('Widget deleted successfully! 🗑️')
          fetchWidgets()
        } catch {
          message.error('Failed to delete widget')
        }
      }
    })
  }

  const columns = [
    {
      title: (
        <Space>
          <AppstoreOutlined />
          <span>Widget</span>
        </Space>
      ),
      dataIndex: 'title',
      key: 'title',
      width: 260,
      onCell: () => ({
        style: {
          minWidth: 220,
          whiteSpace: 'normal',
          wordBreak: 'break-word'
        }
      }),
      render: (text, record) => (
        <Space size="middle">
          <Avatar src={record.iconUrl} size={40} style={{ backgroundColor: '#f0f2f5', border: '2px solid #d9d9d9' }} />
          <div>
            <Text strong style={{ fontSize: '16px' }}>
              {text}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Thứ tự: {record.order}
            </Text>
          </div>
        </Space>
      )
    },
    {
      title: (
        <Space>
          <LinkOutlined />
          <span>Liên kết</span>
        </Space>
      ),
      dataIndex: 'link',
      key: 'link',
      width: 280,
      render: text =>
        text ? (
          <Tooltip title="Click để mở liên kết">
            <Button type="link" href={text} target="_blank" rel="noreferrer" style={{ padding: 0, fontSize: '14px' }}>
              <LinkOutlined /> {text.length > 30 ? `${text.substring(0, 30)}...` : text}
            </Button>
          </Tooltip>
        ) : (
          <Text type="secondary">Không có liên kết</Text>
        )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: val => (
        <Tag
          icon={val ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          color={val ? 'success' : 'default'}
          style={{ borderRadius: '16px', fontWeight: '500' }}
        >
          {val ? 'Đang hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
      filters: [
        { text: 'Đang hoạt động', value: true },
        { text: 'Tạm dừng', value: false }
      ],
      onFilter: (value, record) => record.isActive === value
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa widget">
            <Button type="primary" ghost icon={<EditOutlined />} onClick={() => openModal(record)} style={{ borderRadius: '8px' }}>
              Sửa
            </Button>
          </Tooltip>
          <Tooltip title="Xóa widget">
            <Button danger ghost icon={<DeleteOutlined />} onClick={() => deleteWidget(record._id)} style={{ borderRadius: '8px' }}>
              Xóa
            </Button>
          </Tooltip>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 24, minHeight: '100vh' }} className="bg-[#f5f5f5] dark:bg-gray-800 dark:text-white rounded-xl">
      <Card
        style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', body: { padding: 24 } }}
        className="dark:bg-gray-800 dark:text-white"
      >
        <div
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}
          className="flex flex-col sm:flex-row sm:space-y-0 space-y-4"
        >
          <div className="w-full">
            <Title level={2} style={{ margin: 0, color: '#1890ff' }} className="!mb-1">
              <AppstoreOutlined style={{ marginRight: 12 }} />
              Quản lý Widgets
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }} className="block">
              Quản lý các widget hiển thị trên trang chủ
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
            style={{ borderRadius: 8, height: 44, fontWeight: 500, boxShadow: '0 2px 4px rgba(24, 144, 255, 0.3)' }}
            className="w-full sm:w-auto"
          >
            Thêm Widget Mới
          </Button>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        <div style={{ display: 'flex', gap: 16, marginBottom: 20, fontSize: 14 }} className="flex flex-wrap">
          <div style={{ padding: '8px 16px', background: '#e6f7ff', borderRadius: 8, color: '#1890ff' }} className="flex-1 min-w-[160px]">
            📊 Tổng: {widgets.length} widgets
          </div>
          <div style={{ padding: '8px 16px', background: '#f6ffed', borderRadius: 8, color: '#52c41a' }} className="flex-1 min-w-[160px]">
            ✅ Hoạt động: {widgets.filter(w => w.isActive).length}
          </div>
          <div style={{ padding: '8px 16px', background: '#fff2e8', borderRadius: 8, color: '#fa8c16' }} className="flex-1 min-w-[160px]">
            ⏸️ Tạm dừng: {widgets.filter(w => !w.isActive).length}
          </div>
        </div>
      </Card>

      <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} bodyStyle={{ padding: 0 }}>
        <div className="overflow-x-auto custom-scrollbar">
          <Table
            rowKey="_id"
            dataSource={widgets}
            columns={columns}
            loading={loading}
            scroll={{ x: 800 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => (
                <span className="dark:text-gray-100">
                  {range[0]}-{range[1]} của {total} widgets
                </span>
              )
            }}
            rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
            style={{
              minWidth: 720,
              '.ant-table-thead > tr > th': {
                backgroundColor: '#fafafa',
                fontWeight: '600'
              }
            }}
            className="dark:bg-gray-800 dark:text-white text-[13.5px] [&_.ant-table-tbody_td]:align-top"
          />
        </div>
      </Card>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 18, fontWeight: 600 }}>
            {editingWidget ? (
              <span className="dark:text-gray-100">✏️ Chỉnh sửa Widget</span>
            ) : (
              <span className="dark:text-gray-100">➕ Thêm Widget mới</span>
            )}
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="💾 Lưu"
        cancelText="❌ Hủy"
        width={600}
        style={{ top: 50, maxWidth: '95%' }}
        okButtonProps={{ size: 'large', style: { borderRadius: 8, height: 40, fontWeight: 500 } }}
        cancelButtonProps={{ size: 'large', style: { borderRadius: 8, height: 40 } }}
        confirmLoading={submitLoading}
      >
        <Divider style={{ margin: '16px 0' }} />

        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ isActive: true, order: 0 }} style={{ marginTop: 20 }}>
          <Form.Item
            label={
              <Text strong style={{ fontSize: 16 }}>
                📝 Tiêu đề widget
              </Text>
            }
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input
              placeholder="Nhập tiêu đề cho widget..."
              size="large"
              style={{ borderRadius: 8 }}
              className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </Form.Item>

          <Form.Item
            label={
              <Text strong style={{ fontSize: 16 }}>
                🖼️ Icon
              </Text>
            }
            name="iconUrl"
            valuePropName="fileList"
            getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: true, message: 'Vui lòng upload icon!' }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              accept="image/*"
              beforeUpload={file => {
                setIsRemoveIcon(false)
                const isImage = file.type.startsWith('image/')
                if (!isImage) {
                  message.error('Chỉ được upload file ảnh!')
                }
                return isImage ? false : Upload.LIST_IGNORE
              }}
              onRemove={file => {
                setIconToDelete(oldIcon)
                setOldIcon('')
                setIsRemoveIcon(true)
                return true
              }}
            >
              <div>
                <PlusOutlined />
                <div className="mt-2 dark:text-gray-100">Upload Icon</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            label={
              <Text strong style={{ fontSize: 16 }}>
                🔗 Liên kết
              </Text>
            }
            name="link"
          >
            <Input
              placeholder="https://example.com (tùy chọn)"
              size="large"
              style={{ borderRadius: 8 }}
              className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              label={
                <Text strong style={{ fontSize: 16 }}>
                  🔢 Thứ tự hiển thị
                </Text>
              }
              name="order"
              rules={[{ type: 'number', min: 0 }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={0} placeholder="0" size="large" style={{ width: '100%', borderRadius: 8 }} />
            </Form.Item>

            <Form.Item
              label={
                <Text strong style={{ fontSize: 16 }}>
                  🎯 Trạng thái
                </Text>
              }
              name="isActive"
              valuePropName="checked"
              style={{ flex: 1 }}
            >
              <Switch size="default" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
