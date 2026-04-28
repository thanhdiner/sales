import { useCallback, useEffect, useMemo, useState } from 'react'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Empty, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Tooltip, message } from 'antd'
import { CheckCircle2, ClipboardList, FolderTree, MessageSquareText } from 'lucide-react'
import {
  AdminCard,
  AdminFormSection,
  AdminPageShell,
  AdminStatCard,
  AdminStatGrid,
  AdminStatusPill,
  AdminTableShell
} from '@/components/admin/ui'
import { useModalBodyScroll } from '@/hooks/useModalBodyScroll'
import {
  createQuickReplyCategory,
  createQuickReply,
  deleteQuickReplyCategory,
  deleteQuickReply,
  getQuickReplyCategories,
  getQuickReplies,
  setQuickReplyStatus,
  updateQuickReplyCategory,
  updateQuickReply
} from '@/services/adminQuickRepliesService'
import './AdminQuickRepliesPage.scss'

const DEFAULT_PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 300
const VARIABLE_OPTIONS = ['customerName', 'orderCode', 'productName', 'agentName', 'storeName']

const DEFAULT_CATEGORY_OPTIONS = [
  { value: 'greeting', label: 'Greeting' },
  { value: 'info', label: 'Information' },
  { value: 'order', label: 'Order support' },
  { value: 'payment', label: 'Payment' },
  { value: 'shipping', label: 'Shipping' },
  { value: 'warranty', label: 'Warranty' },
  { value: 'product', label: 'Product' },
  { value: 'closing', label: 'Closing' },
  { value: 'other', label: 'Other' }
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]

const LANGUAGE_OPTIONS = [
  { value: 'all', label: 'All languages' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'en', label: 'English' }
]

const FORM_INITIAL_VALUES = {
  title: '',
  category: '',
  shortcut: '/',
  content: '',
  variables: [],
  language: 'vi',
  isActive: true
}

const CATEGORY_FORM_INITIAL_VALUES = {
  name: '',
  slug: '',
  color: '#5e6ad2',
  sortOrder: 0,
  isActive: true
}

function getCategoryMeta(value, categories = []) {
  return categories.find(option => option.value === value) || {
    value,
    label: value || 'Other',
    color: '#64748b',
    isActive: true
  }
}

function slugifyCategoryName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function formatDateTime(value) {
  if (!value) return '-'

  try {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value))
  } catch {
    return '-'
  }
}

function normalizeFormValues(values) {
  return {
    title: values.title?.trim(),
    category: values.category,
    shortcut: values.shortcut?.trim(),
    content: values.content?.trim(),
    variables: values.variables || [],
    language: values.language || 'vi',
    isActive: values.isActive !== false
  }
}

function getRequestErrorMessage(error, fallback) {
  return error?.response?.error || error?.response?.message || error?.message || fallback
}

function QuickRepliesHeader({ onCreate, onManageCategories }) {
  return (
    <AdminCard
      className="admin-quick-replies-header"
      title="Quick replies"
      titleLevel={1}
      description="Manage reusable message templates for live chat agents."
      extra={(
        <div className="admin-quick-replies-header__actions">
          <Button
            icon={<FolderTree className="h-4 w-4" strokeWidth={1.8} />}
            onClick={onManageCategories}
            className="admin-quick-replies-secondary-btn"
          >
            Manage categories
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreate}
            className="admin-quick-replies-primary-btn"
          >
            Create reply
          </Button>
        </div>
      )}
    />
  )
}

function QuickRepliesStats({ stats }) {
  const items = [
    {
      key: 'total',
      label: 'Total templates',
      value: stats.total,
      Icon: ClipboardList
    },
    {
      key: 'active',
      label: 'Active',
      value: stats.active,
      Icon: CheckCircle2
    },
    {
      key: 'categories',
      label: 'Categories',
      value: stats.categories,
      Icon: FolderTree
    },
    {
      key: 'usedThisMonth',
      label: 'Used this month',
      value: stats.usedThisMonth,
      Icon: MessageSquareText
    }
  ]

  return (
    <AdminStatGrid columns={4} className="admin-quick-replies-stats">
      {items.map(({ key, label, value, Icon }) => (
        <AdminStatCard
          key={key}
          className={`admin-quick-replies-stat admin-quick-replies-stat--${key}`}
          label={label}
          value={value || 0}
          icon={Icon}
          tone={key === 'active' ? 'success' : key === 'categories' ? 'info' : key === 'usedThisMonth' ? 'warning' : 'default'}
        />
      ))}
    </AdminStatGrid>
  )
}

