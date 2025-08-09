import React, { useState } from 'react'
import { User, Mail, FileText, MessageCircle, Send, CheckCircle } from 'lucide-react'
import { message, Select } from 'antd'
import { sendContactForm } from '@/services/contactService'

const SUBJECT_OPTIONS = [
  { value: 'product', label: 'Hỏi về sản phẩm' },
  { value: 'order', label: 'Đặt hàng' },
  { value: 'support', label: 'Hỗ trợ kỹ thuật' },
  { value: 'partnership', label: 'Hợp tác' },
  { value: 'other', label: 'Khác' }
]

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubjectChange = value => {
    setFormData(prev => ({ ...prev, subject: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!formData.email || !formData.message || !formData.subject) {
      message.error('Vui lòng nhập đầy đủ Email, Chủ đề và Nội dung!')
      return
    }
    setIsSubmitting(true)
    try {
      await sendContactForm(formData)
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      message.success('Gửi tin nhắn thành công!')
    } catch (err) {
      message.error(err.message || 'Đã có lỗi xảy ra, thử lại sau!')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 dark:bg-gray-800 dark:border-gray-600 dark:border-1 dark:border-solid">
      <h3 className="dark:text-gray-100 text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Send className="w-6 h-6 mr-3 text-blue-600" />
        Gửi tin nhắn cho shop
      </h3>
      {submitted ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h4 className="text-xl font-bold text-gray-800 mb-2">Cảm ơn bạn!</h4>
          <p className="text-gray-600">Tin nhắn đã được gửi thành công. Mình sẽ phản hồi sớm nhất có thể!</p>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="block text-gray-700 font-medium mb-2 dark:text-gray-200">
                <User className="w-4 h-4 inline mr-2" />
                Tên của bạn
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-gray-600 dark:focus:border-gray-600 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="Nhập tên của bạn"
              />
            </div>
            <div>
              <div className="block text-gray-700 font-medium mb-2 dark:text-gray-200">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-gray-600 dark:focus:border-gray-600 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div>
            <div className="block text-gray-700 font-medium mb-2 dark:text-gray-200">
              <FileText className="w-4 h-4 inline mr-2" />
              Chủ đề
            </div>
            <Select
              name="subject"
              value={formData.subject}
              onChange={handleSubjectChange}
              placeholder="Chọn chủ đề"
              className="w-full rounded-xl"
              size="large"
              options={SUBJECT_OPTIONS}
              allowClear
            />
          </div>
          <div>
            <div className="block text-gray-700 font-medium mb-2 dark:text-gray-200">
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Tin nhắn
            </div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-gray-600 dark:focus:border-gray-600 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
              placeholder="Nhập tin nhắn của bạn..."
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />
              {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
            </span>
          </button>
        </form>
      )}
    </div>
  )
}

export default ContactForm
