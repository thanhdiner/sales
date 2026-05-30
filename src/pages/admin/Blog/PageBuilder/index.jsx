import { Alert, Badge, Button, Card, DatePicker, Drawer, Empty, Form, Grid, Input, InputNumber, Modal, Select, Space, Spin, Switch, Tabs, Tag, Tooltip, message } from 'antd'
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ArrowLeft, Copy, Eye, ExternalLink, GripVertical, Plus, Save, Send, Settings, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import SEO from '@/components/shared/SEO'
import { getCmsPage, publishCmsPage, saveCmsPageDraft, scheduleCmsPage } from '@/services/admin/content/cmsPage'
import './index.scss'

const LISTING_SECTION_TYPES = [
  {
    type: 'hero',
    label: 'Hero',
    defaults: {
      eyebrow: 'SmartMall Blog',
      title: 'SmartMall Blog',
      description: 'News, guides and updates',
      showSearch: true,
      showStats: true
    }
  },
  { type: 'featured_posts', label: 'Featured Posts', defaults: { title: 'Featured articles', limit: 4 } },
  {
    type: 'latest_articles',
    label: 'Latest Articles',
    defaults: { title: 'Latest Articles', hint: 'Fresh guides for smarter shopping', limit: 9, showLoadMore: true }
  },
  { type: 'category_tabs', label: 'Category Tabs', defaults: { label: 'Categories' } },
  { type: 'popular_posts', label: 'Popular Posts', defaults: { title: 'Popular Posts', hint: 'Trending now', limit: 4 } },
  { type: 'tag_cloud', label: 'Tag Cloud', defaults: { title: 'Tags', limit: 10 } },
  {
    type: 'cta',
    label: 'CTA',
    defaults: {
      eyebrow: 'Explore SmartMall',
      title: 'Ready to shop smarter?',
      description: 'Find products, deals and guides in one place.',
      primaryText: 'Shop now',
      primaryUrl: '/products',
      secondaryText: 'Flash sale',
      secondaryUrl: '/flash-sale'
    }
  }
]

const DETAIL_SECTION_TYPES = [
  {
    type: 'post_header',
    label: 'Post Header',
    required: true,
    defaults: {
      showShare: true,
      showCategory: true,
      showAuthor: true,
      showDate: true,
      showReadingTime: true,
      showThumbnail: true,
      layout: 'standard',
      alignment: 'left'
    }
  },
  { type: 'post_content', label: 'Post Content', required: true, defaults: { typography: 'comfortable', showDropCap: false, showNewsletter: false } },
  { type: 'table_of_contents', label: 'Table of Contents', defaults: { title: 'Table of contents', sticky: true, collapsible: true } },
  { type: 'author_box', label: 'Author Box', defaults: { title: 'Author', showAvatar: true, showBio: true, showSocial: true } },
  { type: 'related_products', label: 'Related Products', defaults: { title: 'Related products', limit: 3, layout: 'grid', showPrice: true } },
  { type: 'related_posts', label: 'Related Posts', defaults: { title: 'Related posts', limit: 3, layout: 'cards', showExcerpt: true } },
  { type: 'tags', label: 'Tags', defaults: { title: 'Tags', style: 'pills' } },
  {
    type: 'cta',
    label: 'CTA',
    defaults: {
      title: 'Ready to shop smarter?',
      description: 'Find products, deals and guides in one place.',
      primaryText: 'Shop now',
      primaryUrl: '/products',
      secondaryText: '',
      secondaryUrl: ''
    }
  },
  { type: 'comments', label: 'Comments', defaults: { title: 'Comments', allowComments: true, moderationNotice: true } }
]

const PAGE_CONFIGS = {
  blog: {
    key: 'blog',
    title: 'Blog Page Builder',
    description: 'Build /blog from fixed sections',
    previewUrl: '/blog',
    sectionTypes: LISTING_SECTION_TYPES,
    defaultMeta: {
      title: 'Blog',
      slug: 'blog',
      seo: { title: 'SmartMall Blog', description: 'Latest news and shopping guides', thumbnail: '' }
    }
  },
  detail: {
    key: 'blog-detail-template',
    title: 'Blog Detail Template',
    description: 'Build /blog/:slug layout',
    previewUrl: '/blog?preview=template',
    sectionTypes: DETAIL_SECTION_TYPES,
    defaultMeta: {
      title: 'Blog Detail Template',
      slug: 'blog-detail-template',
      seo: { title: 'Blog Detail', description: '', thumbnail: '' }
    }
  }
}

