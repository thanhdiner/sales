import { Checkbox, Table } from 'antd'
import { buildRolePermissionDataSource, isGroupSelectAll, isRoleSelectAll } from '../utils'

export default function AdminRolePermissionsTableSection({
  roles,
  permissions,
  permissionGroups,
  loading,
  rolePerm,
  onRoleSelectAll,
  onGroupSelectAll,
  onPermissionToggle
}) {
  const roleLookup = roles.reduce((mapping, role) => {
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

  const columns = [
    {
      title: 'Permissions',
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
      width: 140,
      render: (title, row) => {
        if (row.isSelectAll) {
          return <span className="text-base font-semibold">Select all</span>
        }

        if (row.isGroupSelectAll) {
          return <span className="font-medium text-[#008cff]">{title}</span>
        }

        return (
          <span>
            <b>{title}</b>
            <br />
            {row.name && <span className="text-xs text-[#888]">{row.name}</span>}
          </span>
        )
      }
    },
    ...roles.map(role => ({
      title: <b>{role.label}</b>,
      dataIndex: role._id,
      width: 120,
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
              checked={isRoleSelectAll(rolePerm[role._id], permissions)}
              onChange={event => onRoleSelectAll(role._id, event.target.checked)}
              disabled={isRoleInactive}
            />
          )
        }

        if (row.isGroupSelectAll) {
          return (
            <Checkbox
              className="checkbox-orange"
              checked={isGroupSelectAll(rolePerm[role._id], permissions, row.groupValue)}
              onChange={event => onGroupSelectAll(role._id, row.groupValue, event.target.checked)}
              disabled={isRoleInactive || isGroupInactive}
            />
          )
        }

        return (
          <Checkbox
            checked={rolePerm[role._id]?.includes(row.name)}
            onChange={event => onPermissionToggle(role._id, row.name, event.target.checked)}
            disabled={isRoleInactive || isGroupInactive || isPermissionInactive}
          />
        )
      }
    }))
  ]

  const dataSource = buildRolePermissionDataSource(permissionGroups, permissions)

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <Table
        scroll={{ x: 1000, y: 500 }}
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        bordered
        pagination={false}
        loading={loading}
        style={{ minWidth: 900 }}
      />
    </div>
  )
}
