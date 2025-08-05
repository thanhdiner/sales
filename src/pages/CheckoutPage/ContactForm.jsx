import { User, Phone, Mail, Clock } from 'lucide-react'
import { useSelector } from 'react-redux'

export function ContactForm({ formData, handleInputChange, deliveryMethod, setDeliveryMethod, deliveryOptions }) {
  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const contactInfo = websiteConfig?.contactInfo

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin liên hệ</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Họ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName}
            required
            onChange={e => handleInputChange('firstName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Nguyễn"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={e => handleInputChange('lastName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Văn A"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={e => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="0123456789"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email (tùy chọn)
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={e => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
        <textarea
          value={formData.notes}
          onChange={e => handleInputChange('notes', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
          placeholder="Mô tả chi tiết sản phẩm cần mua, thời gian mong muốn nhận hàng, hoặc yêu cầu đặc biệt..."
        />
      </div>

      {/* Delivery Methods */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cách thức nhận hàng</h3>
        <div className="space-y-3">
          {deliveryOptions.map(option => (
            <label
              key={option.id}
              className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                deliveryMethod === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="delivery"
                value={option.id}
                checked={deliveryMethod === option.id}
                onChange={e => setDeliveryMethod(e.target.value)}
                className="w-5 h-5 text-blue-600 mt-1"
              />
              <div className="text-blue-600 mt-1">{option.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{option.name}</div>
                <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4" />
                  {option.time}
                </div>
                <div className="text-sm text-gray-500 mt-2">{option.description}</div>
              </div>
              <div className="font-bold text-green-600">Miễn phí</div>
            </label>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
        <h4 className="font-semibold text-blue-800 mb-2">📍 Thông tin cửa hàng</h4>
        <div className="text-blue-700 space-y-1">
          <p>📧 Email: {contactInfo?.email || '...'}</p>
          <p>📱 Hotline: {contactInfo?.phone || '...'}</p>
          <p>🏪 Địa chỉ: {contactInfo?.address || '...'}</p>
          <p>🕒 Giờ mở cửa: 8:00 - 22:00 hàng ngày</p>
        </div>
      </div>
    </div>
  )
}
