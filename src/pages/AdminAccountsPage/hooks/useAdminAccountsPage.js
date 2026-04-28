import { useCallback, useEffect, useState } from 'react'
import { Form, Upload, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { getAdminRoles } from '@/services/rolesService'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { useModalBodyScroll } from '@/hooks/useModalBodyScroll'
import {
  changeStatusAdminAccount,
  createAdminAccount,
  deleteAdminAccount,
  getAdminAccounts,
  updateAdminAccount
} from '@/services/adminAccountsService'
import {
  ADMIN_ACCOUNT_FORM_INITIAL_VALUES,
  buildAdminAccountFormData,
  getAdminAccountAvatarFileList,
  getAdminAccountRoleId
} from '../utils'

export default function useAdminAccountsPage() {
  const { t } = useTranslation('adminAccounts')
  const language = useCurrentLanguage()
  const [data, setData] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [oldAvatar, setOldAvatar] = useState('')
  const [avatarToDelete, setAvatarToDelete] = useState('')
  const [isRemoveAvatar, setIsRemoveAvatar] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const { bodyStyle, contentRef } = useModalBodyScroll(modalOpen)

  const fetchData = useCallback(async () => {
    setLoading(true)

    try {
      const [accountsResponse, rolesResponse] = await Promise.all([
        getAdminAccounts(),
        getAdminRoles()
      ])

      setData(Array.isArray(accountsResponse?.data) ? accountsResponse.data : [])
      setRoles(Array.isArray(rolesResponse?.data) ? rolesResponse.data : [])
    } catch (error) {
      message.error(t('messages.fetchError'))
    } finally {
      setLoading(false)
    }
  }, [language, t])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  const resetModalState = useCallback(() => {
    setModalOpen(false)
    setEditing(null)
    setOldAvatar('')
    setAvatarToDelete('')
    setIsRemoveAvatar(false)
    form.resetFields()
  }, [form])

  const handleOpenCreate = useCallback(() => {
    setEditing(null)
    setOldAvatar('')
    setAvatarToDelete('')
    setIsRemoveAvatar(false)
    form.resetFields()

    if (roles.length) {
      form.setFieldsValue({
        ...ADMIN_ACCOUNT_FORM_INITIAL_VALUES,
        role_id: roles[0]._id
      })
    } else {
      form.setFieldsValue(ADMIN_ACCOUNT_FORM_INITIAL_VALUES)
    }

    setModalOpen(true)
  }, [form, roles])

  const handleOpenEdit = useCallback((account) => {
    setEditing(account)
    setOldAvatar(account?.avatarUrl || '')
    setAvatarToDelete('')
    setIsRemoveAvatar(false)
    form.setFieldsValue({
      ...account,
      translations: {
        en: {
          fullName: account.translations?.en?.fullName || ''
        }
      },
      role_id: getAdminAccountRoleId(account),
      avatarUrl: getAdminAccountAvatarFileList(account)
    })
    setModalOpen(true)
  }, [form])

  const handleCloseModal = useCallback(() => {
    resetModalState()
  }, [resetModalState])

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields()
      setSubmitLoading(true)

      const formData = buildAdminAccountFormData({
        values,
        editing,
        oldAvatar,
        avatarToDelete,
        isRemoveAvatar
      })

      if (editing) {
        const response = await updateAdminAccount(editing._id, formData)

        setData(prev =>
          prev.map(account => (account._id === response?.data?._id ? response.data : account))
        )
        message.success(t('messages.updateSuccess'))
      } else {
        const response = await createAdminAccount(formData)

        setData(prev => [...prev, response.data])
        message.success(t('messages.createSuccess'))
      }

      resetModalState()
    } catch (error) {
      if (error?.errorFields) return

      if (error?.status === 400 && error?.response?.message) {
        message.error(error.response.message)
      } else {
        message.error(t('messages.saveError'))
      }
    } finally {
      setSubmitLoading(false)
    }
  }, [
    avatarToDelete,
    editing,
    form,
    isRemoveAvatar,
    oldAvatar,
    resetModalState,
    t
  ])

  const handleDelete = useCallback(async (id) => {
    setLoading(true)

    try {
      await deleteAdminAccount(id)
      setData(prev => prev.filter(account => account._id !== id))
      message.success(t('messages.deleteSuccess'))
    } catch (error) {
      if (error?.response?.message) {
        message.error(error.response.message)
      } else {
        message.error(t('messages.deleteError'))
      }
    } finally {
      setLoading(false)
    }
  }, [t])

  const handleChangeStatus = useCallback(async (id, newStatus) => {
    setLoading(true)

    try {
      await changeStatusAdminAccount(id, newStatus)
      setData(prev =>
        prev.map(account => (
          account._id === id ? { ...account, status: newStatus } : account
        ))
      )
      message.success(t('messages.statusSuccess'))
    } catch (error) {
      if (error?.response?.message) {
        message.error(error.response.message)
      } else {
        message.error(t('messages.statusError'))
      }
    } finally {
      setLoading(false)
    }
  }, [t])

  const handleAvatarBeforeUpload = useCallback((file) => {
    setIsRemoveAvatar(false)

    const isImage = file.type?.startsWith('image/')

    if (!isImage) {
      message.error(t('messages.invalidAvatar'))
    }

    return isImage ? false : Upload.LIST_IGNORE
  }, [t])

  const handleAvatarRemove = useCallback(() => {
    setAvatarToDelete(oldAvatar || avatarToDelete)
    setOldAvatar('')
    setIsRemoveAvatar(true)
    return true
  }, [avatarToDelete, oldAvatar])

  return {
    data,
    roles,
    loading,
    modalOpen,
    editing,
    form,
    bodyStyle,
    contentRef,
    submitLoading,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
    handleChangeStatus,
    handleAvatarBeforeUpload,
    handleAvatarRemove
  }
}
