import { useCallback, useEffect, useState } from 'react'
import { Form, message } from 'antd'
import { getAdminPermissionGroups } from '@/services/permissionGroupsService'
import {
  createAdminPermissions,
  updatePermissionById
} from '@/services/permissionService'
import {
  adminPermissionInitialValues,
  getPermissionErrorMessage,
  getPermissionSlug
} from '../utils'

export function useAdminPermissionForm({ onSaved }) {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)
  const [editingPermission, setEditingPermission] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [permissionGroups, setPermissionGroups] = useState([])

  const fetchPermissionGroups = useCallback(async () => {
    try {
      const res = await getAdminPermissionGroups()
      setPermissionGroups((res.data || []).filter(group => group.isActive && !group.deleted))
    } catch {
      setPermissionGroups([])
    }
  }, [])

  useEffect(() => {
    fetchPermissionGroups()
  }, [fetchPermissionGroups])

  const openModal = permission => {
    setEditingPermission(permission || null)

    if (permission) {
      form.setFieldsValue(permission)
    } else {
      form.resetFields()
      form.setFieldsValue(adminPermissionInitialValues)
    }

    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setEditingPermission(null)
    form.resetFields()
  }

  const handleTitleChange = event => {
    if (editingPermission) {
      return
    }

    form.setFieldsValue({
      name: getPermissionSlug(event.target.value)
    })
  }

  const handleSubmit = async values => {
    setSubmitLoading(true)

    try {
      const payload = { ...values }

      if (!editingPermission && payload.title && !payload.name) {
        payload.name = getPermissionSlug(payload.title)
      }

      if (editingPermission) {
        await updatePermissionById(editingPermission._id, payload)
        message.success('Đã cập nhật quyền')
      } else {
        await createAdminPermissions(payload)
        message.success('Đã tạo quyền')
      }

      closeModal()
      onSaved?.()
    } catch (error) {
      if (error?.errorFields) {
        return
      }

      message.error(getPermissionErrorMessage(error, 'Không thể lưu quyền'))
    } finally {
      setSubmitLoading(false)
    }
  }

  return {
    form,
    modalVisible,
    editingPermission,
    submitLoading,
    permissionGroups,
    openModal,
    closeModal,
    handleSubmit,
    handleTitleChange
  }
}
