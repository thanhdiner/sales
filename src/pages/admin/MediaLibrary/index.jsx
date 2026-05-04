import { Button, Card, Form, Image, Input, Modal, Space, Tag, message } from 'antd'
import { useEffect, useState } from 'react'

import SEO from '@/components/shared/SEO'
import { deleteMediaAsset, getMediaAssets, updateMediaAsset } from '@/services/admin/content/mediaLibrary'

export default function MediaLibrary() {
  const [form] = Form.useForm()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)

  const fetchItems = async () => {
    setLoading(true)
    try {
      const response = await getMediaAssets()
      setItems(Array.isArray(response?.data) ? response.data : [])
    } catch {
      message.error('Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  const editAsset = item => {
    setEditing(item)
    form.setFieldsValue({ alt: item.alt, tags: (item.tags || []).join(', ') })
  }

  const saveAsset = async values => {
    await updateMediaAsset(editing._id, values)
    message.success('Saved')
    setEditing(null)
    fetchItems()
  }

  const removeAsset = item => Modal.confirm({
    title: 'Delete media asset?',
    okType: 'danger',
    onOk: async () => {
      await deleteMediaAsset(item._id)
      message.success('Deleted')
      fetchItems()
    }
  })

  return (
    <div className="p-6">
      <SEO title="Media Library" noIndex />
      <div className="mb-4"><h1 className="text-2xl font-bold">Media Library</h1><p>Uploaded blog/CMS media</p></div>
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {items.map(item => (
          <Card key={item._id} loading={loading} cover={item.resourceType === 'image' ? <Image src={item.url} height={160} className="object-cover" /> : null}>
            <Space direction="vertical" className="w-full">
              <Tag>{item.resourceType}</Tag>
              <Input value={item.url} readOnly onFocus={event => event.target.select()} />
              <Space><Button onClick={() => navigator.clipboard?.writeText(item.url)}>Copy</Button><Button onClick={() => editAsset(item)}>Edit</Button><Button danger onClick={() => removeAsset(item)}>Delete</Button></Space>
            </Space>
          </Card>
        ))}
      </div>
      <Modal title="Edit media" open={!!editing} onCancel={() => setEditing(null)} footer={null}>
        <Form form={form} layout="vertical" onFinish={saveAsset}>
          <Form.Item name="alt" label="Alt"><Input /></Form.Item>
          <Form.Item name="tags" label="Tags"><Input /></Form.Item>
          <Button type="primary" htmlType="submit">Save</Button>
        </Form>
      </Modal>
    </div>
  )
}
