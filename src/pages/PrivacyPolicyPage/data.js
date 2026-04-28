import {
  SafetyOutlined,
  LockOutlined,
  EyeOutlined,
  UserOutlined,
  DatabaseOutlined,
  GlobalOutlined,
  PhoneOutlined,
  FileProtectOutlined
} from '@ant-design/icons'

export const privacyPolicySections = [
  {
    id: 'thu-thap-thong-tin',
    titleKey: 'sections.dataCollection',
    icon: DatabaseOutlined
  },
  {
    id: 'su-dung-thong-tin',
    titleKey: 'sections.usage',
    icon: EyeOutlined
  },
  {
    id: 'chia-se-thong-tin',
    titleKey: 'sections.sharing',
    icon: GlobalOutlined
  },
  {
    id: 'bao-mat-thong-tin',
    titleKey: 'sections.security',
    icon: LockOutlined
  },
  {
    id: 'quyen-nguoi-dung',
    titleKey: 'sections.userRights',
    icon: UserOutlined
  },
  {
    id: 'cookies',
    titleKey: 'sections.cookies',
    icon: FileProtectOutlined
  },
  {
    id: 'lien-he',
    titleKey: 'sections.contact',
    icon: PhoneOutlined
  }
]

export const privacyPolicyDataTypes = [
  {
    titleKey: 'dataTypes.personal.title',
    itemsKey: 'dataTypes.personal.items',
    borderClassName: 'border-l-blue-500',
    titleClassName: '!text-blue-600'
  },
  {
    titleKey: 'dataTypes.payment.title',
    itemsKey: 'dataTypes.payment.items',
    borderClassName: 'border-l-green-500',
    titleClassName: '!text-green-600'
  },
  {
    titleKey: 'dataTypes.technical.title',
    itemsKey: 'dataTypes.technical.items',
    borderClassName: 'border-l-orange-500',
    titleClassName: '!text-orange-600'
  },
  {
    titleKey: 'dataTypes.behavior.title',
    itemsKey: 'dataTypes.behavior.items',
    borderClassName: 'border-l-purple-500',
    titleClassName: '!text-purple-600'
  }
]

export const privacyPolicyUsageTimeline = [
  {
    color: 'blue',
    titleKey: 'usageTimeline.service.title',
    descriptionKey: 'usageTimeline.service.description'
  },
  {
    color: 'green',
    titleKey: 'usageTimeline.experience.title',
    descriptionKey: 'usageTimeline.experience.description'
  },
  {
    color: 'orange',
    titleKey: 'usageTimeline.marketing.title',
    descriptionKey: 'usageTimeline.marketing.description'
  },
  {
    color: 'red',
    titleKey: 'usageTimeline.securityCompliance.title',
    descriptionKey: 'usageTimeline.securityCompliance.description'
  }
]

export const privacyPolicySharingData = {
  allowedKey: 'sharingData.allowed',
  disallowedKey: 'sharingData.disallowed'
}

export const privacyPolicySecurityMeasures = [
  {
    titleKey: 'securityMeasures.ssl.title',
    descriptionKey: 'securityMeasures.ssl.description',
    icon: LockOutlined,
    iconClassName: 'text-green-500'
  },
  {
    titleKey: 'securityMeasures.firewall.title',
    descriptionKey: 'securityMeasures.firewall.description',
    icon: SafetyOutlined,
    iconClassName: 'text-blue-500'
  },
  {
    titleKey: 'securityMeasures.accessControl.title',
    descriptionKey: 'securityMeasures.accessControl.description',
    icon: UserOutlined,
    iconClassName: 'text-orange-500'
  },
  {
    titleKey: 'securityMeasures.backup.title',
    descriptionKey: 'securityMeasures.backup.description',
    icon: DatabaseOutlined,
    iconClassName: 'text-purple-500'
  }
]

export const privacyPolicyUserRights = [
  'userRights.know',
  'userRights.accessEdit',
  'userRights.delete',
  'userRights.unsubscribe',
  'userRights.complain',
  'userRights.copy'
]

export const privacyPolicyCookieCategories = [
  {
    key: 'essential',
    titleKey: 'cookieCategories.essential.title',
    descriptionKey: 'cookieCategories.essential.description'
  },
  {
    key: 'performance',
    titleKey: 'cookieCategories.performance.title',
    descriptionKey: 'cookieCategories.performance.description'
  },
  {
    key: 'marketing',
    titleKey: 'cookieCategories.marketing.title',
    descriptionKey: 'cookieCategories.marketing.description'
  }
]

export const privacyPolicyFaqData = [
  {
    questionKey: 'faq.whyCollect.question',
    answerKey: 'faq.whyCollect.answer'
  },
  {
    questionKey: 'faq.thirdParty.question',
    answerKey: 'faq.thirdParty.answer'
  },
  {
    questionKey: 'faq.deleteAccount.question',
    answerKey: 'faq.deleteAccount.answer'
  },
  {
    questionKey: 'faq.cookiesControl.question',
    answerKey: 'faq.cookiesControl.answer'
  }
]

export const privacyPolicyModalContact = {
  email: 'lunashop.business.official@gmail.com',
  phone: '0822387108'
}
