import React, { useEffect, useState } from 'react'
import { Tabs, Form, Input, Upload, Button, Card, Row, Col, message, Divider } from 'antd'
import { SaveOutlined, EyeOutlined, GlobalOutlined, PhoneOutlined, MailOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons'
import { editAdminWebsiteConfig } from '@/services/adminWebsiteConfigService'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWebsiteConfig } from '@/stores/websiteConfigSlice'
import { useSearchParams } from 'react-router-dom'

const { TextArea } = Input

function urlToFileList(url, name = 'image.jpg') {
  if (!url) return []
  return [
    {
      uid: '-1',
      name,
      status: 'done',
      url
    }
  ]
}

export default function WebsiteConfigTab() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!websiteConfig) dispatch(fetchWebsiteConfig())
  }, [dispatch, websiteConfig])

  const getInitial = data => {
    if (!data) return {}
    return {
      ...data,
      logo: urlToFileList(data.logoUrl, 'logo.png'),
      favicon: urlToFileList(data.faviconUrl, 'favicon.png'),
      dailySuggestionBannerImg: urlToFileList(data.dailySuggestionBanner?.imageUrl, 'banner.png'),
      dailySuggestionBanner: data.dailySuggestionBanner || {}
    }
  }
  useEffect(() => {
    if (websiteConfig) form.setFieldsValue(getInitial(websiteConfig))
  }, [form, websiteConfig])

  const tabItems = [
    {
      label: (
        <span className="dark:text-gray-400">
          <GlobalOutlined /> Thông tin cơ bản
        </span>
      ),
      key: '1',
      children: (
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Card title={<span className="dark:text-gray-300">Thông tin website</span>} className="mb-6 dark:bg-gray-800">
              <Form.Item
                label={<span className="dark:text-gray-300">Tên website</span>}
                name="siteName"
                rules={[{ required: true, message: 'Vui lòng nhập tên website!' }]}
              >
                <Input
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
                  placeholder="Nhập tên website"
                  size="large"
                />
              </Form.Item>

              <Form.Item label={<span className="dark:text-gray-300">Slogan/Tagline</span>} name="tagline">
                <Input
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
                  placeholder="Nhập slogan của website"
                  size="large"
                />
              </Form.Item>

              <Form.Item label={<span className="dark:text-gray-300">Mô tả website</span>} name="description">
                <TextArea
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
                  rows={4}
                  placeholder="Nhập mô tả về website của bạn"
                />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card className="dark:bg-gray-800" title={<span className="dark:text-gray-300">Logo & Favicon</span>}>
              <Form.Item
                name="logo"
                label={<span className="dark:text-gray-300">Logo website</span>}
                valuePropName="fileList"
                getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
                rules={[{ required: true, message: 'Vui lòng upload Logo!' }]}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  accept="image/*"
                  beforeUpload={file => {
                    const isImage = file.type.startsWith('image/')
                    if (!isImage) message.error('You can only upload image files!')
                    return isImage ? false : Upload.LIST_IGNORE
                  }}
                >
                  <div>
                    <PlusOutlined />
                    <div className="mt-2 dark:text-gray-300">Tải lên</div>
                  </div>
                </Upload>
              </Form.Item>

              <Form.Item
                name="favicon"
                label={<span className="dark:text-gray-300">Favicon</span>}
                valuePropName="fileList"
                getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
                rules={[{ required: true, message: 'Please upload an image!' }]}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  accept="image/*"
                  beforeUpload={file => {
                    const isImage = file.type.startsWith('image/')
                    if (!isImage) message.error('You can only upload image files!')
                    return isImage ? false : Upload.LIST_IGNORE
                  }}
                >
                  <div>
                    <PlusOutlined />
                    <div className="mt-2 dark:text-gray-300">Tải lên</div>
                  </div>
                </Upload>
              </Form.Item>
            </Card>
          </Col>
        </Row>
      )
    },
    {
      label: (
        <span className="dark:text-gray-400">
          <PhoneOutlined /> Liên hệ
        </span>
      ),
      key: '2',
      children: (
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Card title={<span className="dark:text-gray-300">Thông tin liên hệ cơ bản</span>} className="mb-6 dark:bg-gray-800">
              <Form.Item label={<span className="dark:text-gray-300">Số điện thoại</span>} name={['contactInfo', 'phone']}>
                <Input
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                  prefix={<PhoneOutlined />}
                  placeholder="Nhập số điện thoại"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label={<span className="dark:text-gray-300">Email</span>}
                name={['contactInfo', 'email']}
                rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}
              >
                <Input
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                  prefix={<MailOutlined />}
                  placeholder="Nhập địa chỉ email"
                  size="large"
                />
              </Form.Item>

              <Form.Item label={<span className="dark:text-gray-300">Địa chỉ</span>} name={['contactInfo', 'address']}>
                <TextArea
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
                  rows={3}
                  placeholder="Nhập địa chỉ công ty/tổ chức"
                />
              </Form.Item>

              <Form.Item label={<span className="dark:text-gray-300">Website</span>} name={['contactInfo', 'website']}>
                <Input
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                  prefix={<GlobalOutlined />}
                  placeholder="https://example.com"
                  size="large"
                />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title={<span className="dark:text-gray-300">Mạng xã hội</span>} className="dark:bg-gray-800">
              <Form.Item label={<span className="dark:text-gray-300">Facebook</span>} name={['contactInfo', 'socialMedia', 'facebook']}>
                <Input
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
                  placeholder="https://facebook.com/yourpage"
                  size="large"
                />
              </Form.Item>

              <Form.Item label={<span className="dark:text-gray-300">Twitter</span>} name={['contactInfo', 'socialMedia', 'twitter']}>
                <Input
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
                  placeholder="https://twitter.com/youraccount"
                  size="large"
                />
              </Form.Item>

              <Form.Item label={<span className="dark:text-gray-300">Instagram</span>} name={['contactInfo', 'socialMedia', 'instagram']}>
                <Input
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
                  placeholder="https://instagram.com/youraccount"
                  size="large"
                />
              </Form.Item>

              <Form.Item label={<span className="dark:text-gray-300">LinkedIn</span>} name={['contactInfo', 'socialMedia', 'linkedin']}>
                <Input
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
                  placeholder="https://linkedin.com/company/yourcompany"
                  size="large"
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      )
    },
    {
      label: (
        <span className="dark:text-gray-400">
          <SettingOutlined /> SEO & Analytics
        </span>
      ),
      key: '3',
      children: (
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Card title={<span className="dark:text-gray-300">Cài đặt SEO</span>} className="mb-6 dark:bg-gray-800">
              <Form.Item label={<span className="dark:text-gray-300">Meta Title</span>} name={['seoSettings', 'metaTitle']}>
                <Input
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
                  placeholder="Tiêu đề hiển thị trên Google"
                  size="large"
                  showCount
                  maxLength={60}
                />
              </Form.Item>

              <Form.Item label={<span className="dark:text-gray-300">Meta Description</span>} name={['seoSettings', 'metaDescription']}>
                <TextArea
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
                  rows={3}
                  placeholder="Mô tả hiển thị trên kết quả tìm kiếm"
                  showCount
                  maxLength={160}
                />
              </Form.Item>

              <Form.Item label={<span className="dark:text-gray-300">Keywords</span>} name={['seoSettings', 'keywords']}>
                <Input
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
                  placeholder="từ khóa 1, từ khóa 2, từ khóa 3"
                  size="large"
                />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title={<span className="dark:text-gray-300">Analytics & Tracking</span>} className="dark:bg-gray-800">
              <Form.Item label={<span className="dark:text-gray-300">Google Analytics ID</span>} name={['seoSettings', 'googleAnalytics']}>
                <Input
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
                  placeholder="G-XXXXXXXXXX"
                  size="large"
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      )
    },
    {
      label: (
        <span className="dark:text-gray-400">
          <SettingOutlined /> Ảnh Gợi Ý (Banner)
        </span>
      ),
      key: '4',
      children: (
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Card title={<span className="dark:text-gray-300">Nội dung Banner</span>} className="mb-6 dark:bg-gray-800">
              <Form.Item label={<span className="dark:text-gray-300">Chữ góc trái (Ví dụ: TIKI)</span>} name={['dailySuggestionBanner', 'leftText']}>
                <Input
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
                  placeholder="TIKI"
                  size="large"
                />
              </Form.Item>
              <Form.Item label={<span className="dark:text-gray-300">Chữ góc phải (Ví dụ: SAMSUNG)</span>} name={['dailySuggestionBanner', 'rightText']}>
                <Input
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
                  placeholder="SAMSUNG"
                  size="large"
                />
              </Form.Item>
              <Form.Item label={<span className="dark:text-gray-300">Tiêu đề chính</span>} name={['dailySuggestionBanner', 'title']}>
                <Input
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
                  placeholder="Galaxy A57 | A37 5G"
                  size="large"
                />
              </Form.Item>
              <Form.Item label={<span className="dark:text-gray-300">Tiêu đề phụ</span>} name={['dailySuggestionBanner', 'subtitle']}>
                <Input
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
                  placeholder="Bắt Vibe Awesome Cực Nét"
                  size="large"
                />
              </Form.Item>
              <Form.Item label={<span className="dark:text-gray-300">Đường dẫn liên kết (CTA)</span>} name={['dailySuggestionBanner', 'link']}>
                <Input
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400"
                  placeholder="/product/galaxy-a57"
                  size="large"
                />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title={<span className="dark:text-gray-300">Ảnh Banner (Hiển thị góc phải dưới)</span>} className="dark:bg-gray-800">
              <Form.Item
                name="dailySuggestionBannerImg"
                valuePropName="fileList"
                getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  accept="image/*"
                  beforeUpload={file => {
                    const isImage = file.type.startsWith('image/')
                    if (!isImage) message.error('Vui lòng chọn file ảnh hợp lệ!')
                    return isImage ? false : Upload.LIST_IGNORE
                  }}
                >
                  <div>
                    <PlusOutlined />
                    <div className="mt-2 dark:text-gray-300">Tải ảnh lên</div>
                  </div>
                </Upload>
              </Form.Item>
              <div className="text-gray-500 dark:text-gray-400 text-sm mt-2">Đề xuất tỉ lệ 2:1 hoặc tải ảnh mockup không nền.</div>
            </Card>
          </Col>
        </Row>
      )
    }
  ]

  const handleSave = async values => {
    try {
      setLoading(true)
      const formData = new FormData()

      const oldImages = []
      const deleteImages = []

      if (websiteConfig?.logoUrl) {
        oldImages.push(websiteConfig.logoUrl)
        deleteImages.push(!!(values.logo && values.logo[0]?.originFileObj))
      }
      if (websiteConfig?.faviconUrl) {
        oldImages.push(websiteConfig.faviconUrl)
        deleteImages.push(!!(values.favicon && values.favicon[0]?.originFileObj))
      }
      if (websiteConfig?.dailySuggestionBanner?.imageUrl) {
        oldImages.push(websiteConfig.dailySuggestionBanner.imageUrl)
        deleteImages.push(!!(values.dailySuggestionBannerImg && values.dailySuggestionBannerImg[0]?.originFileObj))
      }
      formData.append('oldImages', JSON.stringify(oldImages))
      formData.append('deleteImages', JSON.stringify(deleteImages))
      if (values.logo && values.logo[0]?.originFileObj) {
        formData.append('logo', values.logo[0].originFileObj)
      }
      if (values.favicon && values.favicon[0]?.originFileObj) {
        formData.append('favicon', values.favicon[0].originFileObj)
      }
      if (values.dailySuggestionBannerImg && values.dailySuggestionBannerImg[0]?.originFileObj) {
        formData.append('dailySuggestionBannerImg', values.dailySuggestionBannerImg[0].originFileObj)
      }
      formData.append('siteName', values.siteName)
      formData.append('tagline', values.tagline)
      formData.append('description', values.description)
      formData.append('contactInfo', JSON.stringify(values.contactInfo || {}))
      formData.append('seoSettings', JSON.stringify(values.seoSettings || {}))
      formData.append('dailySuggestionBanner', JSON.stringify(values.dailySuggestionBanner || {}))

      await editAdminWebsiteConfig(formData)
      message.success('Cấu hình đã được lưu thành công!')

      dispatch(fetchWebsiteConfig())
    } catch (e) {
      message.error('Lưu cấu hình thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => message.info('Preview feature coming soon!')
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTabKey = searchParams.get('tab') || '1'
  
  const handleTabChange = (key) => {
    const params = new URLSearchParams(searchParams)
    params.set('tab', key)
    setSearchParams(params, { replace: true })
  }

  if (!websiteConfig) return <div className="p-8 text-center text-gray-500">Đang tải cấu hình...</div>

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen dark:bg-gray-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 dark:text-gray-200">Cấu Hình Website</h1>
        <p className="text-gray-600 dark:text-gray-400">Quản lý thông tin cơ bản và cài đặt của website</p>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSave} initialValues={getInitial(websiteConfig)} className="w-full">
        <Tabs activeKey={activeTabKey} onChange={handleTabChange} className="w-full" items={tabItems} />
        <Divider />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            className="w-full sm:w-auto dark:bg-blue-600 dark:text-gray-300 dark:hover:!bg-blue-500 dark:hover:!text-gray-100 dark:hover:!border-gray-300"
            icon={<EyeOutlined />}
            size="large"
            onClick={handlePreview}
            disabled={loading}
          >
            Xem trước
          </Button>

          <div className="flex w-full sm:w-auto justify-stretch sm:justify-end gap-2">
            <Button
              className="w-full sm:w-auto dark:bg-gray-500 dark:text-gray-200 dark:hover:!bg-gray-400 dark:hover:!text-gray-100 dark:hover:!border-gray-300"
              size="large"
              disabled={loading}
              onClick={() => {
                form.setFieldsValue(getInitial(websiteConfig))
                message.info('Đã hoàn tác các thay đổi!')
              }}
            >
              Hủy bỏ
            </Button>

            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" loading={loading} className="w-full sm:w-auto">
              Lưu cấu hình
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}
