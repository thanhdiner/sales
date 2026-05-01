import { useEffect, useMemo, useState } from 'react'
import {
  AppstoreOutlined,
  DownOutlined,
  FolderOutlined,
  PictureOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import { Checkbox, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { isGroupSelectAll, isRoleSelectAll } from '../utils'
import {
  getLocalizedPermissionGroupLabel,
  getLocalizedPermissionTitle,
  getLocalizedRoleDescription,
  getLocalizedRoleLabel
} from '@/utils/adminAccessLocalization'

export default function RolePermissionsTable({
  roles,
  permissions,
  permissionGroups,
  loading,
  rolePerm,
  selectedRoleId,
  onRoleSelectAll,
  onGroupSelectAll,
  onPermissionToggle
}) {
  const { t, i18n } = useTranslation('adminRolePermission')
  const language = i18n.resolvedLanguage || i18n.language
  const [expandedGroups, setExpandedGroups] = useState(new Set())
  const [isDesktopLayout, setIsDesktopLayout] = useState(() => (
    typeof window === 'undefined' ? true : window.matchMedia('(min-width: 1280px)').matches
  ))

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1280px)')
    const handleChange = event => setIsDesktopLayout(event.matches)

    setIsDesktopLayout(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const orderedRoles = useMemo(() => {
    if (!selectedRoleId) return roles

    return [...roles].sort((firstRole, secondRole) => {
      if (firstRole._id === selectedRoleId) return -1
      if (secondRole._id === selectedRoleId) return 1
      return 0
    })
  }, [roles, selectedRoleId])

  const roleLookup = orderedRoles.reduce((mapping, role) => {
    mapping[role._id] = role
    return mapping
  }, {})

  const permissionLookup = permissions.reduce((mapping, permission) => {
    mapping[permission.name] = permission
    return mapping
  }, {})

  const groupLookup = permissionGroups.reduce((mapping, group) => {
    mapping[group.value] = group
    return mapping
  }, {})

  const groupRows = useMemo(() => (
    permissionGroups
      .filter(group => !group.deleted)
      .map(group => ({
        ...group,
        permissions: permissions.filter(permission => permission.group === group.value && !permission.deleted)
      }))
      .filter(group => group.permissions.length)
  ), [permissionGroups, permissions])

  const groupKeySignature = groupRows.map(group => group.value).join('|')

  useEffect(() => {
    setExpandedGroups(previousGroups => {
      const allowedGroups = new Set(groupRows.map(group => group.value))
      const nextGroups = new Set([...previousGroups].filter(groupValue => allowedGroups.has(groupValue)))

      if (!isDesktopLayout) {
        return nextGroups.size ? new Set() : nextGroups
      }

      if (!nextGroups.size && groupRows[0]) {
        nextGroups.add(groupRows[0].value)
      }

      return nextGroups
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupKeySignature, isDesktopLayout])

  const toggleGroup = groupValue => {
    setExpandedGroups(previousGroups => {
      const nextGroups = new Set(previousGroups)

      if (nextGroups.has(groupValue)) {
        nextGroups.delete(groupValue)
      } else {
        nextGroups.add(groupValue)
      }

      return nextGroups
    })
  }

  const dataSource = useMemo(() => {
    const rows = [
      {
        key: 'select-all-row',
        title: t('table.selectAll'),
        isSelectAll: true
      }
    ]

    groupRows.forEach(group => {
      rows.push({
        key: `group-selectall-${group.value}`,
        title: group.label,
        group,
        isGroupSelectAll: true,
        groupValue: group.value,
        groupDescription: group.description,
        permissionCount: group.permissions.length
      })

      if (expandedGroups.has(group.value)) {
        group.permissions.forEach(permission => {
          rows.push({
            ...permission,
            key: permission._id,
            isPermissionRow: true
          })
        })
      }
    })

    return rows
  }, [expandedGroups, groupRows, t])

  const columns = [
    {
      title: t('table.columns.permission'),
      dataIndex: 'title',
      key: 'title',
      width: orderedRoles.length > 3 ? 260 : '36%',
      render: (title, row) => {
        if (row.isSelectAll) {
          return (
            <span className="admin-role-permission-table__title admin-role-permission-table__title--all">
              <span className="admin-role-permission-table__icon admin-role-permission-table__icon--all">
                <SafetyCertificateOutlined />
              </span>
              <span>{t('table.selectAll')}</span>
            </span>
          )
        }

        if (row.isGroupSelectAll) {
          const localizedGroupLabel = getLocalizedPermissionGroupLabel(row.group, language, title || row.groupValue)
          const groupVisual = getGroupVisual(row.groupValue, localizedGroupLabel)
          const Icon = groupVisual.icon
          const isExpanded = expandedGroups.has(row.groupValue)

          return (
            <button
              type="button"
              className="admin-role-permission-table__group-trigger"
              onClick={() => toggleGroup(row.groupValue)}
            >
              <span className={`admin-role-permission-table__icon admin-role-permission-table__icon--${groupVisual.tone}`}>
                <Icon />
              </span>
              <span className="admin-role-permission-table__group-copy">
                <span className="admin-role-permission-table__title admin-role-permission-table__title--group">{localizedGroupLabel}</span>
                <span className="admin-role-permission-table__subtitle">
                  {t('table.permissionCount', { count: row.permissionCount })}
                </span>
              </span>
              <DownOutlined className={`admin-role-permission-table__chevron ${isExpanded ? 'is-expanded' : ''}`} />
            </button>
          )
        }

        return (
          <span className="admin-role-permission-table__title">
            <strong>{getLocalizedPermissionTitle(row, language, title || row.name)}</strong>
            {row.name ? <span className="admin-role-permission-table__subtitle">{row.name}</span> : null}
          </span>
        )
      }
    },
    ...orderedRoles.map(role => ({
      title: <RoleColumnTitle role={role} language={language} />,
      dataIndex: role._id,
      width: orderedRoles.length > 3 ? 140 : undefined,
      align: 'center',
      render: (_, row) => {
        const currentRole = roleLookup[role._id]
        const currentGroup = groupLookup[row.groupValue]
        const currentPermission = permissionLookup[row.name]
        const isRoleInactive = currentRole?.isActive === false
        const isGroupInactive = currentGroup?.isActive === false
        const isPermissionInactive = currentPermission?.isActive === false

        if (row.isSelectAll) {
          return (
            <Checkbox
              className="admin-role-permission-checkbox admin-role-permission-checkbox--role"
              checked={isRoleSelectAll(rolePerm[role._id], permissions)}
              onChange={event => onRoleSelectAll(role._id, event.target.checked)}
              disabled={isRoleInactive}
            />
          )
        }

        if (row.isGroupSelectAll) {
          return (
            <Checkbox
              className="admin-role-permission-checkbox admin-role-permission-checkbox--group"
              checked={isGroupSelectAll(rolePerm[role._id], permissions, row.groupValue)}
              onChange={event => onGroupSelectAll(role._id, row.groupValue, event.target.checked)}
              disabled={isRoleInactive || isGroupInactive}
            />
          )
        }

        return (
          <Checkbox
            className="admin-role-permission-checkbox"
            checked={rolePerm[role._id]?.includes(row.name)}
            onChange={event => onPermissionToggle(role._id, row.name, event.target.checked)}
            disabled={isRoleInactive || isGroupInactive || isPermissionInactive}
          />
        )
      }
    }))
  ]

  const scrollConfig = orderedRoles.length > 3 ? { x: 760 + orderedRoles.length * 140, y: 520 } : { y: 520 }

  return (
    <>
      <div className="admin-role-permission-table-wrap">
        <Table
          className="admin-role-permission-table"
          scroll={scrollConfig}
          columns={columns}
          dataSource={dataSource}
          rowKey="key"
          bordered
          pagination={false}
          loading={loading}
          locale={{
            emptyText: t('table.empty')
          }}
          tableLayout="fixed"
          rowClassName={record => {
            if (record.isSelectAll) {
              return 'admin-role-permission-row--all'
            }

            if (record.isGroupSelectAll) {
              return 'admin-role-permission-row--group'
            }

            if (record.isPermissionRow) {
              return 'admin-role-permission-row--permission'
            }

            return ''
          }}
        />
      </div>

      <div className="admin-role-permission-legend">
        <h3>{t('table.legend')}</h3>
        <div>
          {orderedRoles.map(role => (
            <p key={role._id}>
              <span>{getRoleAbbreviation(getLocalizedRoleLabel(role, language, role.label || ''))}</span>
              {getLocalizedRoleLabel(role, language, role.label || '')}
              {getLocalizedRoleDescription(role, language, role.description || '')
                ? ` (${getLocalizedRoleDescription(role, language, role.description || '')})`
                : ''}
            </p>
          ))}
        </div>
      </div>
    </>
  )
}

function RoleColumnTitle({ role, language }) {
  const roleLabel = getLocalizedRoleLabel(role, language, role.label || '')
  const roleDescription = getLocalizedRoleDescription(role, language, role.description || '')
  const abbreviation = getRoleAbbreviation(roleLabel)

  return (
    <span className="admin-role-permission-table__role-heading">
      <span className="admin-role-permission-table__role-label">{roleLabel}</span>
      <span className="admin-role-permission-table__role-abbr">{abbreviation}</span>
      {roleDescription ? <span className="admin-role-permission-table__role-badge">{roleDescription}</span> : null}
    </span>
  )
}

function getRoleAbbreviation(label = '') {
  const words = label.trim().split(/\s+/).filter(Boolean)

  if (!words.length) return '--'

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }

  return words.map(word => word[0]).join('').slice(0, 2).toUpperCase()
}

function getGroupVisual(groupValue = '', title = '') {
  const normalized = `${groupValue} ${title}`.toLowerCase()

  if (normalized.includes('product categor')) return { icon: AppstoreOutlined, tone: 'product-category' }
  if (normalized.includes('product')) return { icon: AppstoreOutlined, tone: 'products' }
  if (normalized.includes('order')) return { icon: ShoppingCartOutlined, tone: 'orders' }
  if (normalized.includes('promo') || normalized.includes('coupon')) return { icon: TagOutlined, tone: 'promo' }
  if (normalized.includes('flash')) return { icon: ThunderboltOutlined, tone: 'flash' }
  if (normalized.includes('banner') || normalized.includes('image')) return { icon: PictureOutlined, tone: 'banners' }

  return { icon: FolderOutlined, tone: 'default' }
}