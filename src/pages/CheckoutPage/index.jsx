import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CreditCard, Package, Phone, ArrowLeft } from 'lucide-react'
import { ContactForm } from './ContactForm'
import { StepIndicator } from './StepIndicator'
import { PaymentForm } from './PaymentForm'
import { ReviewOrder } from './ReviewOrder'
import { OrderSummary } from './OrderSummary'
import { useDispatch } from 'react-redux'
import { getCart, removeManyCartItems } from '@/services/cartsService'
import { setCart } from '@/stores/cart'
import { message } from 'antd'
import titles from '@/utils/titles'

const deliveryOptions = [
  {
    id: 'pickup',
    name: 'Nhận hàng tại Website',
    time: 'Trong ngày',
    price: 0,
    icon: <Package className="w-5 h-5" />,
    description: 'Đến cửa hàng để nhận hàng và thanh toán trực tiếp'
  },
  {
    id: 'contact',
    name: 'Liên hệ riêng',
    time: 'Tùy thỏa thuận',
    price: 0,
    icon: <Phone className="w-5 h-5" />,
    description: 'Chúng tôi sẽ liên hệ để thỏa thuận cách thức giao nhận'
  }
]

const paymentMethods = [
  {
    id: 'transfer',
    name: 'Chuyển khoản ngân hàng',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Chuyển khoản trước, nhận hàng sau'
  },
  {
    id: 'contact',
    name: 'Thỏa thuận khi liên hệ',
    icon: <Phone className="w-5 h-5" />,
    description: 'Sẽ thống nhất phương thức thanh toán khi liên hệ'
  }
]

export default function CheckoutPage() {
  titles('Thanh toán đơn hàng')

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { orderItems = [], promo: promoState, __fromCart } = location.state || {}
  // Chỉ nhận promo nếu đi từ CartPage
  const [promo, setPromo] = useState(__fromCart ? promoState || null : null)

  useEffect(() => {
    if (!location.state?.__fromCart) setPromo(null)
    // eslint-disable-next-line
  }, [location.key])

  useEffect(() => {
    if (!orderItems || orderItems.length === 0) navigate('/cart', { replace: true })
    // eslint-disable-next-line
  }, [])

  // Bước form và dữ liệu
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('transfer')
  const [deliveryMethod, setDeliveryMethod] = useState('pickup')
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    notes: ''
  })

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = promo?.discount || 0
  const shipping = subtotal > 100000 ? 0 : 50000
  const total = subtotal - discount + shipping

  const formatPrice = price => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleOrderSuccess = async order => {
    const orderedProductIds = order.orderItems.map(i => i.productId)
    await removeManyCartItems({ productIds: orderedProductIds })
    const newCart = await getCart()
    dispatch(setCart(newCart.items.map(item => ({ ...item, id: item.productId }))))
    setPromo(null)
    navigate('/order-success', {
      state: { orderId: order._id },
      replace: true
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-200"
            onClick={() => navigate('/cart')}
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại giỏ hàng
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Thanh toán</h1>
          <p className="text-gray-600">Hoàn tất đơn hàng của bạn</p>
        </div>

        <StepIndicator step={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
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

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-all duration-200"
                >
                  Quay lại
                </button>
              )}
              {step < 3 && (
                <button
                  onClick={() => {
                    if (step === 1) {
                      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim()) {
                        message.error('Vui lòng nhập đầy đủ Họ, Tên và Số điện thoại!')
                        return
                      }
                      // Validate số điện thoại cơ bản (tùy bạn customize)
                      if (!/^(0|\+?84)(\d{9})$/.test(formData.phone.trim())) {
                        message.error('Số điện thoại không hợp lệ!')
                        return
                      }
                    }
                    setStep(step + 1)
                  }}
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Tiếp tục
                </button>
              )}
            </div>
          </div>

          {/* Order Summary */}
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
