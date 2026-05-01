import { useTranslation } from 'react-i18next'
import { getConditionItems } from '../utils/promoCodeHelpers'

export default function PromoCodeConditionsCell({ promoCode, language }) {
  const { t } = useTranslation('adminPromoCodes')
  const conditions = getConditionItems(promoCode, language, t)

  if (!conditions.length) {
    return <span className="text-sm text-[var(--admin-text-subtle)]">{t('table.noConditions')}</span>
  }

  return (
    <div className="space-y-1 text-sm text-[var(--admin-text-muted)]">
      {conditions.map(condition => (
        <div key={condition}>{condition}</div>
      ))}
    </div>
  )
}
