import { Button, Card, DatePicker, Empty, Form, Input, InputNumber, Modal, Space, Spin, Switch, Tabs, Tag, message } from 'antd'
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ArrowLeft, Copy, Eye, GripVertical, Plus, Save, Send, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import SEO from '@/components/shared/SEO'
import { getCmsPage, publishCmsPage, saveCmsPageDraft, scheduleCmsPage } from '@/services/admin/content/cmsPage'
import './index.scss'

const LISTING_SECTION_TYPES = [
  { type: 'hero', label: 'Hero', defaults: { eyebrow: 'SmartMall Blog', title: 'SmartMall Blog', description: 'News, guides and updates', showSearch: true, showStats: true } },
  { type: 'featured_posts', label: 'Featured Posts', defaults: { title: 'Featured articles', limit: 4 } },
  { type: 'latest_articles', label: 'Latest Articles', defaults: { title: 'Latest Articles', hint: 'Fresh guides for smarter shopping', limit: 9, showLoadMore: true } },
  { type: 'category_tabs', label: 'Category Tabs', defaults: { label: 'Categories' } },
  { type: 'popular_posts', label: 'Popular Posts', defaults: { title: 'Popular Posts', hint: 'Trending now', limit: 4 } },
  { type: 'tag_cloud', label: 'Tag Cloud', defaults: { title: 'Tags', limit: 10 } },
  { type: 'cta', label: 'CTA', defaults: { eyebrow: 'Explore SmartMall', title: 'Ready to shop smarter?', description: 'Find products, deals and guides in one place.', primaryText: 'Shop now', primaryUrl: '/products', secondaryText: 'Flash sale', secondaryUrl: '/flash-sale' } }
]

const DETAIL_SECTION_TYPES = [
  { type: 'post_header', label: 'Post Header', defaults: { showShare: true } },
  { type: 'post_content', label: 'Post Content', defaults: {} },
  { type: 'table_of_contents', label: 'Table of Contents', defaults: { title: 'Table of contents' } },
  { type: 'author_box', label: 'Author Box', defaults: { title: 'Author' } },
  { type: 'related_products', label: 'Related Products', defaults: { title: 'Related products', limit: 3 } },
  { type: 'related_posts', label: 'Related Posts', defaults: { title: 'Related posts', limit: 3 } },
  { type: 'tags', label: 'Tags', defaults: { title: 'Tags' } },
  { type: 'cta', label: 'CTA', defaults: { title: 'Ready to shop smarter?', description: 'Find products, deals and guides in one place.', primaryText: 'Shop now', primaryUrl: '/products' } },
  { type: 'comments', label: 'Comments', defaults: { title: 'Comments' } }
]

const PAGE_CONFIGS = {
  blog: { key: 'blog', title: 'Blog Page Builder', description: 'Build /blog from fixed sections', previewUrl: '/blog', sectionTypes: LISTING_SECTION_TYPES, defaultMeta: { title: 'Blog', slug: 'blog', seo: { title: 'SmartMall Blog', description: 'Latest news and shopping guides', thumbnail: '' } } },
  detail: { key: 'blog-detail-template', title: 'Blog Detail Template', description: 'Build /blog/:slug layout', previewUrl: '/blog?preview=template', sectionTypes: DETAIL_SECTION_TYPES, defaultMeta: { title: 'Blog Detail Template', slug: 'blog-detail-template', seo: { title: 'Blog Detail', description: '', thumbnail: '' } } }
}

const buildDefaultSections = sectionTypes => sectionTypes.filter(item => item.type !== 'category_tabs').map((item, index) => ({ id: `${item.type}_default_${index}`, type: item.type, enabled: true, settings: item.defaults }))

const getSectionMeta = (type, sectionTypes = LISTING_SECTION_TYPES) => sectionTypes.find(item => item.type === type) || sectionTypes[0]
const uid = type => `${type}_${Date.now()}_${Math.random().toString(16).slice(2)}`

