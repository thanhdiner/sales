import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { ContactForm } from './ContactForm'
import { StepIndicator } from './StepIndicator'
import { PaymentForm } from './PaymentForm'
import { ReviewOrder } from './ReviewOrder'
import { OrderSummary } from './OrderSummary'
import SEO from '@/components/SEO'
import { syncCartFromServer } from '@/lib/clientCache'
import { buildCheckoutFormDefaults } from '@/lib/checkoutProfile'
import { clearCheckoutDraft, normalizeCheckoutStep, readCheckoutDraft, writeCheckoutDraft } from '@/lib/checkoutDraft'
import {
  hasAnyStructuredVietnamAddressInput,
  hasCompleteStructuredVietnamAddress,
  inferVietnamAddressFromText,
  normalizeVietnamAddress
} from '@/lib/vietnamAddress'
import useVietnamAddress from '@/hooks/useVietnamAddress'
import { removeManyCartItems } from '@/services/cartsService'

const EMPTY_FORM_DATA = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  addressLine1: '',
  provinceCode: '',
  provinceName: '',
  districtCode: '',
  districtName: '',
  wardCode: '',
  wardName: '',
  address: '',
  notes: ''
}

const PHONE_REGEX = /^(0|\+?84)(\d{9})$/
const ONLINE_PAYMENT_METHODS = ['vnpay', 'momo', 'zalopay', 'sepay']
const normalizeCheckoutPaymentMethod = value =>
  ONLINE_PAYMENT_METHODS.includes(value) ? value : 'vnpay'

const getStepOneErrorKey = formData => {
  if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim()) {
    return 'validation.requiredContact'
  }

  if (!PHONE_REGEX.test(formData.phone.trim())) {
    return 'validation.invalidPhone'
  }

  if (hasAnyStructuredVietnamAddressInput(formData) && !hasCompleteStructuredVietnamAddress(formData)) {
    return 'validation.requiredAddress'
  }

  return ''
}

const getHighestAllowedStep = formData => (getStepOneErrorKey(formData) ? 1 : 3)

const getIncomingPromo = (locationState, draft) => {
  if (locationState?.__fromCart) return locationState.promo || null
  if (Object.prototype.hasOwnProperty.call(locationState || {}, 'promo')) {
    return locationState.promo || null
  }

  return draft?.promo || null
}

