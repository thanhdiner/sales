import { FileText, Mail, MapPin, Phone, User } from 'lucide-react'
import { formatVietnamAddress } from '@/lib/vietnamAddress'

export default function AdminOrderCustomerSection({ contact }) {
  const fullAddress = contact?.address || formatVietnamAddress(contact || {})

  return (
    <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[var(--admin-shadow)]">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--admin-text)]">
        <User className="h-5 w-5 text-[var(--admin-text-muted)]" />
        Thông tin khách hàng
      </h2>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <User className="mt-0.5 h-5 w-5 text-[var(--admin-text-subtle)]" />
          <p className="font-medium text-[var(--admin-text)]">
            {contact?.firstName} {contact?.lastName}
          </p>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 h-5 w-5 text-[var(--admin-text-subtle)]" />
          <p className="text-[var(--admin-text-muted)]">{contact?.phone}</p>
        </div>

        {contact?.email && (
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-[var(--admin-text-subtle)]" />
            <p className="text-[var(--admin-text-muted)]">{contact.email}</p>
          </div>
        )}

        {fullAddress && (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-[var(--admin-text-subtle)]" />
            <p className="text-[var(--admin-text-muted)]">{fullAddress}</p>
          </div>
        )}

        {contact?.notes && (
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-5 w-5 text-[var(--admin-text-subtle)]" />
            <p className="text-[var(--admin-text-muted)]">{contact.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
