import { useCallback, useEffect, useState } from 'react'
import { Form, Upload, message } from 'antd'
import { getAdminRoles } from '@/services/rolesService'
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
      message.error('Không thể tải danh sách tài khoản.')
    } finally {
      setLoading(false)
    }
  }, [])

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
        message.success('Cập nhật tài khoản thành công!')
      } else {
        const response = await createAdminAccount(formData)

        setData(prev => [...prev, response.data])
        message.success('Tạo tài khoản mới thành công!')
      }

      resetModalState()
    } catch (error) {
      if (error?.errorFields) return

      if (error?.status === 400 && error?.response?.message) {
        message.error(error.response.message)
      } else {
        message.error('Failed to save account')
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
    resetModalState
  ])

  const handleDelete = useCallback(async (id) => {
    setLoading(true)

    try {
      await deleteAdminAccount(id)
      setData(prev => prev.filter(account => account._id !== id))
      message.success('Đã xoá tài khoản.')
    } catch (error) {
      if (error?.response?.message) {
        message.error(error.response.message)
      } else {
        message.error('Xoá thất bại!')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChangeStatus = useCallback(async (id, newStatus) => {
    setLoading(true)

    try {
      await changeStatusAdminAccount(id, newStatus)
      setData(prev =>
        prev.map(account => (
          account._id === id ? { ...account, status: newStatus } : account
        ))
      )
      message.success('Cập nhật trạng thái thành công!')
    } catch (error) {
      if (error?.response?.message) {
        message.error(error.response.message)
      } else {
        message.error('Cập nhật trạng thái thất bại!')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const handleAvatarBeforeUpload = useCallback((file) => {
    setIsRemoveAvatar(false)

    const isImage = file.type?.startsWith('image/')

    if (!isImage) {
      message.error('You can only upload avatar image files!')
    }

    return isImage ? false : Upload.LIST_IGNORE
  }, [])

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
