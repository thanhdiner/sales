import { XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AdminBackButton from '@/components/admin/ui/AdminBackButton'

export default function EmptyState({ onBack }) {
  const { t } = useTranslation('adminOrderDetail')

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[color-mix(in_srgb,#ef4444_30%,var(--admin-border))] bg-[color-mix(in_srgb,#ef4444_14%,var(--admin-surface-2))] text-[#dc2626] dark:text-[#fca5a5]">
        <XCircle className="h-6 w-6" />
      </div>

      <p className="text-base font-semibold text-[var(--admin-text)]">{t('states.notFound')}</p>

      <AdminBackButton className="mt-4" variant="outline" onClick={onBack} label={t('actions.backToList')} />
    </div>
  )
}
