import { Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import { getPromoCodeStatusMeta } from '../utils/promoCodeHelpers'

export default function PromoCodeStatusBadge({ promoCode }) {
  const { t } = useTranslation('adminPromoCodes')
  const statusMeta = getPromoCodeStatusMeta(promoCode, t)

  return <Tag color={statusMeta.color}>{statusMeta.label}</Tag>
}
