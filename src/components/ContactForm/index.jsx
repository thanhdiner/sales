import React, { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { message, Select } from 'antd'
import { sendContactForm } from '@/services/contactService'

const SUBJECT_OPTIONS = [
  { value: 'product', label: 'Hỏi về sản phẩm' },
  { value: 'order', label: 'Đặt hàng' },
  { value: 'support', label: 'Hỗ trợ kỹ thuật' },
  { value: 'partnership', label: 'Hợp tác' },
  { value: 'other', label: 'Khác' },
]

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
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
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-7">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Gửi tin nhắn cho shop
        </h3>
        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Điền thông tin bên dưới, shop sẽ phản hồi bạn sớm nhất có thể.
        </p>
      </div>

      {submitted ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-10 text-center dark:border-gray-700 dark:bg-gray-900/30">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-green-600 shadow-sm dark:bg-gray-800">
            <CheckCircle className="h-6 w-6" />
          </div>

          <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Cảm ơn bạn!
          </h4>
          <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
            Tin nhắn đã được gửi thành công. Mình sẽ phản hồi sớm nhất có thể!
          </p>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Tên của bạn
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-400"
                placeholder="Nhập tên của bạn"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-400"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Chủ đề
            </label>
            <Select
              name="subject"
              value={formData.subject || undefined}
              onChange={handleSubjectChange}
              placeholder="Chọn chủ đề"
              className="w-full"
              size="large"
              options={SUBJECT_OPTIONS}
              allowClear
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Tin nhắn
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-400"
              placeholder="Nhập tin nhắn của bạn..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
          </button>
        </form>
      )}
    </div>
  )
}

export default ContactForm