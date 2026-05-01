import { FileText, Mail, MapPin, Phone, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatVietnamAddress } from '@/lib/address/vietnamAddress'

export default function OrderCustomer({ contact }) {
  const { t } = useTranslation('adminOrderDetail')
  const fullAddress = contact?.address || formatVietnamAddress(contact || {})
  const customerName = [contact?.firstName, contact?.lastName].filter(Boolean).join(' ') || t('customer.guest')

  return (
    <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] sm:p-5">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--admin-text)]">
        <User className="h-5 w-5 text-[var(--admin-text-muted)]" />
        {t('customer.title')}
      </h2>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <User className="mt-0.5 h-5 w-5 text-[var(--admin-text-subtle)]" />
          <p className="font-medium text-[var(--admin-text)]">{customerName}</p>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 h-5 w-5 text-[var(--admin-text-subtle)]" />
          <p className="text-[var(--admin-text-muted)]">{contact?.phone || '--'}</p>
        </div>

        {contact?.email && (
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-[var(--admin-text-subtle)]" />
            <p className="break-all text-[var(--admin-text-muted)]">{contact.email}</p>
          </div>
        )}

        {fullAddress && (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-[var(--admin-text-subtle)]" />
            <p className="break-words text-[var(--admin-text-muted)]">{fullAddress}</p>
          </div>
        )}

        {contact?.notes && (
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-5 w-5 text-[var(--admin-text-subtle)]" />
            <p className="break-words whitespace-pre-wrap text-[var(--admin-text-muted)]">{contact.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
