import { useEffect, useState } from 'react'
import { Table, Checkbox, Button, message, Typography } from 'antd'
import { getAdminRoles, updateAdminRoleById } from '../../services/rolesService'
import { getAdminPermissionGroups } from '../../services/permissionGroupsService'
import { getAdminPermissions } from '../../services/permissionService'

const { Title } = Typography

export default function AdminRolePermissionsPage() {
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [permissionGroups, setPermissionGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const [rolePerm, setRolePerm] = useState({})

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
    }
    setLoading(false)
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
      width: 200,
      render: (title, row) => {
        if (row.isSelectAll) return <span style={{ fontWeight: '600', fontSize: 16 }}>Select all</span>
        return (
          <span>
            <b>{title}</b>
            <br />
            {row.name && <span style={{ color: '#888', fontSize: 12 }}>{row.name}</span>}
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
        if (row.isSelectAll) {
          return <Checkbox checked={isRoleSelectAll(role._id)} onChange={e => handleRoleSelectAll(role._id, e.target.checked)} />
        }
        if (row.isGroupSelectAll) {
          return (
            <Checkbox
              checked={isGroupSelectAll(role._id, row.groupValue)}
              onChange={e => handleGroupSelectAll(role._id, row.groupValue, e.target.checked)}
              disabled={isRoleSelectAll(role._id)}
            >
              All
            </Checkbox>
          )
        }
        if (row.isGroup) return null
        return (
          <Checkbox
            checked={rolePerm[role._id]?.includes(row.name)}
            onChange={e => handleCheckbox(role._id, row.name, e.target.checked)}
            disabled={isRoleSelectAll(role._id) || isGroupSelectAll(role._id, row.group)}
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
      title: <span style={{ fontWeight: '500', color: '#008cff' }}>{group.label}</span>,
      isGroupSelectAll: true,
      groupValue: group.value
    })
    groupPerms.forEach(p => {
      dataSource.push({ ...p, key: p._id })
    })
  })

  return (
    <div>
      <Title level={3} style={{ marginBottom: 20 }}>
        Role Permission
      </Title>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        bordered
        pagination={false}
        loading={loading}
        rowClassName={row => (row.isGroup ? 'group-row' : '')}
        onRow={row => (row.isGroup ? { style: { background: '#fafafa' } } : {})}
      />
      <Button type="primary" style={{ marginTop: 24 }} onClick={handleUpdate} loading={loading}>
        Save Changes
      </Button>
    </div>
  )
}
