import { useState } from 'react'
import { Form, message } from 'antd'
import {
  createAdminPermissionGroup,
  updateAdminPermissionGroupById
} from '@/services/permissionGroupsService'
import {
  adminPermissionGroupInitialValues,
  getPermissionGroupErrorMessage,
  getPermissionGroupSlug
} from '../utils'

export function useAdminPermissionGroupForm({ onSaved }) {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)
  const [editingGroup, setEditingGroup] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  const openModal = group => {
    setEditingGroup(group || null)

    if (group) {
      form.setFieldsValue(group)
    } else {
      form.resetFields()
      form.setFieldsValue(adminPermissionGroupInitialValues)
    }

    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setEditingGroup(null)
    form.resetFields()
  }

  const handleLabelChange = event => {
    if (editingGroup) {
      return
    }

    form.setFieldsValue({
      value: getPermissionGroupSlug(event.target.value)
    })
  }

  const handleSubmit = async values => {
    setSubmitLoading(true)

    try {
      const payload = { ...values }

      if (!editingGroup && payload.label && !payload.value) {
        payload.value = getPermissionGroupSlug(payload.label)
      }

      if (editingGroup) {
        await updateAdminPermissionGroupById(editingGroup._id, payload)
        message.success('Đã cập nhật nhóm quyền')
      } else {
        await createAdminPermissionGroup(payload)
        message.success('Đã tạo nhóm quyền')
      }

      closeModal()
      onSaved?.()
    } catch (error) {
      if (error?.errorFields) {
        return
      }

      message.error(getPermissionGroupErrorMessage(error, 'Không thể lưu nhóm quyền'))
    } finally {
      setSubmitLoading(false)
    }
  }

  return {
    form,
    modalVisible,
    editingGroup,
    submitLoading,
    openModal,
    closeModal,
    handleSubmit,
    handleLabelChange
  }
}
