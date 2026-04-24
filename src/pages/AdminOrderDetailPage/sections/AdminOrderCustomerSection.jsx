import { FileText, Mail, MapPin, Phone, User } from 'lucide-react'
import { formatVietnamAddress } from '@/lib/vietnamAddress'

export default function AdminOrderCustomerSection({ contact }) {
  const fullAddress = contact?.address || formatVietnamAddress(contact || {})

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
        <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        Thông tin khách hàng
      </h2>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <User className="mt-0.5 h-5 w-5 text-gray-400" />
          <p className="font-medium text-gray-900 dark:text-white">
            {contact?.firstName} {contact?.lastName}
          </p>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 h-5 w-5 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">{contact?.phone}</p>
        </div>

        {contact?.email && (
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">{contact.email}</p>
          </div>
        )}

        {fullAddress && (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">{fullAddress}</p>
          </div>
        )}

        {contact?.notes && (
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-5 w-5 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">{contact.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