const REQUIRED_DETAIL_SECTION_TYPES = DETAIL_SECTION_TYPES.filter(item => item.required).map(item => item.type)
const MAX_SECTIONS = 20

const buildDefaultSections = sectionTypes =>
  sectionTypes
    .filter(item => item.type !== 'category_tabs')
    .map((item, index) => ({ id: `${item.type}_default_${index}`, type: item.type, enabled: true, settings: { ...item.defaults } }))

const getSectionMeta = (type, sectionTypes = LISTING_SECTION_TYPES) => sectionTypes.find(item => item.type === type) || sectionTypes[0]
const uid = type => `${type}_${Date.now()}_${Math.random().toString(16).slice(2)}`
const hydrateSections = (sections = [], sectionTypes = LISTING_SECTION_TYPES) => sections.map(section => {
  const meta = getSectionMeta(section.type, sectionTypes)
  return {
    ...section,
    enabled: section.enabled !== false,
    settings: { ...(meta?.defaults || {}), ...(section.settings || {}) }
  }
})
const normalizeBuilderState = ({ pageMeta, sections }) => JSON.stringify({
  pageMeta: pageMeta || {},
  sections: (sections || []).map(section => ({
    id: section.id,
    type: section.type,
    enabled: section.enabled !== false,
    settings: section.settings || {}
  }))
})

