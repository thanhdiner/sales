import { useEffect, useState } from 'react'
import { Table, Checkbox, Button, message, Typography } from 'antd'
import { getAdminRoles, updateAdminRoleById } from '@/services/rolesService'
import { getAdminPermissionGroups } from '@/services/permissionGroupsService'
import { getAdminPermissions } from '@/services/permissionService'
import './AdminRolePermissionPage.scss'
import useAdminPermissions from '@/hooks/useAdminPermissions'
import titles from '@/utils/titles'

const { Title } = Typography

export default function AdminRolePermissionsPage() {
  titles('Role Permission')

  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [permissionGroups, setPermissionGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const [rolePerm, setRolePerm] = useState({})

  const hasPermissions = useAdminPermissions()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [roleRes, permRes, groupRes] = await Promise.all([getAdminRoles(), getAdminPermissions(), getAdminPermissionGroups()])
      setRoles(roleRes.data)
      setPermissions(permRes.data)
      setPermissionGroups(groupRes.data)

      const mapping = {}
      roleRes.data.forEach(r => {
        mapping[r._id] = r.permissions || []
      })
      setRolePerm(mapping)
    } catch (e) {
      message.error('Lỗi khi lấy dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const isRoleSelectAll = roleId => {
    const allPerms = permissions.filter(p => !p.deleted).map(p => p.name)
    return allPerms.every(perm => rolePerm[roleId]?.includes(perm))
  }

  const isGroupSelectAll = (roleId, groupValue) => {
    const groupPerms = permissions.filter(p => p.group === groupValue && !p.deleted).map(p => p.name)
    if (!groupPerms.length) return false
    return groupPerms.every(perm => rolePerm[roleId]?.includes(perm))
  }

  //# Handler
  const handleRoleSelectAll = (roleId, checked) => {
    const allPerms = permissions.filter(p => !p.deleted).map(p => p.name)
    setRolePerm(prev => ({
      ...prev,
      [roleId]: checked ? allPerms : []
    }))
  }

  const handleGroupSelectAll = (roleId, groupValue, checked) => {
    const groupPerms = permissions.filter(p => p.group === groupValue && !p.deleted).map(p => p.name)
    setRolePerm(prev => {
      const newPerms = new Set(prev[roleId] || [])
      if (checked) groupPerms.forEach(p => newPerms.add(p))
      else groupPerms.forEach(p => newPerms.delete(p))
      return { ...prev, [roleId]: Array.from(newPerms) }
    })
  }

  const handleCheckbox = (roleId, permName, checked) => {
    setRolePerm(prev => ({
      ...prev,
      [roleId]: checked ? [...(prev[roleId] || []), permName] : (prev[roleId] || []).filter(p => p !== permName)
    }))
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      for (let r of roles) {
        await updateAdminRoleById(r._id, { label: r.label, permissions: rolePerm[r._id] })
      }
      message.success('Cập nhật phân quyền thành công!')
      fetchData()
    } catch (e) {
      message.error('Lưu phân quyền thất bại')
    }
    setLoading(false)
  }

  const columns = [
    {
      title: 'Permissions',
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
      width: 140,
      render: (title, row) => {
        if (row.isSelectAll) return <span className="font-semibold text-base">Select all</span>
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
        const currentRole = roles.find(r => r._id === role._id)
        const groupOfRow = permissionGroups.find(g => g.value === row.groupValue)
        const isRoleInactive = currentRole && currentRole.isActive === false
        const isGroupInactive = groupOfRow && groupOfRow.isActive === false

        if (row.isSelectAll) {
          return (
            <Checkbox
              checked={isRoleSelectAll(role._id)}
              onChange={e => handleRoleSelectAll(role._id, e.target.checked)}
              disabled={isRoleInactive}
            />
          )
        }
        if (row.isGroupSelectAll) {
          return (
            <Checkbox
              className={row.isGroupSelectAll ? 'checkbox-orange' : ''}
              checked={isGroupSelectAll(role._id, row.groupValue)}
              onChange={e => handleGroupSelectAll(role._id, row.groupValue, e.target.checked)}
              disabled={isRoleInactive || isGroupInactive}
            />
          )
        }
        if (row.isGroup) return null

        const perm = permissions.find(p => p.name === row.name)
        const isPermInactive = perm && perm.isActive === false
        return (
          <Checkbox
            checked={rolePerm[role._id]?.includes(row.name)}
            onChange={e => handleCheckbox(role._id, row.name, e.target.checked)}
            disabled={isRoleInactive || isGroupInactive || isPermInactive}
          />
        )
      }
    }))
  ]

  const selectAllRow = {
    key: 'select-all-row',
    title: 'Select all',
    isSelectAll: true
  }
  const dataSource = [selectAllRow]
  permissionGroups.forEach(group => {
    const groupPerms = permissions.filter(p => p.group === group.value && !p.deleted)
    if (!groupPerms.length) return
    dataSource.push({
      key: `group-selectall-${group.value}`,
      title: <span className="font-medium text-[#008cff]">{group.label}</span>,
      isGroupSelectAll: true,
      groupValue: group.value
    })
    groupPerms.forEach(p => {
      dataSource.push({ ...p, key: p._id })
    })
  })

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <Title level={3} className="text-gray-900 dark:text-gray-200 !mb-0">
          Role Permission
        </Title>
        {hasPermissions.includes('edit_role_permission') && (
          <Button
            type="primary"
            onClick={handleUpdate}
            loading={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg py-2 px-6 w-full sm:w-auto"
          >
            Save Changes
          </Button>
        )}
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <Table
          scroll={{ x: 1000, y: 500 }}
          columns={columns}
          dataSource={dataSource}
          rowKey="key"
          bordered
          pagination={false}
          loading={loading}
          rowClassName={row => (row.isGroup ? 'group-row' : '')}
          onRow={row => (row.isGroup ? { style: { background: '#fafafa' } } : {})}
          style={{ minWidth: 900 }}
        />
      </div>
    </>
  )
}
