import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  SearchOutlined,
  SafetyOutlined,
  TruckOutlined,
} from '@ant-design/icons'

export const returnPolicyPhysicalSteps = [
  {
    titleKey: 'process.physical.steps.request.title',
    descriptionKey: 'process.physical.steps.request.description',
    icon: FileTextOutlined,
  },
  {
    titleKey: 'process.physical.steps.confirm.title',
    descriptionKey: 'process.physical.steps.confirm.description',
    icon: CheckCircleOutlined,
  },
  {
    titleKey: 'process.physical.steps.ship.title',
    descriptionKey: 'process.physical.steps.ship.description',
    icon: TruckOutlined,
  },
  {
    titleKey: 'process.physical.steps.inspect.title',
    descriptionKey: 'process.physical.steps.inspect.description',
    icon: ExclamationCircleOutlined,
  },
  {
    titleKey: 'process.physical.steps.complete.title',
    descriptionKey: 'process.physical.steps.complete.description',
    icon: DollarOutlined,
  },
]

export const returnPolicyOnlineSteps = [
  {
    titleKey: 'process.online.steps.request.title',
    descriptionKey: 'process.online.steps.request.description',
    icon: FileTextOutlined,
  },
  {
    titleKey: 'process.online.steps.verify.title',
    descriptionKey: 'process.online.steps.verify.description',
    icon: SearchOutlined,
  },
  {
    titleKey: 'process.online.steps.handle.title',
    descriptionKey: 'process.online.steps.handle.description',
    icon: SafetyOutlined,
  },
  {
    titleKey: 'process.online.steps.complete.title',
    descriptionKey: 'process.online.steps.complete.description',
    icon: CheckCircleOutlined,
  },
]

export const returnPolicyReturnReasons = [
  { value: 'defective', labelKey: 'returnReasons.defective', color: 'red' },
  { value: 'wrong-item', labelKey: 'returnReasons.wrongItem', color: 'orange' },
  { value: 'not-as-described', labelKey: 'returnReasons.notAsDescribed', color: 'yellow' },
  { value: 'size-issue', labelKey: 'returnReasons.sizeIssue', color: 'blue' },
  { value: 'change-mind', labelKey: 'returnReasons.changeMind', color: 'green' },
  { value: 'damaged-shipping', labelKey: 'returnReasons.damagedShipping', color: 'purple' },
]

export const returnPolicyRefundMethods = [
  {
    key: 'bankTransfer',
    methodKey: 'refundMethods.bankTransfer.method',
    timeKey: 'refundMethods.bankTransfer.time',
    feeKey: 'refundMethods.bankTransfer.fee',
    icon: '🏦',
    popular: true,
  },
  {
    key: 'eWallet',
    methodKey: 'refundMethods.eWallet.method',
    timeKey: 'refundMethods.eWallet.time',
    feeKey: 'refundMethods.eWallet.fee',
    icon: '📱',
    popular: true,
  },
  {
    key: 'cash',
    methodKey: 'refundMethods.cash.method',
    timeKey: 'refundMethods.cash.time',
    feeKey: 'refundMethods.cash.fee',
    icon: '💵',
    popular: false,
  },
]

export const returnPolicyProductCategories = [
  {
    key: 'electronics',
    categoryKey: 'productCategories.electronics.category',
    returnPeriodKey: 'productCategories.electronics.returnPeriod',
    conditionsKey: 'productCategories.electronics.conditions',
    specialNotesKey: 'productCategories.electronics.specialNotes',
  },
  {
    key: 'fashion',
    categoryKey: 'productCategories.fashion.category',
    returnPeriodKey: 'productCategories.fashion.returnPeriod',
    conditionsKey: 'productCategories.fashion.conditions',
    specialNotesKey: 'productCategories.fashion.specialNotes',
  },
  {
    key: 'beauty',
    categoryKey: 'productCategories.beauty.category',
    returnPeriodKey: 'productCategories.beauty.returnPeriod',
    conditionsKey: 'productCategories.beauty.conditions',
    specialNotesKey: 'productCategories.beauty.specialNotes',
  },
  {
    key: 'homeAppliance',
    categoryKey: 'productCategories.homeAppliance.category',
    returnPeriodKey: 'productCategories.homeAppliance.returnPeriod',
    conditionsKey: 'productCategories.homeAppliance.conditions',
    specialNotesKey: 'productCategories.homeAppliance.specialNotes',
  },
  {
    key: 'books',
    categoryKey: 'productCategories.books.category',
    returnPeriodKey: 'productCategories.books.returnPeriod',
    conditionsKey: 'productCategories.books.conditions',
    specialNotesKey: 'productCategories.books.specialNotes',
  },
  {
    key: 'digitalServices',
    categoryKey: 'productCategories.digitalServices.category',
    returnPeriodKey: 'productCategories.digitalServices.returnPeriod',
    conditionsKey: 'productCategories.digitalServices.conditions',
    specialNotesKey: 'productCategories.digitalServices.specialNotes',
  },
]

export const returnPolicyFaqData = [
  {
    questionKey: 'faq.promotion.question',
    answerKey: 'faq.promotion.answer',
  },
  {
    questionKey: 'faq.shippingFee.question',
    answerKey: 'faq.shippingFee.answer',
  },
  {
    questionKey: 'faq.exchangeUpgrade.question',
    answerKey: 'faq.exchangeUpgrade.answer',
  },
  {
    questionKey: 'faq.processingTime.question',
    answerKey: 'faq.processingTime.answer',
  },
  {
    questionKey: 'faq.cancelRequest.question',
    answerKey: 'faq.cancelRequest.answer',
  },
]

export const returnPolicyTrackingStatuses = [
  { statusKey: 'tracking.statuses.received', time: '10:30 - 15/08/2025', icon: '📋' },
  { statusKey: 'tracking.statuses.verifying', time: '14:20 - 15/08/2025', icon: '🔍' },
  { statusKey: 'tracking.statuses.waitingWarehouse', time: '09:15 - 16/08/2025', icon: '📦' },
  { statusKey: 'tracking.statuses.inspecting', time: '', icon: '⏳' },
  { statusKey: 'tracking.statuses.completed', time: '', icon: '✅' },
]

export const returnPolicySupportTips = [
  'support.tips.takePhotos',
  'support.tips.keepPackaging',
  'support.tips.packCarefully',
  'support.tips.keepReceipt',
  'support.tips.trackRequest',
]

export const returnPolicySupportContact = {
  phone: '0823387108',
  email: 'lunashop.business.official@gmail.com',
  hours: '8:00 - 21:00',
}

export const returnPolicyHeaderTags = [
  {
    color: 'green',
    icon: CheckCircleOutlined,
    labelKey: 'pageHeader.tags.freeReturn',
  },
  {
    color: 'blue',
    icon: ClockCircleOutlined,
    labelKey: 'pageHeader.tags.flexibleDeadline',
  },
  {
    color: 'orange',
    icon: DollarOutlined,
    labelKey: 'pageHeader.tags.fastRefund',
  },
]
