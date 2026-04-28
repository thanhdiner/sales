import { useState } from 'react'
import { Form, message } from 'antd'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('adminPermissionGroups')
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)
  const [editingGroup, setEditingGroup] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  const openModal = group => {
    setEditingGroup(group || null)
    form.resetFields()

    if (group) {
      form.setFieldsValue({
        ...adminPermissionGroupInitialValues,
        ...group,
        translations: {
          en: {
            ...adminPermissionGroupInitialValues.translations.en,
            ...(group.translations?.en || {})
          }
        }
      })
    } else {
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
      const payload = {
        ...values,
        translations: {
          en: {
            label: values.translations?.en?.label?.trim() || '',
            description: values.translations?.en?.description || ''
          }
        }
      }

      if (!editingGroup && payload.label && !payload.value) {
        payload.value = getPermissionGroupSlug(payload.label)
      }

      if (editingGroup) {
        await updateAdminPermissionGroupById(editingGroup._id, payload)
        message.success(t('messages.updateSuccess'))
      } else {
        await createAdminPermissionGroup(payload)
        message.success(t('messages.createSuccess'))
      }

      closeModal()
      onSaved?.()
    } catch (error) {
      if (error?.errorFields) {
        return
      }

      message.error(getPermissionGroupErrorMessage(error, t('messages.saveError')))
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