export default function CheckoutPage() {
  const { t, i18n } = useTranslation('clientCheckout')
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const clientUser = useSelector(state => state.clientUser.user)
  const checkoutDefaultsHydratedRef = useRef(false)
  const checkoutAddressAutofillAttemptedRef = useRef(false)
  const initialDraftRef = useRef(readCheckoutDraft())
  const stepScrollInitializedRef = useRef(false)
  const { tree: addressTree } = useVietnamAddress()
  const queryStep = searchParams.get('step')

  const deliveryOptions = useMemo(
    () => [
      {
        id: 'pickup',
        name: t('deliveryOptions.pickup.name'),
        time: t('deliveryOptions.pickup.time'),
        price: 0,
        description: t('deliveryOptions.pickup.description')
      },
      {
        id: 'contact',
        name: t('deliveryOptions.contact.name'),
        time: t('deliveryOptions.contact.time'),
        price: 0,
        description: t('deliveryOptions.contact.description')
      }
    ],
    [t]
  )

  const paymentMethods = useMemo(
    () => [
      {
        id: 'vnpay',
        name: t('paymentMethods.vnpay.name'),
        description: t('paymentMethods.vnpay.description')
      },
      {
        id: 'momo',
        name: t('paymentMethods.momo.name'),
        description: t('paymentMethods.momo.description')
      },
      {
        id: 'zalopay',
        name: t('paymentMethods.zalopay.name'),
        description: t('paymentMethods.zalopay.description')
      },
      {
        id: 'sepay',
        name: t('paymentMethods.sepay.name'),
        description: t('paymentMethods.sepay.description')
      }
    ],
    [t]
  )

  const initialDraft = initialDraftRef.current
  const initialLocationState = location.state || {}
  const initialOrderItems =
    Array.isArray(initialLocationState.orderItems) && initialLocationState.orderItems.length > 0
      ? initialLocationState.orderItems
      : Array.isArray(initialDraft?.orderItems)
        ? initialDraft.orderItems
        : []

  const [orderItems, setOrderItems] = useState(initialOrderItems)
  const [promo, setPromo] = useState(getIncomingPromo(initialLocationState, initialDraft))
  const [step, setStep] = useState(() => {
    if (searchParams.has('step')) return normalizeCheckoutStep(searchParams.get('step'))
    return normalizeCheckoutStep(initialDraft?.step || 1)
  })
  const [paymentMethod, setPaymentMethod] = useState(() => normalizeCheckoutPaymentMethod(initialDraft?.paymentMethod))
  const [deliveryMethod, setDeliveryMethod] = useState(initialDraft?.deliveryMethod || 'pickup')
  const [formData, setFormData] = useState({
    ...EMPTY_FORM_DATA,
    ...(initialDraft?.formData || {})
  })

  useEffect(() => {
    const locationState = location.state || {}
    if (!Array.isArray(locationState.orderItems) || locationState.orderItems.length === 0) return

    setOrderItems(locationState.orderItems)
    setPromo(getIncomingPromo(locationState, null))
    setStep(1)
  }, [location.key, location.state])

  useEffect(() => {
    if (checkoutDefaultsHydratedRef.current) return

    const defaults = buildCheckoutFormDefaults(clientUser)
    const hasProfileDefaults = Object.entries(defaults).some(([key, value]) => {
      if (key === 'deliveryMethod') return value === 'contact'
      if (key === 'paymentMethod') return value !== 'vnpay'
      return typeof value === 'string' && value.length > 0
    })

    if (!hasProfileDefaults) {
      checkoutDefaultsHydratedRef.current = true
      return
    }

    setFormData(prev => ({
      ...prev,
      email: prev.email || defaults.email,
      firstName: prev.firstName || defaults.firstName,
      lastName: prev.lastName || defaults.lastName,
      phone: prev.phone || defaults.phone,
      addressLine1: prev.addressLine1 || defaults.addressLine1,
      provinceCode: prev.provinceCode || defaults.provinceCode,
      provinceName: prev.provinceName || defaults.provinceName,
      districtCode: prev.districtCode || defaults.districtCode,
      districtName: prev.districtName || defaults.districtName,
      wardCode: prev.wardCode || defaults.wardCode,
      wardName: prev.wardName || defaults.wardName,
      address: prev.address || defaults.address,
      notes: prev.notes || defaults.notes
    }))
    setDeliveryMethod(prev => (prev === 'pickup' ? defaults.deliveryMethod : prev))
    setPaymentMethod(prev => (prev === 'vnpay' ? normalizeCheckoutPaymentMethod(defaults.paymentMethod) : normalizeCheckoutPaymentMethod(prev)))
    checkoutAddressAutofillAttemptedRef.current = false
    checkoutDefaultsHydratedRef.current = true
  }, [clientUser])

  useEffect(() => {
    if (!addressTree.length || checkoutAddressAutofillAttemptedRef.current === true) return

    setFormData(prev => {
      checkoutAddressAutofillAttemptedRef.current = true

      if (hasCompleteStructuredVietnamAddress(prev)) {
        return prev
      }

      const inferredAddress = inferVietnamAddressFromText(addressTree, prev.address || prev.addressLine1)
      if (!inferredAddress) {
        if (!prev.addressLine1 && prev.address) {
          return {
            ...prev,
            addressLine1: prev.address
          }
        }

        return prev
      }

      return {
        ...prev,
        ...inferredAddress
      }
    })
  }, [addressTree])

  useEffect(() => {
    if (!orderItems.length) {
      clearCheckoutDraft()
      navigate('/cart', { replace: true })
    }
  }, [navigate, orderItems])

  useEffect(() => {
    if (!queryStep) return

    setStep(prevStep => {
      const normalizedUrlStep = normalizeCheckoutStep(queryStep)
      return normalizedUrlStep === prevStep ? prevStep : normalizedUrlStep
    })
  }, [queryStep])

  useEffect(() => {
    const allowedStep = getHighestAllowedStep(formData)
    if (step > allowedStep) {
      setStep(allowedStep)
    }
  }, [formData, step])

  useEffect(() => {
    if (queryStep && normalizeCheckoutStep(queryStep) === step) return

    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('step', String(step))
    setSearchParams(nextParams, { replace: true })
  }, [queryStep, searchParams, setSearchParams, step])

  useEffect(() => {
    if (!orderItems.length) return

    writeCheckoutDraft({
      step,
      paymentMethod,
      deliveryMethod,
      formData,
      promo,
      orderItems
    })
  }, [deliveryMethod, formData, orderItems, paymentMethod, promo, step])

  useEffect(() => {
    if (!stepScrollInitializedRef.current) {
      stepScrollInitializedRef.current = true
      return
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [step])

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = promo?.discount || 0
  const shipping = subtotal > 100000 ? 0 : 50000
  const total = subtotal - discount + shipping

  const formatPrice = price =>
    new Intl.NumberFormat(i18n.language === 'en' ? 'en-US' : 'vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddressChange = patch => {
    setFormData(prev => ({
      ...prev,
      ...normalizeVietnamAddress({
        ...prev,
        ...patch
      })
    }))
  }

  const handleOrderSuccess = async order => {
    const orderedProductIds = order.orderItems.map(item => item.productId)

    await removeManyCartItems({ productIds: orderedProductIds })
    await syncCartFromServer(dispatch)

    clearCheckoutDraft()
    setPromo(null)
    navigate('/order-success', {
      state: { orderId: order._id },
      replace: true
    })
  }

  const handleNextStep = () => {
    if (step === 1) {
      const errorKey = getStepOneErrorKey(formData)
      if (errorKey) {
        message.error(t(errorKey))
        return
      }
    }

    setStep(prev => normalizeCheckoutStep(prev + 1))
  }

  const handlePreviousStep = () => {
    setStep(prev => normalizeCheckoutStep(prev - 1))
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10 dark:bg-gray-900">
      <SEO title={t('seo.title')} noIndex />

      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <button
            type="button"
            className="mb-5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            onClick={() => navigate('/cart')}
          >
            {t('header.backToCart')}
          </button>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">{t('header.eyebrow')}</p>

          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white md:text-4xl">{t('header.title')}</h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300">{t('header.description')}</p>
        </header>

        <StepIndicator step={step} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {step === 1 && (
              <ContactForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleAddressChange={handleAddressChange}
                deliveryMethod={deliveryMethod}
                setDeliveryMethod={setDeliveryMethod}
                deliveryOptions={deliveryOptions}
              />
            )}

            {step === 2 && (
              <PaymentForm
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                paymentMethods={paymentMethods}
                formData={formData}
                handleInputChange={handleInputChange}
              />
            )}

            {step === 3 && (
              <ReviewOrder
                formData={formData}
                paymentMethod={paymentMethod}
                paymentMethods={paymentMethods}
                deliveryMethod={deliveryMethod}
                deliveryOptions={deliveryOptions}
                orderItems={orderItems}
                subtotal={subtotal}
                discount={discount}
                shipping={shipping}
                total={total}
                formatPrice={formatPrice}
                promo={promo}
                onOrderSuccess={handleOrderSuccess}
              />
            )}

            <div className="mt-6 flex justify-between gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  {t('button.back')}
                </button>
              ) : (
                <span />
              )}

              {step < 3 && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
                >
                  {t('button.continue')}
                </button>
              )}
            </div>
          </div>

          <div>
            <OrderSummary
              orderItems={orderItems}
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              total={total}
              formatPrice={formatPrice}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
