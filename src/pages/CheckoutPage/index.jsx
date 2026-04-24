import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { ContactForm } from './ContactForm'
import { StepIndicator } from './StepIndicator'
import { PaymentForm } from './PaymentForm'
import { ReviewOrder } from './ReviewOrder'
import { OrderSummary } from './OrderSummary'
import SEO from '@/components/SEO'
import { syncCartFromServer } from '@/lib/clientCache'
import { buildCheckoutFormDefaults } from '@/lib/checkoutProfile'
import {
  clearCheckoutDraft,
  normalizeCheckoutStep,
  readCheckoutDraft,
  writeCheckoutDraft
} from '@/lib/checkoutDraft'
import {
  hasAnyStructuredVietnamAddressInput,
  hasCompleteStructuredVietnamAddress,
  inferVietnamAddressFromText,
  normalizeVietnamAddress
} from '@/lib/vietnamAddress'
import useVietnamAddress from '@/hooks/useVietnamAddress'
import { removeManyCartItems } from '@/services/cartsService'

const deliveryOptions = [
  {
    id: 'pickup',
    name: 'Nhận hàng tại Website',
    time: 'Trong ngày',
    price: 0,
    description: 'Đến cửa hàng để nhận hàng và thanh toán trực tiếp'
  },
  {
    id: 'contact',
    name: 'Liên hệ riêng',
    time: 'Tùy thỏa thuận',
    price: 0,
    description: 'Chúng tôi sẽ liên hệ để thỏa thuận cách thức giao nhận'
  }
]

const paymentMethods = [
  {
    id: 'transfer',
    name: 'Chuyển khoản ngân hàng',
    description: 'Chuyển khoản trước, nhận hàng sau'
  },
  {
    id: 'vnpay',
    name: 'VNPay',
    description: 'Thanh toán qua cổng VNPay (ATM, Visa, QR)'
  },
  {
    id: 'momo',
    name: 'Ví MoMo',
    description: 'Thanh toán qua Ví điện tử MoMo'
  },
  {
    id: 'zalopay',
    name: 'ZaloPay',
    description: 'Thanh toán qua ứng dụng ZaloPay'
  },
  {
    id: 'contact',
    name: 'Thỏa thuận khi liên hệ',
    description: 'Sẽ thống nhất phương thức thanh toán khi liên hệ'
  }
]

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

const getStepOneError = formData => {
  if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim()) {
    return 'Vui lòng nhập đầy đủ Họ, Tên và Số điện thoại!'
  }

  if (!PHONE_REGEX.test(formData.phone.trim())) {
    return 'Số điện thoại không hợp lệ!'
  }

  if (
    hasAnyStructuredVietnamAddressInput(formData) &&
    !hasCompleteStructuredVietnamAddress(formData)
  ) {
    return 'Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã và nhập địa chỉ chi tiết!'
  }

  return ''
}

const getHighestAllowedStep = formData => (getStepOneError(formData) ? 1 : 3)

const getIncomingPromo = (locationState, draft) => {
  if (locationState?.__fromCart) return locationState.promo || null
  if (Object.prototype.hasOwnProperty.call(locationState || {}, 'promo')) {
    return locationState.promo || null
  }

  return draft?.promo || null
}

export default function CheckoutPage() {
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

  const initialDraft = initialDraftRef.current
  const initialLocationState = location.state || {}
  const initialOrderItems = Array.isArray(initialLocationState.orderItems) && initialLocationState.orderItems.length > 0
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
  const [paymentMethod, setPaymentMethod] = useState(initialDraft?.paymentMethod || 'transfer')
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
      if (key === 'paymentMethod') return value !== 'transfer'
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
    setPaymentMethod(prev => (prev === 'transfer' ? defaults.paymentMethod : prev))
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
    new Intl.NumberFormat('vi-VN', {
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
      const errorMessage = getStepOneError(formData)
      if (errorMessage) {
        message.error(errorMessage)
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
      <SEO title="Thanh toán đơn hàng" noIndex />

      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <button
            type="button"
            className="mb-5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            onClick={() => navigate('/cart')}
          >
            Quay lại giỏ hàng
          </button>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            Thanh toán
          </p>

          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white md:text-4xl">
            Hoàn tất đơn hàng
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300">
            Kiểm tra thông tin nhận hàng, phương thức thanh toán và xác nhận đơn hàng của bạn.
          </p>
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
                  Quay lại
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
                  Tiếp tục
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
