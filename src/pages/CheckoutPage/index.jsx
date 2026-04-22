import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ContactForm } from './ContactForm'
import { StepIndicator } from './StepIndicator'
import { PaymentForm } from './PaymentForm'
import { ReviewOrder } from './ReviewOrder'
import { OrderSummary } from './OrderSummary'
import { useDispatch } from 'react-redux'
import { syncCartFromServer } from '@/lib/clientCache'
import { removeManyCartItems } from '@/services/cartsService'
import { message } from 'antd'
import SEO from '@/components/SEO'

const deliveryOptions = [
  {
    id: 'pickup',
    name: 'Nhận hàng tại Website',
    time: 'Trong ngày',
    price: 0,
    description: 'Đến cửa hàng để nhận hàng và thanh toán trực tiếp',
  },
  {
    id: 'contact',
    name: 'Liên hệ riêng',
    time: 'Tùy thỏa thuận',
    price: 0,
    description: 'Chúng tôi sẽ liên hệ để thỏa thuận cách thức giao nhận',
  },
]

const paymentMethods = [
  {
    id: 'transfer',
    name: 'Chuyển khoản ngân hàng',
    description: 'Chuyển khoản trước, nhận hàng sau',
  },
  {
    id: 'vnpay',
    name: 'VNPay',
    description: 'Thanh toán qua cổng VNPay (ATM, Visa, QR)',
  },
  {
    id: 'momo',
    name: 'Ví MoMo',
    description: 'Thanh toán qua Ví điện tử MoMo',
  },
  {
    id: 'zalopay',
    name: 'ZaloPay',
    description: 'Thanh toán qua ứng dụng ZaloPay',
  },
  {
    id: 'contact',
    name: 'Thỏa thuận khi liên hệ',
    description: 'Sẽ thống nhất phương thức thanh toán khi liên hệ',
  },
]

export default function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { orderItems = [], promo: promoState, __fromCart } = location.state || {}
  const [promo, setPromo] = useState(__fromCart ? promoState || null : null)

  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('transfer')
  const [deliveryMethod, setDeliveryMethod] = useState('pickup')
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    notes: '',
  })

  useEffect(() => {
    if (!location.state?.__fromCart) setPromo(null)
    // eslint-disable-next-line
  }, [location.key])

  useEffect(() => {
    if (!orderItems || orderItems.length === 0) {
      navigate('/cart', { replace: true })
    }
    // eslint-disable-next-line
  }, [])

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = promo?.discount || 0
  const shipping = subtotal > 100000 ? 0 : 50000
  const total = subtotal - discount + shipping

  const formatPrice = price =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleOrderSuccess = async order => {
    const orderedProductIds = order.orderItems.map(item => item.productId)

    await removeManyCartItems({ productIds: orderedProductIds })
    await syncCartFromServer(dispatch)

    setPromo(null)
    navigate('/order-success', {
      state: { orderId: order._id },
      replace: true,
    })
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim()) {
        message.error('Vui lòng nhập đầy đủ Họ, Tên và Số điện thoại!')
        return
      }

      if (!/^(0|\+?84)(\d{9})$/.test(formData.phone.trim())) {
        message.error('Số điện thoại không hợp lệ!')
        return
      }
    }

    setStep(prev => prev + 1)
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
                  onClick={() => setStep(prev => prev - 1)}
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