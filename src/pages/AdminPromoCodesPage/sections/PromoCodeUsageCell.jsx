import { useTranslation } from 'react-i18next'
import { getPromoCodeUsagePercentage, getUsageText } from '../utils/promoCodeHelpers'

export default function PromoCodeUsageCell({ promoCode, language }) {
  const { t } = useTranslation('adminPromoCodes')
  const usagePercentage = getPromoCodeUsagePercentage(promoCode)

  return (
    <div className="min-w-[96px] text-sm text-[var(--admin-text-muted)]">
      <div className="font-medium text-[var(--admin-text)]">
        {getUsageText(promoCode, language, t)}
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--admin-surface-3)]">
        <div className="h-full rounded-full bg-[var(--admin-accent)]" style={{ width: `${usagePercentage}%` }} />
      </div>
    </div>
  )
}
