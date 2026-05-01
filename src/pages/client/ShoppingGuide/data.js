import { Search, UserPlus, CreditCard, Truck, Wallet, Landmark } from 'lucide-react'

export const shoppingGuideViewport = { once: true, amount: 0.2 }

export const shoppingGuideHeroImage =
  'https://images.unsplash.com/photo-1634733988596-093e2a324c2f?auto=format&fit=crop&w=1600&q=82'

export const shoppingGuideTipsImage =
  'https://images.unsplash.com/photo-1743529628081-6777a326a4e5?auto=format&fit=crop&w=1400&q=82'

export const shoppingGuideSteps = [
  {
    titleKey: 'steps.chooseProduct.title',
    contentKey: 'steps.chooseProduct.content',
    icon: Search
  },
  {
    titleKey: 'steps.login.title',
    contentKey: 'steps.login.content',
    icon: UserPlus
  },
  {
    titleKey: 'steps.payment.title',
    contentKey: 'steps.payment.content',
    icon: CreditCard
  },
  {
    titleKey: 'steps.delivery.title',
    contentKey: 'steps.delivery.content',
    icon: Truck
  }
]

export const shoppingGuidePaymentMethods = [
  {
    nameKey: 'paymentMethods.wallet.name',
    descKey: 'paymentMethods.wallet.desc',
    popular: true,
    icon: Wallet,
    badges: ['MoMo', 'ZaloPay', 'ViettelPay']
  },
  {
    nameKey: 'paymentMethods.bankTransfer.name',
    descKey: 'paymentMethods.bankTransfer.desc',
    popular: true,
    icon: Landmark,
    badges: ['24/7 Instant Transfer']
  }
]

export const shoppingGuideDetailedSteps = [
  {
    idKey: 'detailedSteps.search.id',
    titleKey: 'detailedSteps.search.title',
    descriptionKey: 'detailedSteps.search.description',
    chipsKey: 'detailedSteps.search.chips',
    image:
      'https://images.unsplash.com/photo-1691073121676-1ab3a6d3d743?auto=format&fit=crop&w=1400&q=82',
    reverse: false
  },
  {
    idKey: 'detailedSteps.cart.id',
    titleKey: 'detailedSteps.cart.title',
    descriptionKey: 'detailedSteps.cart.description',
    checksKey: 'detailedSteps.cart.checks',
    image:
      'https://images.unsplash.com/photo-1769355104335-acef3aa4c9b6?auto=format&fit=crop&w=1400&q=82',
    reverse: true
  },
  {
    idKey: 'detailedSteps.checkout.id',
    titleKey: 'detailedSteps.checkout.title',
    descriptionKey: 'detailedSteps.checkout.description',
    noteKey: 'detailedSteps.checkout.note',
    image:
      'https://images.unsplash.com/photo-1757301714935-c8127a21abc6?auto=format&fit=crop&w=1400&q=82',
    reverse: false
  }
]

export const shoppingGuideSmartTips = [
  'smartTips.comparePrice',
  'smartTips.returnPolicy',
  'smartTips.checkInfo',
  'smartTips.flashSale',
  'smartTips.coupons'
]

export const shoppingGuideFaqData = [
  {
    questionKey: 'faq.trackOrder.question',
    answerKey: 'faq.trackOrder.answer'
  },
  {
    questionKey: 'faq.deliveryTime.question',
    answerKey: 'faq.deliveryTime.answer'
  },
  {
    questionKey: 'faq.returnProduct.question',
    answerKey: 'faq.returnProduct.answer'
  },
  {
    questionKey: 'faq.shippingFee.question',
    answerKey: 'faq.shippingFee.answer'
  }
]