function QuickRepliesFilters({ categoryOptions, filters, onFilterChange }) {
  return (
    <AdminCard className="admin-quick-replies-filters" bodyClassName="admin-quick-replies-filters__body">
      <Input.Search
        allowClear
        value={filters.search}
        onChange={event => onFilterChange({ search: event.target.value })}
        placeholder="Search by title or content"
        className="admin-quick-replies-search"
      />

      <Select
        value={filters.category || 'all'}
        onChange={value => onFilterChange({ category: value === 'all' ? '' : value })}
        options={[{ value: 'all', label: 'All categories' }, ...categoryOptions.filter(option => option.isActive !== false)]}
        className="admin-quick-replies-filter-select"
      />

      <Select
        value={filters.status}
        onChange={value => onFilterChange({ status: value })}
        options={STATUS_OPTIONS}
        className="admin-quick-replies-filter-select"
      />

      <Select
        value={filters.language}
        onChange={value => onFilterChange({ language: value })}
        options={LANGUAGE_OPTIONS}
        className="admin-quick-replies-filter-select"
      />
    </AdminCard>
  )
}

function StatusPill({ active }) {
  return (
    <AdminStatusPill
      dot={false}
      tone={active ? 'success' : 'neutral'}
      className={`admin-quick-replies-status ${active ? 'admin-quick-replies-status--active' : 'admin-quick-replies-status--inactive'}`}
    >
      {active ? 'Active' : 'Inactive'}
    </AdminStatusPill>
  )
}

