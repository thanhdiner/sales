import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Form, message } from 'antd'
import { updateProfile as reduxUpdateProfile } from '@/stores/user'
import { updateClientCheckoutProfile } from '@/services/userService'
import { buildCheckoutFormDefaults, normalizeCheckoutProfile } from '@/lib/checkoutProfile'
import useVietnamAddress from '@/hooks/useVietnamAddress'
import {
  getDistrictOptions,
  getProvinceOptions,
  getWardOptions,
  hasAnyStructuredVietnamAddressInput,
  hasCompleteStructuredVietnamAddress,
  inferVietnamAddressFromText,
  normalizeVietnamAddress
} from '@/lib/vietnamAddress'
import { CHECKOUT_DELIVERY_OPTIONS, CHECKOUT_PAYMENT_OPTIONS } from '../constants'
import { mapLocationOption } from '../utils/profilePageUtils'

export function useCheckoutProfileForm({ checkoutForm, dispatch, t, user }) {
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const checkoutAddressAutofillAttemptedRef = useRef(false)
  const { tree: addressTree, loading: addressLoading, error: addressError } = useVietnamAddress()

  const checkoutProvinceCode = Form.useWatch('provinceCode', checkoutForm)
  const checkoutDistrictCode = Form.useWatch('districtCode', checkoutForm)
  const checkoutAddressLine1 = Form.useWatch('addressLine1', checkoutForm)
  const checkoutProvinceName = Form.useWatch('provinceName', checkoutForm)
  const checkoutDistrictName = Form.useWatch('districtName', checkoutForm)
  const checkoutWardName = Form.useWatch('wardName', checkoutForm)
  const checkoutLegacyAddress = Form.useWatch('address', checkoutForm)

  const checkoutDeliveryOptions = useMemo(
    () =>
      CHECKOUT_DELIVERY_OPTIONS.map(option => ({
        value: option.value,
        label: t(option.labelKey)
      })),
    [t]
  )

  const checkoutPaymentOptions = useMemo(
    () =>
      CHECKOUT_PAYMENT_OPTIONS.map(option => ({
        value: option.value,
        label: t(option.labelKey)
      })),
    [t]
  )

  const provinceOptions = useMemo(() => getProvinceOptions(addressTree).map(mapLocationOption), [addressTree])
  const districtOptions = useMemo(
    () => getDistrictOptions(addressTree, checkoutProvinceCode).map(mapLocationOption),
    [addressTree, checkoutProvinceCode]
  )
  const wardOptions = useMemo(
    () => getWardOptions(addressTree, checkoutProvinceCode, checkoutDistrictCode).map(mapLocationOption),
    [addressTree, checkoutDistrictCode, checkoutProvinceCode]
  )

  const checkoutAddressPreview = normalizeVietnamAddress({
    addressLine1: checkoutAddressLine1,
    provinceCode: checkoutProvinceCode,
    provinceName: checkoutProvinceName,
    districtCode: checkoutDistrictCode,
    districtName: checkoutDistrictName,
    wardName: checkoutWardName,
    address: checkoutLegacyAddress
  }).address

  const syncCheckoutAddressFields = useCallback(
    patch => {
      const nextValues = normalizeVietnamAddress({
        ...checkoutForm.getFieldsValue(true),
        ...patch
      })

      checkoutForm.setFieldsValue(nextValues)
    },
    [checkoutForm]
  )

  useEffect(() => {
    checkoutForm.setFieldsValue(buildCheckoutFormDefaults(user))
    checkoutAddressAutofillAttemptedRef.current = false
  }, [checkoutForm, user])

  useEffect(() => {
    if (!addressTree.length || checkoutAddressAutofillAttemptedRef.current === true) return

    const currentValues = normalizeCheckoutProfile(checkoutForm.getFieldsValue(true))
    checkoutAddressAutofillAttemptedRef.current = true

    if (hasCompleteStructuredVietnamAddress(currentValues)) {
      return
    }

    const inferredAddress = inferVietnamAddressFromText(addressTree, currentValues.address || currentValues.addressLine1)

    if (!inferredAddress) {
      return
    }

    checkoutForm.setFieldsValue({
      ...currentValues,
      ...inferredAddress
    })
  }, [addressTree, checkoutForm])

  const handleSaveCheckoutProfile = useCallback(
    async values => {
      const payload = normalizeCheckoutProfile(values)

      if (hasAnyStructuredVietnamAddressInput(payload) && !hasCompleteStructuredVietnamAddress(payload)) {
        message.error(t('message.checkoutAddressRequired'))
        return
      }

      setCheckoutLoading(true)

      try {
        const res = await updateClientCheckoutProfile(payload)
        dispatch(reduxUpdateProfile(res.data))
        checkoutForm.setFieldsValue(buildCheckoutFormDefaults(res.data))
        message.success(res.message || t('message.checkoutSaveSuccess'))
      } catch (err) {
        message.error(err?.message || t('message.checkoutSaveFailed'))
      } finally {
        setCheckoutLoading(false)
      }
    },
    [checkoutForm, dispatch, t]
  )

  const handleRestoreCheckoutProfile = useCallback(() => {
    checkoutForm.setFieldsValue(buildCheckoutFormDefaults(user))
  }, [checkoutForm, user])

  return {
    addressError,
    addressLoading,
    checkoutAddressPreview,
    checkoutDeliveryOptions,
    checkoutDistrictCode,
    checkoutLoading,
    checkoutPaymentOptions,
    checkoutProvinceCode,
    districtOptions,
    handleRestoreCheckoutProfile,
    handleSaveCheckoutProfile,
    provinceOptions,
    syncCheckoutAddressFields,
    wardOptions
  }
}
