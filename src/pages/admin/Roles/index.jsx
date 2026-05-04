import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  Dropdown,
  Form,
  Grid,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message
} from 'antd'
import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons'
import SEO from '@/components/shared/SEO'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import useAdminPermissions from '@/hooks/admin/useAdminPermissions'
import { useModalBodyScroll } from '@/hooks/shared/useModalBodyScroll'
import { getPermissions } from '@/services/admin/rbac/permission'
import { createRole, deleteRole, getRoles, toggleStatusRole, updateRoleById } from '@/services/admin/rbac/role'
import {
  getLocalizedPermissionTitle,
  getLocalizedRoleDescription,
  getLocalizedRoleLabel
} from './utils/roleLocalization'
import './index.scss'

const { Title, Text } = Typography
const { useBreakpoint } = Grid

const DEFAULT_PAGE_SIZE = 10
const ROLE_INITIAL_VALUES = {
  label: '',
  description: '',
  translations: {
    en: {
      label: '',
      description: ''
    }
  },
  permissions: [],
  isActive: true
}

const getRoleInitials = label =>
  (label || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase() || 'R'

const isSystemRole = role => {
  const roleLabel = role?.label?.toLowerCase?.() || ''
  const roleName = role?.name?.toLowerCase?.() || ''

  return roleLabel.includes('superadmin') || roleName.includes('superadmin')
}

const getRoleFormValues = role => ({
  label: role?.label || '',
  description: role?.description || '',
  permissions: Array.isArray(role?.permissions) ? role.permissions : [],
  isActive: role?.isActive !== false,
  translations: {
    en: {
      ...ROLE_INITIAL_VALUES.translations.en,
      ...(role?.translations?.en || {})
    }
  }
})

const normalizeRoleFormValues = values => ({
  ...values,
  label: typeof values.label === 'string' ? values.label.trim() : '',
  description: typeof values.description === 'string' ? values.description : '',
  translations: {
    en: {
      label: typeof values.translations?.en?.label === 'string' ? values.translations.en.label.trim() : '',
      description: typeof values.translations?.en?.description === 'string' ? values.translations.en.description : ''
    }
  }
})

export default function Roles() {
  const { t } = useTranslation('adminRoles')
  const language = useCurrentLanguage()
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState({ visible: false, editing: null })
  const [form] = Form.useForm()
  const [updatingId, setUpdatingId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const { bodyStyle, contentRef } = useModalBodyScroll(modal.visible)
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const isTablet = Boolean(screens.md && !screens.xl)
  const grantedPermissions = useAdminPermissions()

  const canCreateRole = grantedPermissions.includes('create_role')
  const canEditRole = grantedPermissions.includes('edit_role')
  const canDeleteRole = grantedPermissions.includes('delete_role')

  const permissionPreviewLimit = isMobile ? 3 : isTablet ? 4 : 8

  const paginatedRoles = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return roles.slice(startIndex, startIndex + pageSize)
  }, [currentPage, pageSize, roles])

  useEffect(() => {
    fetchData()
    fetchPermissions()
  }, [language])

  useEffect(() => {
    if (!modal.visible) {
      return
    }

    form.resetFields()

    if (modal.editing) {
      form.setFieldsValue(getRoleFormValues(modal.editing))
      return
    }

    form.setFieldsValue(ROLE_INITIAL_VALUES)
  }, [form, modal.editing, modal.visible])

  const fetchData = async () => {
    setLoading(true)

    try {
      const res = await getRoles()
      setRoles(res.data || [])
    } catch {
      setRoles([])
    } finally {
      setLoading(false)
    }
  }

  const fetchPermissions = async () => {
    try {
      const res = await getPermissions()
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
      await deleteRole(role._id)
      message.success(t('messages.deleteSuccess'))
      await fetchData()
    } catch (error) {
      message.error(error?.response?.message || error?.response?.error || t('messages.deleteError'))
    } finally {
      setLoading(false)
    }
  }

  const showDeleteConfirm = role => {
    Modal.confirm({
      className: 'admin-roles-confirm-modal',
      wrapClassName: 'admin-roles-confirm-modal',
      title: t('confirm.deleteTitle'),
      content: t('confirm.deleteContent'),
      okText: t('common.delete'),
      cancelText: t('common.cancel'),
      okType: 'danger',
      onOk: () => handleDelete(role)
    })
  }

  const handleToggleActive = async role => {
    setUpdatingId(role._id)

    try {
      await toggleStatusRole(role._id)
      message.success(!role.isActive ? t('messages.toggleActive') : t('messages.toggleInactive'))
      await fetchData()
    } catch {
      message.error(t('messages.toggleError'))
    } finally {
      setUpdatingId(null)
    }
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      const data = normalizeRoleFormValues(values)
      setLoading(true)

      if (modal.editing) {
        await updateRoleById(modal.editing._id, data)
        message.success(t('messages.updateSuccess'))
      } else {
        await createRole(data)
        message.success(t('messages.createSuccess'))
      }

      setModal({ visible: false, editing: null })
      await fetchData()
    } catch (error) {
      if (error?.status === 400 && (error?.response?.message || error?.response?.error)) {
        message.error(error.response.message || error.response.error)
      } else if (!error?.errorFields) {
        message.error(t('messages.saveError'))
      }
    } finally {
      setLoading(false)
    }
  }

  const getPermissionTitle = permissionName => {
    const permission = permissions.find(permission => permission.name === permissionName)
    return getLocalizedPermissionTitle(permission, language, permissionName)
  }

  const getEnglishTranslationLabel = role => {
    const translatedLabel = role?.translations?.en?.label?.trim?.()

    if (translatedLabel) {
      return translatedLabel
    }

    const localizedLabel = role?.localizedLabel?.trim?.()
    return localizedLabel && localizedLabel !== role?.label ? localizedLabel : ''
  }

  const renderEnglishTranslationPreview = role => {
    const englishLabel = getEnglishTranslationLabel(role)

    if (!englishLabel) {
      return null
    }

    return (
      <span className="admin-roles-table__translation-preview" title={englishLabel}>
        {t('table.englishTranslation', { label: englishLabel })}
      </span>
    )
  }

  const renderPermissionTags = rolePermissions => {
    if (!rolePermissions?.length) {
      return <span className="admin-roles-table__empty">{t('table.noPermissions')}</span>
    }

    const visiblePermissions = rolePermissions.slice(0, permissionPreviewLimit)
    const hiddenCount = Math.max(0, rolePermissions.length - visiblePermissions.length)

    return (
      <div className="admin-roles-table__permission-list">
        {visiblePermissions.map(permission => (
          <Tag key={permission} className="admin-roles-permission-tag" title={getPermissionTitle(permission)}>
            {getPermissionTitle(permission)}
          </Tag>
        ))}

        {hiddenCount > 0 ? (
          <Tag className="admin-roles-permission-tag admin-roles-permission-tag--more">
            {t('table.morePermissions', { count: hiddenCount })}
          </Tag>
        ) : null}
      </div>
    )
  }

  const renderRoleActionMenu = role => {
    const menuItems = [
      ...(canEditRole
        ? [
            {
              key: 'edit',
              icon: <EditOutlined />,
              label: t('common.editRole')
            }
          ]
        : []),
      ...(canDeleteRole
        ? [
            {
              key: 'delete',
              icon: <DeleteOutlined />,
              danger: true,
              label: t('common.deleteRole')
            }
          ]
        : [])
    ]

    return menuItems.length ? (
      <Dropdown
        trigger={['click']}
        placement="bottomRight"
        overlayClassName="admin-roles-action-dropdown"
        menu={{
          items: menuItems,
          onClick: ({ key }) => {
            if (key === 'edit') {
              handleEdit(role)
            }

            if (key === 'delete') {
              showDeleteConfirm(role)
            }
          }
        }}
      >
        <Button
          icon={<MoreOutlined />}
          className="admin-roles-action-btn admin-roles-action-btn--menu"
          aria-label={t('table.openActions')}
          title={t('table.openActions')}
        />
      </Dropdown>
    ) : null
  }

  const renderRoleStatus = role => (
    <div className="admin-roles-status-cell">
      <Switch
        className="admin-roles-switch"
        checked={role.isActive}
        loading={updatingId === role._id}
        onChange={() => handleToggleActive(role)}
        disabled={!canEditRole}
      />

      <span className={`admin-roles-status-text ${role.isActive ? 'admin-roles-status-text--active' : 'admin-roles-status-text--inactive'}`}>
        {role.isActive ? t('status.enabled') : t('status.disabled')}
      </span>
    </div>
  )

  const columns = [
    {
      title: t('table.columns.role'),
      dataIndex: 'label',
      key: 'label',
      width: isMobile ? 220 : 250,
      render: (label, record) => (
        <div className="admin-roles-table__role-cell">
          <span className="admin-roles-table__role-avatar">{getRoleInitials(getLocalizedRoleLabel(record, language, label))}</span>

          <span className="admin-roles-table__role-meta-wrap">
            {canEditRole ? (
              <button
                type="button"
                className="admin-roles-table__role-label admin-roles-table__role-label--button"
                onClick={() => handleEdit(record)}
                title={t('common.editRole')}
              >
                {getLocalizedRoleLabel(record, language, label)}
              </button>
            ) : (
              <span className="admin-roles-table__role-label">{getLocalizedRoleLabel(record, language, label)}</span>
            )}
            {renderEnglishTranslationPreview(record)}
            {isSystemRole(record) ? <span className="admin-roles-table__role-meta">{t('common.system')}</span> : null}
          </span>
        </div>
      )
    },
    {
      title: t('table.columns.description'),
      dataIndex: 'description',
      key: 'description',
      width: isMobile ? 190 : 260,
      render: (description, record) => (
        <span
          className="admin-roles-table__description"
          title={getLocalizedRoleDescription(record, language, description || t('table.noDescription'))}
        >
          {getLocalizedRoleDescription(record, language, description || t('table.noDescription'))}
        </span>
      )
    },
    {
      title: t('table.columns.permissions'),
      dataIndex: 'permissions',
      key: 'permissions',
      width: isMobile ? 280 : 430,
      render: renderPermissionTags
    },
    {
      title: t('table.columns.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: isMobile ? 120 : 140,
      render: (_, record) => renderRoleStatus(record)
    },
    {
      title: t('table.columns.actions'),
      key: 'action',
      width: isMobile ? 86 : 148,
      render: (_, record) => {
        if (isMobile) {
          return renderRoleActionMenu(record)
        }

        return (
          <Space size="small">
            {canEditRole && (
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                className="admin-roles-action-btn"
                title={t('common.editRole')}
                aria-label={t('common.editRole')}
              />
            )}

            {canDeleteRole && (
              <Popconfirm
                title={t('confirm.deleteTitle')}
                description={t('confirm.deleteContent')}
                onConfirm={() => handleDelete(record)}
                okText={t('common.delete')}
                cancelText={t('common.cancel')}
                overlayClassName="admin-roles-popconfirm"
              >
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  className="admin-roles-action-btn admin-roles-action-btn--danger"
                  title={t('common.deleteRole')}
                  aria-label={t('common.deleteRole')}
                />
              </Popconfirm>
            )}
          </Space>
        )
      }
    }
  ]

  const paginationConfig = {
    current: currentPage,
    pageSize,
    total: roles.length,
    showSizeChanger: true,
    showQuickJumper: !isMobile,
    showTotal: (count, range) => t('table.showTotal', { rangeStart: range[0], rangeEnd: range[1], total: count }),
    onChange: page => setCurrentPage(page),
    onShowSizeChange: (page, size) => {
      setCurrentPage(page)
      setPageSize(size)
    }
  }

  return (
    <div className="admin-roles-page">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-roles-header">
            <div>
              <Title level={2} className="admin-roles-header__title">
                {t('page.title')}
              </Title>
              <Text className="admin-roles-header__description">
                {t('page.description')}
              </Text>
            </div>

            {canCreateRole && (
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} className="admin-roles-btn admin-roles-btn--primary">
                {t('common.addRole')}
              </Button>
            )}
          </div>

          {isMobile ? (
            <>
              <div className="admin-roles-mobile-list">
                {loading ? (
                  <div className="admin-roles-mobile-state">{t('table.loading')}</div>
                ) : paginatedRoles.length ? (
                  paginatedRoles.map(role => (
                    <article key={role._id} className="admin-role-card">
                      <div className="admin-role-card__top">
                        <span className="admin-role-card__avatar">{getRoleInitials(getLocalizedRoleLabel(role, language, role.label))}</span>

                        <div className="admin-role-card__heading">
                          <h3>
                            {canEditRole ? (
                              <button type="button" onClick={() => handleEdit(role)} title={t('common.editRole')}>
                                {getLocalizedRoleLabel(role, language, role.label)}
                              </button>
                            ) : (
                              getLocalizedRoleLabel(role, language, role.label)
                            )}
                          </h3>
                          {renderEnglishTranslationPreview(role)}
                          {isSystemRole(role) ? <span>{t('common.system')}</span> : null}
                        </div>

                        {renderRoleActionMenu(role)}
                      </div>

                      <p className="admin-role-card__description">
                        {getLocalizedRoleDescription(role, language, role.description || t('table.noDescription'))}
                      </p>

                      <div className="admin-role-card__permissions">
                        <span className="admin-role-card__section-label">{t('table.columns.permissions')}</span>
                        {renderPermissionTags(role.permissions)}
                      </div>

                      <div className="admin-role-card__status">
                        <div>
                          <span className="admin-role-card__section-label">{t('table.columns.status')}</span>
                          <strong className={role.isActive ? 'is-active' : ''}>{role.isActive ? t('status.enabled') : t('status.disabled')}</strong>
                        </div>

                        {renderRoleStatus(role)}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="admin-roles-mobile-state">{t('table.empty')}</div>
                )}
              </div>

              {roles.length > 0 && (
                <div className="admin-roles-mobile-pagination">
                  <Pagination {...paginationConfig} responsive />
                </div>
              )}
            </>
          ) : (
            <div className="admin-roles-table-wrap">
              <Table
                dataSource={paginatedRoles}
                columns={columns}
                rowKey="_id"
                loading={loading}
                scroll={{ x: 980 }}
                pagination={paginationConfig}
                className="admin-roles-table min-w-[980px]"
              />
            </div>
          )}
      <Modal
          className="admin-roles-modal"
          rootClassName="admin-roles-modal"
          wrapClassName="admin-roles-modal"
          title={<span className="admin-roles-modal__title">{modal.editing ? t('form.editTitle') : t('form.createTitle')}</span>}
          open={modal.visible}
          onOk={handleOk}
          onCancel={() => setModal({ visible: false, editing: null })}
          okText={modal.editing ? t('common.save') : t('common.create')}
          cancelText={t('common.cancel')}
          destroyOnClose
          confirmLoading={loading}
          centered
          styles={{ body: bodyStyle }}
          okButtonProps={{
            className: 'admin-roles-btn admin-roles-btn--primary'
          }}
          cancelButtonProps={{
            className: 'admin-roles-btn admin-roles-btn--default'
          }}
        >
          <div ref={contentRef}>
            <Form form={form} layout="vertical" autoComplete="off" initialValues={ROLE_INITIAL_VALUES} className="admin-roles-form">
              <Form.Item label={t('form.roleName')} name="label" rules={[{ required: true, message: t('form.roleNameRequired') }]}>
                <Input placeholder={t('form.roleNamePlaceholder')} className="admin-roles-input" />
              </Form.Item>

              <Form.Item label={t('form.description')} name="description">
                <Input.TextArea rows={3} placeholder={t('form.descriptionPlaceholder')} className="admin-roles-input" />
              </Form.Item>

              <div className="admin-roles-form__translation">
                <h3 className="admin-roles-form__translation-title">{t('form.translations.sectionTitle')}</h3>

                <Form.Item label={t('form.translations.roleName')} name={['translations', 'en', 'label']}>
                  <Input placeholder={t('form.translations.roleNamePlaceholder')} className="admin-roles-input" />
                </Form.Item>

                <Form.Item label={t('form.translations.description')} name={['translations', 'en', 'description']}>
                  <Input.TextArea rows={3} placeholder={t('form.translations.descriptionPlaceholder')} className="admin-roles-input" />
                </Form.Item>
              </div>

              <Form.Item label={t('form.permissions')} name="permissions">
                <Select
                  mode="multiple"
                  allowClear
                  options={permissions.map(permission => ({
                    label: getLocalizedPermissionTitle(permission, language, permission.title || permission.name),
                    value: permission.name
                  }))}
                  placeholder={t('form.permissionsPlaceholder')}
                  className="admin-roles-select"
                  maxTagCount="responsive"
                  listHeight={256}
                  getPopupContainer={trigger => trigger?.parentElement || document.body}
                  dropdownClassName="admin-roles-select-dropdown"
                />
              </Form.Item>

              <Form.Item label={t('form.status')} name="isActive" valuePropName="checked">
                <Switch className="admin-roles-switch" checkedChildren={t('status.enabled')} unCheckedChildren={t('status.disabled')} />
              </Form.Item>
            </Form>
          </div>
      </Modal>
    </div>
  )
}