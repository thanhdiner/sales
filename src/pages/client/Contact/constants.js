import {
  MessageOutlined,
  FacebookFilled,
  MailOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  HeartOutlined
} from '@ant-design/icons'

export const sellers = [
  {
    name: 'Smartmall Gdv 1',
    roleKey: 'sellers.roles.software',
    avatar: '/images/avt.jpg',
    methods: [
      {
        icon: MessageOutlined,
        title: 'Zalo',
        value: '0823387108',
        color: '#0068FF',
        actionKey: 'sellers.actions.zalo',
        link: 'https://zalo.me/0823387108'
      },
      {
        icon: FacebookFilled,
        title: 'Facebook',
        value: 'fb.com/lunashop.business.official',
        color: '#1877F2',
        actionKey: 'sellers.actions.facebook',
        link: 'https://www.facebook.com/lunashop.business.official'
      },
      {
        icon: MailOutlined,
        title: 'Email',
        value: 'smartmall.business.official@gmail.com',
        color: '#7C3AED',
        actionKey: 'sellers.actions.email',
        link: 'mailto:smartmall.business.official@gmail.com'
      }
    ]
  },
  {
    name: 'Smartmall Gdv 2',
    roleKey: 'sellers.roles.support',
    avatar: '/images/avt.jpg',
    methods: [
      {
        icon: MessageOutlined,
        title: 'Zalo',
        value: '0822516521',
        color: '#0068FF',
        actionKey: 'sellers.actions.zalo',
        link: 'https://zalo.me/0822516521'
      },
      {
        icon: FacebookFilled,
        title: 'Facebook',
        value: 'fb.com/smartmall.world',
        color: '#1877F2',
        actionKey: 'sellers.actions.facebook',
        link: 'https://www.facebook.com/smartmall.world'
      },
      {
        icon: MailOutlined,
        title: 'Email',
        value: 'smartmallhq@gmail.com',
        color: '#7C3AED',
        actionKey: 'sellers.actions.email',
        link: 'mailto:smartmallhq@gmail.com'
      }
    ]
  }
]

export const workingHours = [
  { dayKey: 'workingHours.weekday', time: '8:00 - 21:00', type: 'weekday' },
  { dayKey: 'workingHours.saturday', time: '9:00 - 21:00', type: 'saturday' },
  { dayKey: 'workingHours.sunday', time: '10:00 - 21:00', type: 'sunday' }
]

export const faqKeys = ['order', 'payment', 'delivery', 'warranty']

export const highlights = [
  {
    icon: ThunderboltOutlined,
    value: '< 3h',
    labelKey: 'highlightsSection.items.responseTime',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    icon: SafetyCertificateOutlined,
    value: '100%',
    labelKey: 'highlightsSection.items.security',
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    icon: HeartOutlined,
    value: '24/7',
    labelKey: 'highlightsSection.items.support',
    gradient: 'from-rose-500 to-pink-500'
  }
]

export const viewport = { once: true, amount: 0.2 }