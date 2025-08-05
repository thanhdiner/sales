import { Lock } from 'lucide-react'

export function PaymentForm({ paymentMethod, setPaymentMethod, paymentMethods, formData, handleInputChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Phương thức thanh toán</h2>

      <div className="space-y-3">
        {paymentMethods.map(method => (
          <label
            key={method.id}
            className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              paymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={e => setPaymentMethod(e.target.value)}
              className="w-5 h-5 text-blue-600 mt-1"
            />
            <div className="text-blue-600 mt-1">{method.icon}</div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{method.name}</div>
              <div className="text-sm text-gray-500 mt-1">{method.description}</div>
            </div>
          </label>
        ))}
      </div>

      {paymentMethod === 'transfer' && (
        <div className="mt-6 space-y-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
          <h3 className="font-semibold text-green-800">💳 Thông tin chuyển khoản</h3>
          <div className="text-green-700 space-y-2">
            <p>
              <strong>Ngân hàng:</strong> Vietcombank
            </p>
            <p>
              <strong>Số tài khoản:</strong> 1234567890
            </p>
            <p>
              <strong>Chủ tài khoản:</strong> NGUYEN VAN A
            </p>
            <p>
              <strong>Nội dung:</strong> [Tên khách hàng] - [Số điện thoại]
            </p>
          </div>
          <div className="text-sm text-green-600 bg-green-100 p-3 rounded-lg">
            💡 Vui lòng chuyển khoản đúng nội dung để chúng tôi xác nhận nhanh chóng
          </div>
        </div>
      )}

      {paymentMethod === 'card' && (
        <div className="mt-6 space-y-4 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-800">Thông tin thẻ</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số thẻ</label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={e => handleInputChange('cardNumber', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên trên thẻ</label>
              <input
                type="text"
                value={formData.cardName}
                onChange={e => handleInputChange('cardName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="NGUYEN VAN A"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hết hạn</label>
                <input
                  type="text"
                  value={formData.expiryDate}
                  onChange={e => handleInputChange('expiryDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input
                  type="text"
                  value={formData.cvv}
                  onChange={e => handleInputChange('cvv', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
        <Lock className="w-5 h-5 text-green-600" />
        <span className="text-green-800 font-medium">Thanh toán được bảo mật bằng SSL 256-bit</span>
      </div>
    </div>
  )
}