function QuickRepliesTable({
  categoryOptions,
  data,
  loading,
  pagination,
  onChangePagination,
  onEdit,
  onDelete,
  onToggleStatus
}) {
  const columns = [
    {
      title: 'Template name',
      dataIndex: 'title',
      key: 'title',
      width: 190,
      render: (_, record) => (
        <div className="admin-quick-replies-template-cell">
          <span className="admin-quick-replies-template-title">{record.title}</span>
          <span className="admin-quick-replies-template-lang">{record.language?.toUpperCase() || 'VI'}</span>
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 135,
      render: value => {
        const category = getCategoryMeta(value, categoryOptions)

        return (
          <Tag className="admin-quick-replies-category-tag">
            <span className="admin-quick-replies-category-dot" style={{ backgroundColor: category.color }} />
            <span>{category.label}</span>
            {category.isActive === false && <span className="admin-quick-replies-category-inactive">Inactive</span>}
          </Tag>
        )
      }
    },
    {
      title: 'Shortcut',
      dataIndex: 'shortcut',
      key: 'shortcut',
      width: 130,
      render: value => <span className="admin-quick-replies-shortcut">{value}</span>
    },
    {
      title: 'Content preview',
      dataIndex: 'content',
      key: 'content',
      render: value => (
        <Tooltip title={value}>
          <span className="admin-quick-replies-preview">{value}</span>
        </Tooltip>
      )
    },
    {
      title: 'Usage count',
      dataIndex: 'usageCount',
      key: 'usageCount',
      width: 120,
      render: value => <span className="admin-quick-replies-number">{value || 0}</span>
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 130,
      render: (_, record) => (
        <Space size="small">
          <Switch
            size="small"
            checked={record.isActive}
            onChange={checked => onToggleStatus(record, checked)}
          />
          <StatusPill active={record.isActive} />
        </Space>
      )
    },
    {
      title: 'Updated at',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 155,
      responsive: ['lg'],
      render: value => <span className="admin-quick-replies-muted">{formatDateTime(value)}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 105,
      render: (_, record) => (
        <Space size="small" className="admin-quick-replies-actions">
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            className="admin-quick-replies-action-btn"
            aria-label="Edit quick reply"
          />
          <Popconfirm
            title="Delete quick reply?"
            description="This template will no longer be available to agents."
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => onDelete(record._id)}
            overlayClassName="admin-quick-replies-popconfirm"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              className="admin-quick-replies-action-btn admin-quick-replies-action-btn--danger"
              aria-label="Delete quick reply"
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <AdminTableShell
      className="admin-quick-replies-table-section"
      bodyClassName="admin-quick-replies-table-section__body"
    >
      <Table
        rowKey="_id"
        dataSource={data}
        columns={columns}
        loading={loading}
        scroll={{ x: 1040 }}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} templates`,
          onChange: onChangePagination,
          onShowSizeChange: onChangePagination
        }}
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No quick replies found" />
        }}
        className="admin-quick-replies-table"
      />
    </AdminTableShell>
  )
}

function QuickReplyFormModal({
  categoryOptions,
  open,
  editing,
  form,
  submitLoading,
  onClose,
  onSubmit,
  onInsertVariable
}) {
  const { bodyStyle, contentRef } = useModalBodyScroll(open)
  const formCategoryOptions = categoryOptions.map(category => ({
    value: category.value,
    label: category.isActive === false ? `${category.label} (Inactive)` : category.label,
    disabled: category.isActive === false && editing?.category !== category.value
  }))

  return (
    <Modal
      title={editing ? 'Edit quick reply' : 'Create quick reply'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={editing ? 'Save' : 'Create'}
      cancelText="Cancel"
      confirmLoading={submitLoading}
      destroyOnClose
      centered
      width={680}
      className="admin-quick-replies-modal"
      styles={{ body: bodyStyle }}
      okButtonProps={{ className: 'admin-quick-replies-primary-btn' }}
    >
      <div ref={contentRef}>
        <Form
          form={form}
          layout="vertical"
          initialValues={FORM_INITIAL_VALUES}
          onFinish={onSubmit}
          className="admin-quick-replies-form"
        >
          <Form.Item
            label="Template name"
            name="title"
            rules={[
              { required: true, message: 'Template name is required' },
              { min: 2, message: 'Template name must be at least 2 characters' }
            ]}
          >
            <Input placeholder="Xin mã đơn hàng" maxLength={140} />
          </Form.Item>

          <div className="admin-quick-replies-form__grid">
            <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Category is required' }]}>
              <Select options={formCategoryOptions} placeholder="Select category" />
            </Form.Item>

            <Form.Item
              label="Shortcut"
              name="shortcut"
              rules={[
                { required: true, message: 'Shortcut is required' },
                { pattern: /^\/[a-z0-9][a-z0-9-_]{1,62}$/, message: 'Use format like /order-code' }
              ]}
            >
              <Input placeholder="/order-code" maxLength={64} />
            </Form.Item>
          </div>

          <Form.Item
            label="Message content"
            name="content"
            rules={[
              { required: true, message: 'Message content is required' },
              { min: 2, message: 'Message content must be at least 2 characters' }
            ]}
          >
            <Input.TextArea
              rows={6}
              maxLength={2000}
              showCount
              placeholder="Dạ anh/chị gửi giúp em mã đơn hàng để em kiểm tra thông tin cho mình ạ."
            />
          </Form.Item>

          <div className="admin-quick-replies-variable-row">
            {VARIABLE_OPTIONS.map(variable => (
              <button
                key={variable}
                type="button"
                className="admin-quick-replies-variable-chip"
                onClick={() => onInsertVariable(variable)}
              >
                {`{{${variable}}}`}
              </button>
            ))}
          </div>

          <Form.Item label="Variables" name="variables">
            <Select
              mode="multiple"
              options={VARIABLE_OPTIONS.map(variable => ({ value: variable, label: variable }))}
              placeholder="Select variables used by this template"
            />
          </Form.Item>

          <div className="admin-quick-replies-form__grid">
            <Form.Item label="Language" name="language" rules={[{ required: true, message: 'Language is required' }]}>
              <Select options={LANGUAGE_OPTIONS.filter(option => option.value !== 'all')} />
            </Form.Item>

            <Form.Item label="Status" name="isActive" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

function ManageCategoriesModal({
  open,
  categories,
  loading,
  form,
  editing,
  submitLoading,
  onClose,
  onCreateNew,
  onEdit,
  onDelete,
  onSubmit,
  onToggleStatus,
  onNameChange
}) {
  const { bodyStyle, contentRef } = useModalBodyScroll(open)

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div className="admin-quick-replies-category-name-cell">
          <span className="admin-quick-replies-category-swatch" style={{ backgroundColor: record.color || '#64748b' }} />
          <span className="admin-quick-replies-category-name">{record.name}</span>
        </div>
      )
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      width: 140,
      render: value => <span className="admin-quick-replies-shortcut">{value}</span>
    },
    {
      title: 'Sort',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 82,
      render: value => <span className="admin-quick-replies-number">{value || 0}</span>
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 92,
      render: (_, record) => (
        <Switch
          size="small"
          checked={record.isActive}
          onChange={checked => onToggleStatus(record, checked)}
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            className="admin-quick-replies-action-btn"
            aria-label="Edit category"
          />
          <Popconfirm
            title="Delete category?"
            description="If this category is in use, it will be disabled instead."
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => onDelete(record._id)}
            overlayClassName="admin-quick-replies-popconfirm"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              className="admin-quick-replies-action-btn admin-quick-replies-action-btn--danger"
              aria-label="Delete category"
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Modal
      title="Manage categories"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      width={860}
      className="admin-quick-replies-modal admin-quick-replies-categories-modal"
      styles={{ body: bodyStyle }}
    >
      <div ref={contentRef} className="admin-quick-replies-categories">
        <AdminFormSection
          className="admin-quick-replies-category-form-card"
          title={editing ? 'Edit category' : 'Create category'}
          description="Use a stable slug because quick replies store the category slug."
          extra={editing && (
            <Button onClick={onCreateNew} className="admin-quick-replies-secondary-btn">
              New category
            </Button>
          )}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={CATEGORY_FORM_INITIAL_VALUES}
            onFinish={onSubmit}
          >
            <div className="admin-quick-replies-category-form-grid">
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: 'Category name is required' },
                  { min: 2, message: 'Category name must be at least 2 characters' }
                ]}
              >
                <Input placeholder="Order support" maxLength={80} onChange={onNameChange} />
              </Form.Item>

              <Form.Item
                label="Slug"
                name="slug"
                rules={[
                  { required: true, message: 'Slug is required' },
                  { pattern: /^[a-z0-9][a-z0-9-_]{0,62}$/, message: 'Use letters, numbers, hyphen, or underscore' }
                ]}
              >
                <Input placeholder="order" maxLength={64} disabled={!!editing} />
              </Form.Item>

              <Form.Item label="Color" name="color" rules={[{ required: true, message: 'Color is required' }]}>
                <Input type="color" className="admin-quick-replies-color-input" />
              </Form.Item>

              <Form.Item label="Sort order" name="sortOrder">
                <InputNumber className="admin-quick-replies-number-input" min={0} max={9999} />
              </Form.Item>

              <Form.Item label="Status" name="isActive" valuePropName="checked">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
            </div>

            <div className="admin-quick-replies-category-form-actions">
              <Button
                type="primary"
                htmlType="submit"
                loading={submitLoading}
                className="admin-quick-replies-primary-btn"
              >
                {editing ? 'Save category' : 'Create category'}
              </Button>
            </div>
          </Form>
        </AdminFormSection>

        <Table
          rowKey="_id"
          dataSource={categories}
          columns={columns}
          loading={loading}
          pagination={false}
          scroll={{ x: 720 }}
          locale={{
            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No categories found" />
          }}
          className="admin-quick-replies-table admin-quick-replies-categories-table"
        />
      </div>
    </Modal>
  )
}

export default function AdminQuickRepliesPage() {
  const [form] = Form.useForm()
  const [categoryForm] = Form.useForm()
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    categories: 0,
    usedThisMonth: 0
  })
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: 'all',
    language: 'all'
  })
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    total: 0
  })
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categorySubmitLoading, setCategorySubmitLoading] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(filters.search.trim())
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [filters.search])

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true)

    try {
      const response = await getQuickReplyCategories({ limit: 200 })
      setCategories(response?.data || [])
    } catch (error) {
      message.error(getRequestErrorMessage(error, 'Unable to load quick reply categories'))
      setCategories([])
    } finally {
      setCategoriesLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadCategories()
  }, [loadCategories])

  const loadQuickReplies = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getQuickReplies({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
        category: filters.category,
        status: filters.status === 'all' ? '' : filters.status,
        language: filters.language === 'all' ? '' : filters.language
      })

      setItems(response?.data || [])
      setStats(response?.stats || {
        total: 0,
        active: 0,
        categories: 0,
        usedThisMonth: 0
      })
      setPagination(current => ({
        ...current,
        total: response?.pagination?.total || 0
      }))
    } catch (error) {
      message.error(getRequestErrorMessage(error, 'Unable to load quick replies'))
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, filters.category, filters.language, filters.status, pagination.limit, pagination.page])

  useEffect(() => {
    void loadQuickReplies()
  }, [loadQuickReplies])

  const handleFilterChange = updates => {
    setFilters(current => ({ ...current, ...updates }))
    setPagination(current => ({ ...current, page: 1 }))
  }

  const handlePaginationChange = (page, pageSize) => {
    setPagination(current => ({
      ...current,
      page,
      limit: pageSize
    }))
  }

  const categoryOptions = useMemo(() => {
    const source = categories.length > 0
      ? categories.map(category => ({
          value: category.slug,
          label: category.name,
          color: category.color,
          isActive: category.isActive
        }))
      : DEFAULT_CATEGORY_OPTIONS.map(category => ({
          ...category,
          color: '#64748b',
          isActive: true
        }))

    const usedSlugs = new Set(source.map(category => category.value))
    items.forEach(item => {
      if (item?.category && !usedSlugs.has(item.category)) {
        source.push({
          value: item.category,
          label: item.category,
          color: '#64748b',
          isActive: false
        })
        usedSlugs.add(item.category)
      }
    })

    return source
  }, [categories, items])

  const getDefaultCategory = () => {
    return categoryOptions.find(category => category.isActive !== false)?.value || ''
  }

  const openCreateModal = () => {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({
      ...FORM_INITIAL_VALUES,
      category: getDefaultCategory()
    })
    setModalOpen(true)
  }

  const openEditModal = record => {
    setEditing(record)
    form.resetFields()
    form.setFieldsValue({
      ...FORM_INITIAL_VALUES,
      ...record,
      variables: record.variables || []
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    form.resetFields()
  }

  const handleSubmit = async values => {
    setSubmitLoading(true)

    try {
      const payload = normalizeFormValues(values)

      if (editing) {
        await updateQuickReply(editing._id, payload)
        message.success('Quick reply updated')
      } else {
        await createQuickReply(payload)
        message.success('Quick reply created')
      }

      closeModal()
      await loadQuickReplies()
    } catch (error) {
      message.error(getRequestErrorMessage(error, 'Unable to save quick reply'))
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async id => {
    try {
      await deleteQuickReply(id)
      message.success('Quick reply deleted')
      await loadQuickReplies()
    } catch (error) {
      message.error(getRequestErrorMessage(error, 'Unable to delete quick reply'))
    }
  }

  const handleToggleStatus = async (record, checked) => {
    try {
      await setQuickReplyStatus(record._id, checked)
      message.success(checked ? 'Quick reply enabled' : 'Quick reply disabled')
      await loadQuickReplies()
    } catch (error) {
      message.error(getRequestErrorMessage(error, 'Unable to update status'))
    }
  }

  const handleInsertVariable = variable => {
    const token = `{{${variable}}}`
    const content = form.getFieldValue('content') || ''
    const variables = new Set(form.getFieldValue('variables') || [])
    variables.add(variable)

    form.setFieldsValue({
      content: content ? `${content} ${token}` : token,
      variables: Array.from(variables)
    })
  }

  const openCategoriesModal = () => {
    setEditingCategory(null)
    categoryForm.resetFields()
    categoryForm.setFieldsValue(CATEGORY_FORM_INITIAL_VALUES)
    setCategoriesModalOpen(true)
  }

  const closeCategoriesModal = () => {
    setCategoriesModalOpen(false)
    setEditingCategory(null)
    categoryForm.resetFields()
  }

  const handleCreateNewCategory = () => {
    setEditingCategory(null)
    categoryForm.resetFields()
    categoryForm.setFieldsValue(CATEGORY_FORM_INITIAL_VALUES)
  }

  const handleEditCategory = category => {
    setEditingCategory(category)
    categoryForm.resetFields()
    categoryForm.setFieldsValue({
      ...CATEGORY_FORM_INITIAL_VALUES,
      ...category
    })
  }

  const handleCategoryNameChange = event => {
    if (editingCategory) {
      return
    }

    categoryForm.setFieldsValue({
      slug: slugifyCategoryName(event.target.value)
    })
  }

  const handleSubmitCategory = async values => {
    setCategorySubmitLoading(true)

    try {
      const payload = {
        name: values.name?.trim(),
        slug: editingCategory ? editingCategory.slug : values.slug?.trim(),
        color: values.color,
        sortOrder: values.sortOrder || 0,
        isActive: values.isActive !== false
      }

      if (editingCategory) {
        await updateQuickReplyCategory(editingCategory._id, payload)
        message.success('Category updated')
      } else {
        await createQuickReplyCategory(payload)
        message.success('Category created')
      }

      handleCreateNewCategory()
      await loadCategories()
    } catch (error) {
      message.error(getRequestErrorMessage(error, 'Unable to save category'))
    } finally {
      setCategorySubmitLoading(false)
    }
  }

  const handleToggleCategoryStatus = async (category, checked) => {
    try {
      await updateQuickReplyCategory(category._id, { isActive: checked })
      message.success(checked ? 'Category enabled' : 'Category disabled')
      await loadCategories()
    } catch (error) {
      message.error(getRequestErrorMessage(error, 'Unable to update category'))
    }
  }

  const handleDeleteCategory = async id => {
    try {
      const response = await deleteQuickReplyCategory(id)
      message.success(response?.softDisabled ? 'Category is in use, disabled instead' : 'Category deleted')
      await loadCategories()
    } catch (error) {
      message.error(getRequestErrorMessage(error, 'Unable to delete category'))
    }
  }

  const memoizedStats = useMemo(() => ({
    ...stats,
    categories: categories.length > 0
      ? categories.filter(category => category.isActive).length
      : stats.categories
  }), [categories, stats])

  return (
    <AdminPageShell
      seoTitle="Admin - Quick Replies"
      className="admin-quick-replies-page"
      contentClassName="admin-quick-replies-page__inner"
      maxWidth="1280px"
    >
      <QuickRepliesHeader onCreate={openCreateModal} onManageCategories={openCategoriesModal} />
      <QuickRepliesStats stats={memoizedStats} />
      <QuickRepliesFilters
        categoryOptions={categoryOptions}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      <QuickRepliesTable
        categoryOptions={categoryOptions}
        data={items}
        loading={loading}
        pagination={pagination}
        onChangePagination={handlePaginationChange}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      <QuickReplyFormModal
        categoryOptions={categoryOptions}
        open={modalOpen}
        editing={editing}
        form={form}
        submitLoading={submitLoading}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onInsertVariable={handleInsertVariable}
      />

      <ManageCategoriesModal
        open={categoriesModalOpen}
        categories={categories}
        loading={categoriesLoading}
        form={categoryForm}
        editing={editingCategory}
        submitLoading={categorySubmitLoading}
        onClose={closeCategoriesModal}
        onCreateNew={handleCreateNewCategory}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        onSubmit={handleSubmitCategory}
        onToggleStatus={handleToggleCategoryStatus}
        onNameChange={handleCategoryNameChange}
      />
    </AdminPageShell>
  )
}