export default function BlogPageBuilder({ mode = 'blog' }) {
  const navigate = useNavigate()
  const screens = Grid.useBreakpoint()
  const config = PAGE_CONFIGS[mode] || PAGE_CONFIGS.blog
  const defaultSections = useMemo(() => buildDefaultSections(config.sectionTypes), [config.sectionTypes])
  const [form] = Form.useForm()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [scheduling, setScheduling] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [scheduleDate, setScheduleDate] = useState(null)
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false)
  const [sections, setSections] = useState(defaultSections)
  const [selectedId, setSelectedId] = useState(defaultSections[0]?.id)
  const [pageMeta, setPageMeta] = useState(config.defaultMeta)
  const [savedSnapshot, setSavedSnapshot] = useState('')

  const selectedSection = useMemo(() => sections.find(section => section.id === selectedId), [sections, selectedId])
  const isCompactSettings = !screens.xl
  const currentSnapshot = useMemo(() => normalizeBuilderState({ pageMeta, sections }), [pageMeta, sections])
  const isDirty = Boolean(savedSnapshot && currentSnapshot !== savedSnapshot)
  const busy = saving || publishing || scheduling
  const missingRequiredTypes = useMemo(() => {
    if (mode !== 'detail') return []
    return REQUIRED_DETAIL_SECTION_TYPES.filter(type => !sections.some(section => section.type === type))
  }, [mode, sections])
  const hasValidationIssues = missingRequiredTypes.length > 0
  const canSave = !loading && !busy && isDirty && !hasValidationIssues
  const canPublish = canSave && !hasValidationIssues
  const canSchedule = !loading && !busy && !hasValidationIssues

  useEffect(() => {
    let mounted = true

    const fetchPage = async () => {
      try {
        const response = await getCmsPage(config.key)
        const page = response?.data || {}
        const sourceSections = Array.isArray(page.draftSections) && page.draftSections.length ? page.draftSections : defaultSections
        const nextSections = hydrateSections(sourceSections, config.sectionTypes)
        const nextMeta = {
          title: page.title || config.defaultMeta.title,
          slug: page.slug || config.defaultMeta.slug,
          seo: page.seo || config.defaultMeta.seo,
          scheduledAt: page.scheduledAt,
          scheduleStatus: page.scheduleStatus
        }
        if (!mounted) return
        setSections(nextSections)
        setSelectedId(nextSections[0]?.id)
        setPageMeta(nextMeta)
        setSavedSnapshot(normalizeBuilderState({ pageMeta: nextMeta, sections: nextSections }))
      } catch {
        message.error('Failed to load page builder')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchPage()
    return () => {
      mounted = false
    }
  }, [config, defaultSections])

  useEffect(() => {
    const handleBeforeUnload = event => {
      if (!isDirty) return
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  useEffect(() => {
    form.setFieldsValue({
      enabled: selectedSection?.enabled ?? true,
      ...(selectedSection?.settings || {})
    })
  }, [form, selectedSection])

  const updateSelectedSection = values => {
    if (!selectedSection) return
    setSections(current =>
      current.map(section =>
        section.id === selectedSection.id
          ? { ...section, enabled: values.enabled !== false, settings: { ...section.settings, ...values, enabled: undefined } }
          : section
      )
    )
  }

  const addSection = meta => {
    if (sections.length >= MAX_SECTIONS) {
      message.warning(`Template cannot exceed ${MAX_SECTIONS} blocks`)
      return
    }
    if (meta.required && sections.some(section => section.type === meta.type)) {
      message.warning(`${meta.label} already exists`)
      return
    }

    const section = { id: uid(meta.type), type: meta.type, enabled: true, settings: { ...meta.defaults } }
    setSections(current => [...current, section])
    setSelectedId(section.id)
    if (isCompactSettings) setSettingsDrawerOpen(true)
  }

  const duplicateSection = section => {
    const meta = getSectionMeta(section.type, config.sectionTypes)
    if (meta.required) {
      message.warning(`${meta.label} is a single required block`)
      return
    }
    if (sections.length >= MAX_SECTIONS) {
      message.warning(`Template cannot exceed ${MAX_SECTIONS} blocks`)
      return
    }

    const copy = { ...section, id: uid(section.type), settings: { ...section.settings } }
    setSections(current => {
      const index = current.findIndex(item => item.id === section.id)
      return [...current.slice(0, index + 1), copy, ...current.slice(index + 1)]
    })
    setSelectedId(copy.id)
  }

  const deleteSection = section => {
    const meta = getSectionMeta(section.type, config.sectionTypes)
    if (meta.required) {
      message.warning(`${meta.label} is required`)
      return
    }

    setSections(current => {
      const next = current.filter(item => item.id !== section.id)
      setSelectedId(next[0]?.id)
      return next
    })
  }

  const handleDragEnd = event => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setSections(current =>
      arrayMove(
        current,
        current.findIndex(item => item.id === active.id),
        current.findIndex(item => item.id === over.id)
      )
    )
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

  const handleBack = () => {
    if (!isDirty) {
      navigate('/admin/blog')
      return
    }

    Modal.confirm({
      title: 'Discard unsaved changes?',
      content: 'You have changes that have not been saved yet.',
      okText: 'Discard',
      okButtonProps: { danger: true },
      cancelText: 'Stay',
      onOk: () => navigate('/admin/blog')
    })
  }

  const scrollToSection = useCallback(sectionId => {
    setSelectedId(sectionId)
    document.getElementById(`builder-section-${sectionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  const handleSave = async () => {
    if (!canSave) return
    setSaving(true)
    try {
      await saveCmsPageDraft(config.key, buildPayload())
      setSavedSnapshot(currentSnapshot)
      message.success('Draft saved')
    } catch (error) {
      message.error(error?.response?.message || error?.response?.error || 'Failed to save draft')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!canPublish) return
    setPublishing(true)
    try {
      await publishCmsPage(config.key, buildPayload())
      setSavedSnapshot(currentSnapshot)
      message.success('Published')
    } catch (error) {
      message.error(error?.response?.message || error?.response?.error || 'Failed to publish')
    } finally {
      setPublishing(false)
    }
  }

  const handleSchedule = () => {
    if (!canSchedule) return
    setScheduleOpen(true)
  }

  const handleScheduleSubmit = async () => {
    if (!scheduleDate) {
      message.warning('Pick a publish date')
      return
    }

    setScheduling(true)
    try {
      const nextPayload = { ...buildPayload(), scheduledAt: scheduleDate.toISOString(), scheduleStatus: 'scheduled' }
      await scheduleCmsPage(config.key, nextPayload)
      const nextMeta = { ...pageMeta, scheduledAt: nextPayload.scheduledAt, scheduleStatus: 'scheduled' }
      setPageMeta(nextMeta)
      setSavedSnapshot(normalizeBuilderState({ pageMeta: nextMeta, sections }))
      setScheduleOpen(false)
      message.success('Scheduled')
    } catch (error) {
      message.error(error?.response?.message || error?.response?.error || 'Failed to schedule')
    } finally {
      setScheduling(false)
    }
  }

  const settingsContent = selectedSection ? (
    <SectionSettings form={form} section={selectedSection} onChange={updateSelectedSection} />
  ) : (
    <Empty description="Select a section" />
  )
  const navigatorContent = (
    <BuilderNavigator
      sections={sections}
      selectedId={selectedId}
      sectionTypes={config.sectionTypes}
      onSelect={scrollToSection}
      onDuplicate={duplicateSection}
      onDelete={deleteSection}
    />
  )
  const rightPanelTabs = [
    { key: 'settings', label: 'Settings', children: settingsContent },
    { key: 'navigator', label: 'Navigator', children: navigatorContent }
  ]
  const getAddDisabledReason = meta => {
    if (sections.length >= MAX_SECTIONS) return `Maximum ${MAX_SECTIONS} blocks reached`
    if (meta.required && sections.some(section => section.type === meta.type)) return 'Required block already exists'
    return ''
  }

  return (
    <div className="admin-page-builder">
      <SEO title={config.title} noIndex />
      <div className="admin-page-builder__topbar">
        <Button icon={<ArrowLeft size={16} />} onClick={handleBack}>Back</Button>
        <div>
          <div className="admin-page-builder__title-row">
            <h1>{config.title}</h1>
            {isDirty ? <Badge status="warning" text="Unsaved changes" /> : <Badge status="success" text="Saved" />}
          </div>
          <p>{config.description}</p>
        </div>
        <Space wrap>
          {isCompactSettings ? (
            <Button icon={<Settings size={16} />} onClick={() => setSettingsDrawerOpen(true)}>Settings</Button>
          ) : null}
          <Button icon={<Eye size={16} />} onClick={() => setPreviewOpen(true)}>Preview</Button>
          <Button icon={<Save size={16} />} loading={saving} disabled={!canSave} onClick={handleSave}>Save draft</Button>
          <Button disabled={!canSchedule} onClick={handleSchedule}>Schedule</Button>
          <Button type="primary" icon={<Send size={16} />} loading={publishing} disabled={!canPublish} onClick={handlePublish}>Publish</Button>
        </Space>
      </div>

      {hasValidationIssues ? (
        <Alert
          className="admin-page-builder__alert"
          type="warning"
          showIcon
          message="Required blocks are missing"
          description={`Add ${missingRequiredTypes.map(type => getSectionMeta(type, config.sectionTypes).label).join(', ')} before publishing or scheduling.`}
        />
      ) : null}

      {loading ? (
        <div className="admin-page-builder__loading"><Spin /></div>
      ) : (
        <div className="admin-page-builder__grid">
          <aside className="admin-page-builder__panel">
            <Tabs
              items={[
                {
                  key: 'blocks',
                  label: 'Blocks',
                  children: (
                    <div className="admin-page-builder__blocks">
                      {config.sectionTypes.map(meta => {
                        const disabledReason = getAddDisabledReason(meta)
                        const button = <Button key={meta.type} block disabled={Boolean(disabledReason)} icon={<Plus size={15} />} onClick={() => addSection(meta)}>{meta.label}</Button>
                        return disabledReason ? <Tooltip key={meta.type} title={disabledReason}>{button}</Tooltip> : button
                      })}
                    </div>
                  )
                },
                { key: 'page', label: 'Page', children: <PageSettings value={pageMeta} onChange={setPageMeta} /> }
              ]}
            />
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
                      onSelect={() => scrollToSection(section.id)}
                      onDuplicate={() => duplicateSection(section)}
                      onDelete={() => deleteSection(section)}
                      sectionTypes={config.sectionTypes}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              <Empty description="No sections" />
            )}
          </main>

          {!isCompactSettings ? (
            <aside className="admin-page-builder__panel admin-page-builder__panel--right">
              <Tabs items={rightPanelTabs} />
            </aside>
          ) : null}
        </div>
      )}

      <Drawer title="Template settings" open={isCompactSettings && settingsDrawerOpen} onClose={() => setSettingsDrawerOpen(false)} width={380}>
        <Tabs items={rightPanelTabs} />
      </Drawer>

      <Modal
        title="Template preview"
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        width={980}
        footer={[
          <Button key="external" icon={<ExternalLink size={16} />} onClick={() => window.open(config.previewUrl, '_blank', 'noopener,noreferrer')}>Open public preview</Button>,
          <Button key="close" type="primary" onClick={() => setPreviewOpen(false)}>Close</Button>
        ]}
      >
        <TemplatePreview pageMeta={pageMeta} sections={sections} sectionTypes={config.sectionTypes} />
      </Modal>

      <Modal
        title="Schedule publish"
        open={scheduleOpen}
        confirmLoading={scheduling}
        okButtonProps={{ disabled: !scheduleDate || hasValidationIssues }}
        okText="Schedule"
        onOk={handleScheduleSubmit}
        onCancel={() => setScheduleOpen(false)}
      >
        <DatePicker showTime className="w-full" value={scheduleDate} onChange={setScheduleDate} />
      </Modal>
    </div>
  )
}

function SectionCard({ section, selected, onSelect, onDuplicate, onDelete, sectionTypes }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id })
  const meta = getSectionMeta(section.type, sectionTypes)
  const title = section.settings?.title || section.settings?.eyebrow || meta.label

  return (
    <Card
      ref={setNodeRef}
      id={`builder-section-${section.id}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`admin-page-builder__section${selected ? ' is-selected' : ''}${section.enabled === false ? ' is-disabled' : ''}`}
      onClick={onSelect}
    >
      <div className="admin-page-builder__section-head">
        <button type="button" className="admin-page-builder__drag" {...attributes} {...listeners}><GripVertical size={16} /></button>
        <div>
          <Tag>{meta.label}{meta.required ? ' - Required' : ''}</Tag>
          <h3>{title}</h3>
        </div>
        <Space>
          <Tooltip title={meta.required ? 'Single required block' : 'Duplicate'}>
            <Button size="small" disabled={meta.required} icon={<Copy size={14} />} onClick={event => { event.stopPropagation(); onDuplicate() }} />
          </Tooltip>
          <Tooltip title={meta.required ? 'Required block' : 'Delete'}>
            <Button danger size="small" disabled={meta.required} icon={<Trash2 size={14} />} onClick={event => { event.stopPropagation(); onDelete() }} />
          </Tooltip>
        </Space>
      </div>
      <SectionPreview section={section} />
    </Card>
  )
}

function SectionPreview({ section }) {
  const settings = section.settings || {}
  if (section.type === 'hero') {
    return <div className="admin-page-builder__hero"><span>{settings.eyebrow}</span><strong>{settings.title}</strong><p>{settings.description}</p></div>
  }
  if (section.type === 'cta') {
    return <div className="admin-page-builder__cta"><strong>{settings.title}</strong><p>{settings.description}</p><Space><Button>{settings.primaryText}</Button>{settings.secondaryText ? <Button>{settings.secondaryText}</Button> : null}</Space></div>
  }
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
  return (
    <>
      {section.type === 'post_header' ? <PostHeaderFields /> : null}
      {section.type === 'post_content' ? <PostContentFields /> : null}
      {['table_of_contents', 'author_box', 'related_products', 'related_posts', 'tags', 'comments'].includes(section.type) ? <Form.Item name="title" label="Title"><Input /></Form.Item> : null}
      {section.type === 'table_of_contents' ? <><Form.Item name="sticky" label="Sticky" valuePropName="checked"><Switch /></Form.Item><Form.Item name="collapsible" label="Collapsible" valuePropName="checked"><Switch /></Form.Item></> : null}
      {section.type === 'author_box' ? <><Form.Item name="showAvatar" label="Show avatar" valuePropName="checked"><Switch /></Form.Item><Form.Item name="showBio" label="Show bio" valuePropName="checked"><Switch /></Form.Item><Form.Item name="showSocial" label="Show social" valuePropName="checked"><Switch /></Form.Item></> : null}
      {['related_products', 'related_posts'].includes(section.type) ? <Form.Item name="limit" label="Limit"><InputNumber min={1} max={12} className="w-full" /></Form.Item> : null}
      {section.type === 'related_products' ? <><Form.Item name="layout" label="Layout"><Select options={[{ value: 'grid', label: 'Grid' }, { value: 'carousel', label: 'Carousel' }]} /></Form.Item><Form.Item name="showPrice" label="Show price" valuePropName="checked"><Switch /></Form.Item></> : null}
      {section.type === 'related_posts' ? <><Form.Item name="layout" label="Layout"><Select options={[{ value: 'cards', label: 'Cards' }, { value: 'list', label: 'List' }]} /></Form.Item><Form.Item name="showExcerpt" label="Show excerpt" valuePropName="checked"><Switch /></Form.Item></> : null}
      {section.type === 'tags' ? <Form.Item name="style" label="Style"><Select options={[{ value: 'pills', label: 'Pills' }, { value: 'plain', label: 'Plain' }]} /></Form.Item> : null}
      {section.type === 'comments' ? <><Form.Item name="allowComments" label="Allow comments" valuePropName="checked"><Switch /></Form.Item><Form.Item name="moderationNotice" label="Moderation notice" valuePropName="checked"><Switch /></Form.Item></> : null}
    </>
  )
}

function PostHeaderFields() {
  const toggleFields = [
    ['showShare', 'Show share'],
    ['showCategory', 'Show category'],
    ['showAuthor', 'Show author'],
    ['showDate', 'Show date'],
    ['showReadingTime', 'Show reading time'],
    ['showThumbnail', 'Show thumbnail']
  ]

  return <><Form.Item name="layout" label="Layout"><Select options={[{ value: 'standard', label: 'Standard' }, { value: 'compact', label: 'Compact' }, { value: 'hero', label: 'Hero' }]} /></Form.Item><Form.Item name="alignment" label="Alignment"><Select options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }]} /></Form.Item>{toggleFields.map(([name, label]) => <Form.Item key={name} name={name} label={label} valuePropName="checked"><Switch /></Form.Item>)}</>
}

function PostContentFields() {
  return <><Form.Item name="typography" label="Typography"><Select options={[{ value: 'compact', label: 'Compact' }, { value: 'comfortable', label: 'Comfortable' }, { value: 'editorial', label: 'Editorial' }]} /></Form.Item><Form.Item name="showDropCap" label="Show drop cap" valuePropName="checked"><Switch /></Form.Item><Form.Item name="showNewsletter" label="Show newsletter signup" valuePropName="checked"><Switch /></Form.Item></>
}

function BuilderNavigator({ sections, selectedId, sectionTypes, onSelect, onDuplicate, onDelete }) {
  return (
    <div className="admin-page-builder__navigator">
      {sections.map(section => {
        const meta = getSectionMeta(section.type, sectionTypes)
        return (
          <button key={section.id} type="button" className={`admin-page-builder__navigator-item${section.id === selectedId ? ' is-selected' : ''}`} onClick={() => onSelect(section.id)}>
            <span><strong>{meta.label}</strong><small>{section.enabled === false ? 'Disabled' : 'Enabled'}{meta.required ? ' - Required' : ''}</small></span>
            <span className="admin-page-builder__navigator-actions">
              <Tooltip title={meta.required ? 'Single required block' : 'Duplicate'}><Copy size={14} className={meta.required ? 'is-disabled' : ''} onClick={event => { event.stopPropagation(); onDuplicate(section) }} /></Tooltip>
              <Tooltip title={meta.required ? 'Required block' : 'Delete'}><Trash2 size={14} className={meta.required ? 'is-disabled' : ''} onClick={event => { event.stopPropagation(); onDelete(section) }} /></Tooltip>
            </span>
          </button>
        )
      })}
    </div>
  )
}

function TemplatePreview({ pageMeta, sections, sectionTypes }) {
  const enabledSections = sections.filter(section => section.enabled !== false)
  return (
    <div className="admin-page-builder__preview">
      <header><span>{pageMeta.slug}</span><h2>{pageMeta.title}</h2></header>
      {enabledSections.map(section => <section key={section.id}><Tag>{getSectionMeta(section.type, sectionTypes).label}</Tag><SectionPreview section={section} /></section>)}
    </div>
  )
}
