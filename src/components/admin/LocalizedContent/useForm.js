import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

export const defaultGetResponseData = response => response?.data || null

export function useLocalizedContentForm({
  buildPayload,
  context,
  form,
  getContent,
  getInitialValues,
  getResponseData = defaultGetResponseData,
  onSaved,
  queryKey,
  resolvedTextParams,
  t,
  updateContent
}) {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState(null)

  const resolveInitialValues = useCallback(data => (
    typeof getInitialValues === 'function' ? getInitialValues(data, context) : {}
  ), [context, getInitialValues])

  const fetchContent = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getContent(context)
      const data = getResponseData(response, context)

      setContent(data)
      form.setFieldsValue(resolveInitialValues(data))
    } catch {
      setContent(null)
      form.setFieldsValue(resolveInitialValues(null))
      message.error(t('messages.fetchError', resolvedTextParams))
    } finally {
      setLoading(false)
    }
  }, [context, form, getContent, getResponseData, resolveInitialValues, resolvedTextParams, t])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const handleSubmit = async () => {
    const values = form.getFieldsValue(true)
    const payload = typeof buildPayload === 'function'
      ? buildPayload(values, context)
      : {
          ...(values.content || {}),
          translations: {
            en: values.translations?.en || {}
          }
        }

    setSaving(true)

    try {
      const response = await updateContent(payload, context)
      const savedContent = getResponseData(response, context)

      setContent(savedContent)
      form.setFieldsValue(resolveInitialValues(savedContent))

      const resolvedQueryKey = typeof queryKey === 'function' ? queryKey(context, savedContent) : queryKey
      if (resolvedQueryKey) {
        queryClient.invalidateQueries({ queryKey: resolvedQueryKey })
      }

      if (typeof onSaved === 'function') {
        onSaved({ response, savedContent, queryClient, context })
      }

      message.success(t('messages.saveSuccess', resolvedTextParams))
    } catch (error) {
      message.error(error.message || t('messages.saveError', resolvedTextParams))
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    form.setFieldsValue(resolveInitialValues(content))
    message.info(t('messages.resetDone', resolvedTextParams))
  }

  return {
    fetchContent,
    handleReset,
    handleSubmit,
    loading,
    saving
  }
}
