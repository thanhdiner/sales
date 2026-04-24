import React from 'react'
import { formatVietnamAddress } from '@/lib/vietnamAddress'

const InfoCard = ({ label, value, fullWidth = false, breakAll = false }) => {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30 ${
        fullWidth ? 'sm:col-span-2' : ''
      }`}
    >
      <p className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
      <p className={`mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300 ${breakAll ? 'break-all' : ''}`}>{value}</p>
    </div>
  )
}

const OrderDeliveryInfoSection = ({ contact = {} }) => {
  const fullAddress = contact.address || formatVietnamAddress(contact)

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Thông tin liên hệ</h2>
        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Shop dùng thông tin này để xác nhận đơn và bàn giao tài khoản số cho bạn.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoCard label="Họ tên" value={`${contact.firstName || ''} ${contact.lastName || ''}`.trim()} />
        <InfoCard label="Số điện thoại" value={contact.phone} />

        {contact.email && <InfoCard label="Email" value={contact.email} breakAll />}
        {fullAddress && <InfoCard label="Địa chỉ" value={fullAddress} fullWidth />}

        {contact.notes && <InfoCard label="Ghi chú" value={contact.notes} fullWidth />}
      </div>
    </section>
  )
}

export default OrderDeliveryInfoSection
