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
  getPermissionFormValues,
  getPermissionSlug,
  normalizePermissionFormValues
} from '../utils'

export function useAdminPermissionForm({ onSaved, t = key => key }) {
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
      form.setFieldsValue(getPermissionFormValues(permission))
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
        await createAdminPermissions(payload)
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
