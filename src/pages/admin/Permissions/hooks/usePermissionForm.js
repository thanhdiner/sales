import { useCallback, useEffect, useState } from 'react'
import { Form, message } from 'antd'
import { getPermissionGroups } from '@/services/admin/rbac/permissionGroup'
import { createPermissions, updatePermissionById } from '@/services/admin/rbac/permission'
import {
  permissionInitialValues,
  getPermissionErrorMessage,
  getPermissionFormValues,
  getPermissionSlug,
  normalizePermissionFormValues
} from '../utils'

export function usePermissionForm({ onSaved, t = key => key }) {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)
  const [editingPermission, setEditingPermission] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [permissionGroups, setPermissionGroups] = useState([])

  const fetchPermissionGroups = useCallback(async () => {
    try {
      const res = await getPermissionGroups()
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
      form.setFieldsValue(getPermissionFormValues(permission))
    } else {
      form.resetFields()
      form.setFieldsValue(permissionInitialValues)
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
      const payload = normalizePermissionFormValues({
        ...values,
        ...form.getFieldsValue(true)
      })

      if (!editingPermission && payload.title && !payload.name) {
        payload.name = getPermissionSlug(payload.title)
      }

      if (editingPermission) {
        await updatePermissionById(editingPermission._id, payload)
        message.success(t('messages.updateSuccess'))
      } else {
        await createPermissions(payload)
        message.success(t('messages.createSuccess'))
      }

      closeModal()
      onSaved?.()
    } catch (error) {
      if (error?.errorFields) {
        return
      }

      message.error(getPermissionErrorMessage(error, t('messages.saveError')))
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
