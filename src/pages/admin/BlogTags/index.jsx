import { Button, Drawer, Form, Input, Modal, Select, Space, Table, Tag, message } from 'antd'
import { useEffect, useRef, useState } from 'react'

import SEO from '@/components/shared/SEO'
import { createBlogTag, deleteBlogTag, getBlogTags, updateBlogTag, updateBlogTagStatus } from '@/services/admin/content/blogTag'
import { translateContentToEnglish } from '@/services/admin/content/contentTranslation'

export default function BlogTags() {
  const [form] = Form.useForm()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [translating, setTranslating] = useState(false)
  const savingRef = useRef(false)
  const actionRef = useRef(false)

  const fetchItems = async () => {
    setLoading(true)
    try {
      const response = await getBlogTags()
      setItems(Array.isArray(response?.data) ? response.data : [])
    } catch {
      message.error('Failed to load tags')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  const openForm = item => {
    setEditing(item || null)
    form.resetFields()
    form.setFieldsValue(item || { status: 'active', translations: { en: { name: '', slug: '' } } })
    setOpen(true)
  }

  const handleSaveClick = () => {
    if (savingRef.current) return
    savingRef.current = true
    setSaving(true)
    form.submit()
  }

  const handleAutoTranslate = async () => {
    setTranslating(true)
    try {
      const values = form.getFieldsValue(true)
      const response = await translateContentToEnglish({
        target: 'blog_tag',
        payload: { name: values.name }
      })
      form.setFieldsValue({
        translations: {
          ...values.translations,
          en: {
            ...(values.translations?.en || {}),
            name: response?.data?.name || ''
          }
        }
      })
      message.success('Translated')
    } catch (error) {
      message.error(error?.response?.message || error?.response?.error || 'Translate failed')
    } finally {
      setTranslating(false)
    }
  }

  const handleSubmit = async values => {
    if (!savingRef.current) {
      savingRef.current = true
      setSaving(true)
    }
    try {
      if (editing?._id) await updateBlogTag(editing._id, values)
      else await createBlogTag(values)
      message.success({ content: 'Saved', key: 'blog-tag-save' })
      setOpen(false)
      fetchItems()
    } catch (error) {
      message.error({ content: error?.response?.message || error?.response?.error || 'Save failed', key: 'blog-tag-save' })
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }

  const handleDelete = item => {
    if (actionRef.current) return
    Modal.confirm({
      title: 'Delete tag?',
      content: 'Tag will be hidden from future selection.',
      okType: 'danger',
      onOk: async () => {
        if (actionRef.current) return
        actionRef.current = true
        setActionLoading(true)
        try {
          await deleteBlogTag(item._id)
          message.success('Deleted')
          fetchItems()
        } finally {
          actionRef.current = false
          setActionLoading(false)
        }
      }
    })
  }

  const handleToggleStatus = async item => {
    if (actionRef.current) return
    actionRef.current = true
    setActionLoading(true)
    try {
      await updateBlogTagStatus(item._id, item.status === 'active' ? 'inactive' : 'active')
      message.success('Status updated')
      fetchItems()
    } finally {
      actionRef.current = false
      setActionLoading(false)
    }
  }

  return (
    <div className="p-6">
      <SEO title="Blog Tags" noIndex />
      <div className="mb-4 flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Blog Tags</h1><p>Manage blog tag metadata</p></div>
        <Button type="primary" disabled={saving || actionLoading} onClick={() => openForm(null)}>Add tag</Button>
      </div>
      <Table rowKey="_id" loading={loading} dataSource={items} columns={[
        { title: 'Tag', dataIndex: 'name' },
        { title: 'Tag EN', render: (_, item) => item.translations?.en?.name || '-' },
        { title: 'Slug', dataIndex: 'slug' },
        { title: 'Số bài', dataIndex: 'postsCount', width: 90 },
        { title: 'Trạng thái', dataIndex: 'status', render: value => <Tag color={value === 'active' ? 'green' : 'default'}>{value === 'active' ? 'Active' : 'Inactive'}</Tag> },
        { title: 'Thao tác', width: 260, render: (_, item) => <Space><Button disabled={saving || actionLoading} onClick={() => openForm(item)}>Edit</Button><Button loading={actionLoading} disabled={saving || actionLoading} onClick={() => handleToggleStatus(item)}>{item.status === 'active' ? 'Disable' : 'Enable'}</Button><Button danger disabled={saving || actionLoading} onClick={() => handleDelete(item)}>Delete</Button></Space> }
      ]} />
      <Drawer title={editing ? 'Edit tag' : 'Add tag'} open={open} onClose={() => !saving && setOpen(false)} width={460}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} onFinishFailed={() => { savingRef.current = false; setSaving(false) }}>
          <Form.Item name="name" label="Tên tag" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="slug" label="Slug"><Input /></Form.Item>
          <Button className="mb-4" loading={translating} disabled={translating || saving} onClick={handleAutoTranslate}>Tự động dịch</Button>
          <Form.Item name={['translations', 'en', 'name']} label="Tên tag EN"><Input /></Form.Item>
          <Form.Item name={['translations', 'en', 'slug']} label="Slug EN"><Input /></Form.Item>
          <Form.Item name="status" label="Trạng thái"><Select options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} /></Form.Item>
          <Button type="primary" loading={saving} disabled={saving} onClick={handleSaveClick} block>Save</Button>
        </Form>
      </Drawer>
    </div>
  )
}