export default function BlogPageBuilder({ mode = 'blog' }) {
  const navigate = useNavigate()
  const config = PAGE_CONFIGS[mode] || PAGE_CONFIGS.blog
  const defaultSections = useMemo(() => buildDefaultSections(config.sectionTypes), [config.sectionTypes] )
  const [form] = Form.useForm()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [sections, setSections] = useState(defaultSections)
  const [selectedId, setSelectedId] = useState(defaultSections[0]?.id)
  const [pageMeta, setPageMeta] = useState(config.defaultMeta)

  const selectedSection = useMemo(() => sections.find(section => section.id === selectedId), [sections, selectedId])

  useEffect(() => {
    let mounted = true

    const fetchPage = async () => {
      try {
        const response = await getCmsPage(config.key)
        const page = response?.data || {}
        const nextSections = Array.isArray(page.draftSections) && page.draftSections.length ? page.draftSections : defaultSections
        if (!mounted) return
        setSections(nextSections)
        setSelectedId(nextSections[0]?.id)
        setPageMeta({ title: page.title || config.defaultMeta.title, slug: page.slug || config.defaultMeta.slug, seo: page.seo || config.defaultMeta.seo, scheduledAt: page.scheduledAt, scheduleStatus: page.scheduleStatus })
      } catch {
        message.error('Failed to load page builder')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchPage()
    return () => { mounted = false }
  }, [config, defaultSections])

  useEffect(() => {
    form.setFieldsValue({
      enabled: selectedSection?.enabled ?? true,
      ...(selectedSection?.settings || {})
    })
  }, [form, selectedSection])

  const updateSelectedSection = values => {
    if (!selectedSection) return
    setSections(current => current.map(section => (
      section.id === selectedSection.id
        ? { ...section, enabled: values.enabled !== false, settings: { ...section.settings, ...values, enabled: undefined } }
        : section
    )))
  }

  const addSection = meta => {
    const section = { id: uid(meta.type), type: meta.type, enabled: true, settings: meta.defaults }
    setSections(current => [...current, section])
    setSelectedId(section.id)
  }

  const duplicateSection = section => {
    const copy = { ...section, id: uid(section.type), settings: { ...section.settings } }
    setSections(current => {
      const index = current.findIndex(item => item.id === section.id)
      return [...current.slice(0, index + 1), copy, ...current.slice(index + 1)]
    })
    setSelectedId(copy.id)
  }

  const deleteSection = section => {
    setSections(current => {
      const next = current.filter(item => item.id !== section.id)
      setSelectedId(next[0]?.id)
      return next
    })
  }

  const handleDragEnd = event => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setSections(current => arrayMove(current, current.findIndex(item => item.id === active.id), current.findIndex(item => item.id === over.id)))
  }

  const buildPayload = () => ({
    ...pageMeta,
    sections: sections.map(section => ({
      id: section.id,
      type: section.type,
      enabled: section.enabled !== false,
      settings: section.settings || {}
    }))
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveCmsPageDraft(config.key, buildPayload())
      message.success('Draft saved')
    } catch (error) {
      message.error(error?.response?.message || error?.response?.error || 'Failed to save draft')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    setPublishing(true)
    try {
      await publishCmsPage(config.key, buildPayload())
      message.success('Published')
    } catch (error) {
      message.error(error?.response?.message || error?.response?.error || 'Failed to publish')
    } finally {
      setPublishing(false)
    }
  }

  const handleSchedule = () => {
    let value = null
    Modal.confirm({
      title: 'Schedule publish',
      content: <DatePicker showTime className="w-full" onChange={date => { value = date }} />,
      onOk: async () => {
        if (!value) return Promise.reject(new Error('Pick date'))
        await scheduleCmsPage(config.key, { ...buildPayload(), scheduledAt: value.toISOString() })
        message.success('Scheduled')
      }
    })
  }

  return (
    <div className="admin-page-builder">
      <SEO title={config.title} noIndex />
      <div className="admin-page-builder__topbar">
        <Button icon={<ArrowLeft size={16} />} onClick={() => navigate('/admin/blog')}>Back</Button>
        <div>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>
        <Space>
          <Button icon={<Eye size={16} />} onClick={() => window.open(config.previewUrl, '_blank', 'noopener,noreferrer')}>Preview</Button>
          <Button icon={<Save size={16} />} loading={saving} onClick={handleSave}>Save draft</Button>
          <Button onClick={handleSchedule}>Schedule</Button>
          <Button type="primary" icon={<Send size={16} />} loading={publishing} onClick={handlePublish}>Publish</Button>
        </Space>
      </div>

      {loading ? <div className="admin-page-builder__loading"><Spin /></div> : (
        <div className="admin-page-builder__grid">
          <aside className="admin-page-builder__panel">
            <Tabs items={[{
              key: 'blocks',
              label: 'Blocks',
              children: <div className="admin-page-builder__blocks">{config.sectionTypes.map(meta => <Button key={meta.type} block icon={<Plus size={15} />} onClick={() => addSection(meta)}>{meta.label}</Button>)}</div>
            }, {
              key: 'page',
              label: 'Page',
              children: <PageSettings value={pageMeta} onChange={setPageMeta} />
            }]} />
          </aside>

          <main className="admin-page-builder__canvas">
            {sections.length ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sections.map(section => section.id)} strategy={verticalListSortingStrategy}>
                  {sections.map(section => (
                    <SectionCard
                      key={section.id}
                      section={section}
                      selected={section.id === selectedId}
                      onSelect={() => setSelectedId(section.id)}
                      onDuplicate={() => duplicateSection(section)}
                      onDelete={() => deleteSection(section)}
                      sectionTypes={config.sectionTypes}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : <Empty description="No sections" />}
          </main>

          <aside className="admin-page-builder__panel admin-page-builder__panel--right">
            <Tabs items={[{
              key: 'settings',
              label: 'Settings',
              children: selectedSection ? <SectionSettings form={form} section={selectedSection} onChange={updateSelectedSection} /> : <Empty description="Select a section" />
            }, {
              key: 'navigator',
              label: 'Navigator',
              children: <div className="admin-page-builder__navigator">{sections.map(section => <Button key={section.id} block type={section.id === selectedId ? 'primary' : 'default'} onClick={() => setSelectedId(section.id)}>{getSectionMeta(section.type, config.sectionTypes).label}</Button>)}</div>
            }]} />
          </aside>
        </div>
      )}
    </div>
  )
}

function SectionCard({ section, selected, onSelect, onDuplicate, onDelete, sectionTypes }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id })
  const meta = getSectionMeta(section.type, sectionTypes)
  const title = section.settings?.title || section.settings?.eyebrow || meta.label

  return (
    <Card ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`admin-page-builder__section${selected ? ' is-selected' : ''}${section.enabled === false ? ' is-disabled' : ''}`} onClick={onSelect}>
      <div className="admin-page-builder__section-head">
        <button type="button" className="admin-page-builder__drag" {...attributes} {...listeners}><GripVertical size={16} /></button>
        <div>
          <Tag>{meta.label}</Tag>
          <h3>{title}</h3>
        </div>
        <Space>
          <Button size="small" icon={<Copy size={14} />} onClick={event => { event.stopPropagation(); onDuplicate() }} />
          <Button danger size="small" icon={<Trash2 size={14} />} onClick={event => { event.stopPropagation(); onDelete() }} />
        </Space>
      </div>
      <SectionPreview section={section} />
    </Card>
  )
}

function SectionPreview({ section }) {
  const settings = section.settings || {}
  if (section.type === 'hero') return <div className="admin-page-builder__hero"><span>{settings.eyebrow}</span><strong>{settings.title}</strong><p>{settings.description}</p></div>
  if (section.type === 'cta') return <div className="admin-page-builder__cta"><strong>{settings.title}</strong><p>{settings.description}</p><Space><Button>{settings.primaryText}</Button><Button>{settings.secondaryText}</Button></Space></div>
  return <div className="admin-page-builder__mock-grid"><span /><span /><span /><span /></div>
}

function PageSettings({ value, onChange }) {
  return (
    <Form layout="vertical" initialValues={value} onValuesChange={(_, values) => onChange(values)}>
      <Form.Item name="title" label="Title"><Input /></Form.Item>
      <Form.Item name="slug" label="Slug"><Input /></Form.Item>
      <Form.Item name={['seo', 'title']} label="SEO title"><Input /></Form.Item>
      <Form.Item name={['seo', 'description']} label="SEO description"><Input.TextArea rows={3} /></Form.Item>
      <Form.Item name={['seo', 'thumbnail']} label="Thumbnail URL"><Input /></Form.Item>
    </Form>
  )
}

function SectionSettings({ form, section, onChange }) {
  return (
    <Form form={form} layout="vertical" onValuesChange={(_, values) => onChange(values)}>
      <Form.Item name="enabled" label="Enabled" valuePropName="checked"><Switch /></Form.Item>
      {section.type === 'hero' ? <HeroFields /> : null}
      {['featured_posts', 'popular_posts', 'tag_cloud'].includes(section.type) ? <ListFields showHint={section.type === 'popular_posts'} /> : null}
      {section.type === 'latest_articles' ? <LatestFields /> : null}
      {section.type === 'category_tabs' ? <Form.Item name="label" label="Label"><Input /></Form.Item> : null}
      {section.type === 'cta' ? <CtaFields /> : null}
      {['post_header', 'post_content', 'table_of_contents', 'author_box', 'related_products', 'related_posts', 'tags', 'comments'].includes(section.type) ? <DetailFields section={section} /> : null}
    </Form>
  )
}

function HeroFields() {
  return <><Form.Item name="eyebrow" label="Eyebrow"><Input /></Form.Item><Form.Item name="title" label="Title"><Input /></Form.Item><Form.Item name="description" label="Description"><Input.TextArea rows={3} /></Form.Item><Form.Item name="showSearch" label="Show search" valuePropName="checked"><Switch /></Form.Item><Form.Item name="showStats" label="Show stats" valuePropName="checked"><Switch /></Form.Item></>
}

function ListFields({ showHint = false }) {
  return <><Form.Item name="title" label="Title"><Input /></Form.Item>{showHint ? <Form.Item name="hint" label="Hint"><Input /></Form.Item> : null}<Form.Item name="limit" label="Limit"><InputNumber min={1} max={24} className="w-full" /></Form.Item></>
}

function LatestFields() {
  return <><Form.Item name="title" label="Title"><Input /></Form.Item><Form.Item name="hint" label="Hint"><Input /></Form.Item><Form.Item name="limit" label="Initial limit"><InputNumber min={1} max={24} className="w-full" /></Form.Item><Form.Item name="showLoadMore" label="Show load more" valuePropName="checked"><Switch /></Form.Item></>
}

function CtaFields() {
  return <><Form.Item name="eyebrow" label="Eyebrow"><Input /></Form.Item><Form.Item name="title" label="Title"><Input /></Form.Item><Form.Item name="description" label="Description"><Input.TextArea rows={3} /></Form.Item><Form.Item name="primaryText" label="Primary text"><Input /></Form.Item><Form.Item name="primaryUrl" label="Primary URL"><Input /></Form.Item><Form.Item name="secondaryText" label="Secondary text"><Input /></Form.Item><Form.Item name="secondaryUrl" label="Secondary URL"><Input /></Form.Item></>
}

function DetailFields({ section }) {
  return <>{['table_of_contents', 'author_box', 'related_products', 'related_posts', 'tags', 'comments'].includes(section.type) ? <Form.Item name="title" label="Title"><Input /></Form.Item> : null}{['related_products', 'related_posts'].includes(section.type) ? <Form.Item name="limit" label="Limit"><InputNumber min={1} max={12} className="w-full" /></Form.Item> : null}{section.type === 'post_header' ? <Form.Item name="showShare" label="Show share" valuePropName="checked"><Switch /></Form.Item> : null}</>
}
