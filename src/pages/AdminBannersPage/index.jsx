import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Upload, message, Space, Card, Typography, Image, Switch, Divider, Tooltip, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, LinkOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { getBanners, createBanner, updateBannerById, deleteBannerById } from '@/services/adminBannersService'
import titles from '@/utils/titles'

const { Title, Text } = Typography

export default function AdminBannersPage() {
  titles('Quản lý Banner')

  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [form] = Form.useForm()
  const [oldImg, setOldImg] = useState('')
  const [imgToDelete, setImgToDelete] = useState('')
  const [isRemoveImg, setIsRemoveImg] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    setLoading(true)
    try {
      const res = await getBanners()
      setBanners(
        (res.data || []).map(b => ({
          ...b,
          isActive: b.isActive === true || b.isActive === 'true' || b.isActive === 1 || b.isActive === '1'
        }))
      )
    } catch {
      message.error('Failed to load banners')
    } finally {
      setLoading(false)
    }
  }

  const openModal = banner => {
    setEditingBanner(banner)
    if (banner) {
      setOldImg(banner.img || '')
      form.setFieldsValue({
        ...banner,
        isActive: banner.isActive === true || banner.isActive === 'true' || banner.isActive === 1 || banner.isActive === '1',
        img: banner.img
          ? [
              {
                uid: banner._id,
                name: banner.img.split('/').pop(),
                status: 'done',
                url: banner.img
              }
            ]
          : []
      })
      setFileList(
        banner.img
          ? [
              {
                uid: banner._id,
                name: banner.img.split('/').pop(),
                status: 'done',
                url: banner.img
              }
            ]
          : []
      )
    } else {
      setOldImg('')
      setFileList([])
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
      formData.append('isActive', values.isActive ? 'true' : 'false')

      const file = values.img?.[0]?.originFileObj
      if (file) {
        formData.append('img', file)
        if (oldImg) formData.append('oldImage', oldImg)
      } else if (isRemoveImg && editingBanner) {
        formData.append('oldImage', imgToDelete)
        formData.append('deleteImage', true)
        formData.append('img', '')
      }

      if (editingBanner) {
        await updateBannerById(editingBanner._id, formData)
        message.success('Banner updated successfully! 🎉')
      } else {
        await createBanner(formData)
        message.success('Banner created successfully! ✨')
      }
      setModalVisible(false)
      fetchBanners()
      setIsRemoveImg(false)
      setImgToDelete('')
      setOldImg('')
    } catch (err) {
      message.error(err.message || 'Failed to save banner')
    } finally {
      setSubmitLoading(false)
    }
  }

  const deleteBanner = id => {
    Modal.confirm({
      title: <span className="dark:text-gray-100">🗑️ Xác nhận xóa</span>,
      content: <span className="dark:text-gray-100">Bạn có chắc chắn muốn xóa banner này không?</span>,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteBannerById(id)
          message.success('Banner deleted successfully! 🗑️')
          fetchBanners()
        } catch {
          message.error('Failed to delete banner')
        }
      }
    })
  }

  const onUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const columns = [
    {
      title: (
        <Space>
          <Text strong>Ảnh Banner</Text>
        </Space>
      ),
      dataIndex: 'img',
      key: 'img',
      width: 160,
      render: img => (img ? <Image width={140} src={img} alt="Banner" /> : <Text type="secondary">Chưa có ảnh</Text>)
    },
    {
      title: (
        <Space>
          <Text strong>Tiêu đề</Text>
        </Space>
      ),
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: (
        <Space>
          <LinkOutlined />
          <Text strong>Link</Text>
        </Space>
      ),
      dataIndex: 'link',
      key: 'link',
      render: link =>
        link ? (
          <Tooltip title="Click để mở liên kết">
            <a href={link} target="_blank" rel="noreferrer" style={{ fontSize: 14 }}>
              {link.length > 30 ? `${link.substring(0, 30)}...` : link}
            </a>
          </Tooltip>
        ) : (
          <Text type="secondary">Không có</Text>
        )
    },
    {
      title: (
        <Space>
          <Text strong>Trạng thái</Text>
        </Space>
      ),
      dataIndex: 'isActive',
      key: 'isActive',
      render: val => (
        <Tag
          icon={val ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          color={val ? 'success' : 'default'}
          style={{ borderRadius: 16, fontWeight: 500 }}
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
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa banner">
            <Button type="primary" ghost icon={<EditOutlined />} onClick={() => openModal(record)} style={{ borderRadius: 8 }}>
              Sửa
            </Button>
          </Tooltip>
          <Tooltip title="Xóa banner">
            <Button danger ghost icon={<DeleteOutlined />} onClick={() => deleteBanner(record._id)} style={{ borderRadius: 8 }}>
              Xóa
            </Button>
          </Tooltip>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 24, minHeight: '100vh' }} className="bg-[#f5f5f5] dark:bg-gray-800 rounded-xl">
      <Card
        className="dark:bg-gray-800 dark:text-white"
        style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', body: { padding: 24 } }}
        title={
          <div
            style={{ display: 'flex', padding: '24px 0', justifyContent: 'space-between', alignItems: 'center' }}
            className="flex flex-col sm:flex-row sm:space-y-0 space-y-4"
          >
            <Title level={2} style={{ margin: 0, color: '#1890ff' }} className="!mb-0">
              Quản lý Banner
            </Title>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => openModal()}
              style={{ borderRadius: 8, height: 44, fontWeight: 500, boxShadow: '0 2px 4px rgba(24,144,255,0.3)' }}
              className="w-full sm:w-auto"
            >
              Thêm Banner Mới
            </Button>
          </div>
        }
      >
        <div className="overflow-x-auto custom-scrollbar">
          <Table
            rowKey="_id"
            dataSource={banners}
            columns={columns}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} banners`
            }}
            rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
            style={{
              minWidth: 720,
              '.ant-table-thead > tr > th': {
                backgroundColor: '#fafafa',
                fontWeight: '600'
              }
            }}
          />
        </div>
      </Card>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 18, fontWeight: 600 }}>
            {editingBanner ? (
              <span className="dark:text-gray-100">✏️ Chỉnh sửa Banner</span>
            ) : (
              <span className="dark:text-gray-100">➕ Thêm Banner mới</span>
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
        destroyOnClose
      >
        <Divider style={{ margin: '16px 0' }} />

        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ isActive: true }} style={{ marginTop: 20 }}>
          <Form.Item
            label={
              <Text strong style={{ fontSize: 16 }} className="dark:text-gray-100">
                📝 Tiêu đề banner
              </Text>
            }
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input
              placeholder="Nhập tiêu đề banner..."
              size="large"
              style={{ borderRadius: 8 }}
              className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
            />
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
              placeholder="Nhập link chuyển hướng (tùy chọn)"
              size="large"
              style={{ borderRadius: 8 }}
              className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
            />
          </Form.Item>

          <Form.Item label={<span className="dark:text-gray-100">Trạng thái</span>} name="isActive" valuePropName="checked">
            <Switch size="default" />
          </Form.Item>

          <Form.Item
            label={
              <Text strong style={{ fontSize: 16 }}>
                🖼️ Ảnh banner
              </Text>
            }
            name="img"
            valuePropName="fileList"
            getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: !editingBanner, message: 'Vui lòng upload ảnh banner!' }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              accept="image/*"
              beforeUpload={file => {
                setIsRemoveImg(false)
                const isImage = file.type.startsWith('image/')
                if (!isImage) message.error('Chỉ được upload file ảnh!')
                return isImage ? false : Upload.LIST_IGNORE
              }}
              onRemove={file => {
                setImgToDelete(oldImg)
                setOldImg('')
                setIsRemoveImg(true)
                return true
              }}
              onChange={onUploadChange}
              fileList={fileList}
            >
              {fileList.length < 1 && (
                <div>
                  <PlusOutlined />
                  <div className="mt-2 dark:text-gray-100">Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
