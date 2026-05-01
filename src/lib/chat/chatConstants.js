import { ShoppingBag, PackageSearch, CreditCard, RotateCcw } from 'lucide-react'

export const getQuickActions = (t) => [
  {
    label: t('quickActions.product.label'),
    text: t('quickActions.product.text'),
    icon: ShoppingBag,
    type: 'chat'
  },
  {
    label: t('quickActions.orderTracking.label'),
    text: t('quickActions.orderTracking.text'),
    icon: PackageSearch,
    type: 'modal',
    actionId: 'order-tracking'
  },
  {
    label: t('quickActions.payment.label'),
    text: t('quickActions.payment.text'),
    icon: CreditCard,
    type: 'chat'
  },
  {
    label: t('quickActions.return.label'),
    text: t('quickActions.return.text'),
    icon: RotateCcw,
    type: 'chat'
  }
]
