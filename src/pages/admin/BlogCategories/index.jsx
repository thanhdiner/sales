import { Button, Drawer, Form, Image, Input, InputNumber, Modal, Space, Switch, Table, Tag, Upload, message } from 'antd'
import { UploadCloud } from 'lucide-react'
import { useEffect, useState } from 'react'

import SEO from '@/components/shared/SEO'
import { uploadBlogMedia } from '@/services/admin/content/blog'
import { createBlogCategory, deleteBlogCategory, getBlogCategories, updateBlogCategory } from '@/services/admin/content/blogCategory'

export default function BlogCategories() {
  const [form] = Form.useForm()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [open, setOpen] = useState(false)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)

  const fetchItems = async () => {
    setLoading(true)
    try {
      const response = await getBlogCategories()
      setItems(Array.isArray(response?.data) ? response.data : [])
    } catch {
      message.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  const openForm = item => {
    setEditing(item || null)
    form.resetFields()
    form.setFieldsValue(item || { isActive: true, sortOrder: 0, thumbnail: '', seo: {} })
    setOpen(true)
  }

  const handleThumbnailUpload = async file => {
    if (!file.type?.startsWith('image/')) {
      message.error('Only image files are allowed')
      return Upload.LIST_IGNORE
    }

    setUploadingThumbnail(true)
    try {
      const response = await uploadBlogMedia(file)
      const url = response?.url || response?.data?.url || response?.asset?.url || ''
      if (!url) throw new Error('Missing upload URL')
      form.setFieldValue('thumbnail', url)
      form.setFieldValue(['seo', 'thumbnail'], url)
      message.success('Thumbnail uploaded')
    } catch (error) {
      message.error(error?.response?.message || error?.response?.error || 'Upload failed')
    } finally {
      setUploadingThumbnail(false)
    }

    return Upload.LIST_IGNORE
  }

  const handleSubmit = async values => {
    try {
      if (editing?._id) await updateBlogCategory(editing._id, values)
      else await createBlogCategory(values)
      message.success('Saved')
      setOpen(false)
      fetchItems()
    } catch (error) {
      message.error(error?.response?.message || error?.response?.error || 'Save failed')
    }
  }

  const handleDelete = item => Modal.confirm({
    title: 'Disable category?',
    onOk: async () => {
      await deleteBlogCategory(item._id)
      message.success('Disabled')
      fetchItems()
    }
  })

  return (
    <div className="p-6">
      <SEO title="Blog Categories" noIndex />
      <div className="mb-4 flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Blog Categories</h1><p>Manage blog category metadata</p></div>
        <Button type="primary" onClick={() => openForm(null)}>Add category</Button>
      </div>
      <Table rowKey="_id" loading={loading} dataSource={items} columns={[
        { title: 'Name', dataIndex: 'name' },
        { title: 'Slug', dataIndex: 'slug' },
        { title: 'Sort', dataIndex: 'sortOrder', width: 90 },
        { title: 'Status', dataIndex: 'isActive', render: value => <Tag color={value ? 'green' : 'default'}>{value ? 'Active' : 'Disabled'}</Tag> },
        { title: 'Actions', width: 180, render: (_, item) => <Space><Button onClick={() => openForm(item)}>Edit</Button><Button danger onClick={() => handleDelete(item)}>Disable</Button></Space> }
      ]} />
      <Drawer title={editing ? 'Edit category' : 'Add category'} open={open} onClose={() => setOpen(false)} width={460}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="slug" label="Slug"><Input /></Form.Item>
          <Form.Item name="description" label="Description"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item shouldUpdate={(previous, current) => previous.thumbnail !== current.thumbnail}>
            {() => {
              const thumbnail = form.getFieldValue('thumbnail')
              return (
                <div className="space-y-2">
                  <Form.Item name="thumbnail" label="Thumbnail" noStyle><Input type="hidden" /></Form.Item>
                  <div className="flex items-start gap-3">
                    {thumbnail ? <Image src={thumbnail} width={120} height={80} className="rounded object-cover" /> : null}
                    <div className="flex flex-col gap-2">
                      <Upload accept="image/*" showUploadList={false} beforeUpload={handleThumbnailUpload}>
                        <Button icon={<UploadCloud size={16} />} loading={uploadingThumbnail}>{thumbnail ? 'Change thumbnail' : 'Upload thumbnail'}</Button>
                      </Upload>
                      {thumbnail ? <Button danger onClick={() => form.setFieldValue('thumbnail', '')}>Remove thumbnail</Button> : null}
                    </div>
                  </div>
                </div>
              )
            }}
          </Form.Item>
          <Form.Item name={['seo', 'title']} label="SEO title"><Input /></Form.Item>
          <Form.Item name={['seo', 'description']} label="SEO description"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="sortOrder" label="Sort order"><InputNumber className="w-full" /></Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked"><Switch /></Form.Item>
          <Button type="primary" htmlType="submit" block>Save</Button>
        </Form>
      </Drawer>
    </div>
  )
}
