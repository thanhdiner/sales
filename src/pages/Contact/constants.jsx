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
    role: 'Chuyên phần mềm bản quyền',
    avatar: '/images/avt.jpg',
    methods: [
      {
        icon: MessageOutlined,
        title: 'Zalo',
        value: '0823387108',
        color: '#0068FF',
        action: 'Nhắn Zalo',
        link: 'https://zalo.me/0823387108'
      },
      {
        icon: FacebookFilled,
        title: 'Facebook',
        value: 'fb.com/lunashop.business.official',
        color: '#1877F2',
        action: 'Chat FB',
        link: 'https://www.facebook.com/lunashop.business.official'
      },
      {
        icon: MailOutlined,
        title: 'Email',
        value: 'smartmall.business.official@gmail.com',
        color: '#7C3AED',
        action: 'Gửi email',
        link: 'mailto:smartmall.business.official@gmail.com'
      }
    ]
  },
  {
    name: 'Smartmall Gdv 2',
    role: 'Chuyên tư vấn & hỗ trợ đơn hàng',
    avatar: '/images/avt.jpg',
    methods: [
      {
        icon: MessageOutlined,
        title: 'Zalo',
        value: '0822516521',
        color: '#0068FF',
        action: 'Nhắn Zalo',
        link: 'https://zalo.me/0822516521'
      },
      {
        icon: FacebookFilled,
        title: 'Facebook',
        value: 'fb.com/smartmall.world',
        color: '#1877F2',
        action: 'Chat FB',
        link: 'https://www.facebook.com/smartmall.world'
      },
      {
        icon: MailOutlined,
        title: 'Email',
        value: 'smartmallhq@gmail.com',
        color: '#7C3AED',
        action: 'Gửi email',
        link: 'mailto:smartmallhq@gmail.com'
      }
    ]
  }
]

export const workingHours = [
  { day: 'Thứ 2 - Thứ 6', time: '8:00 - 21:00', type: 'weekday' },
  { day: 'Thứ 7', time: '9:00 - 21:00', type: 'saturday' },
  { day: 'Chủ nhật', time: '10:00 - 21:00', type: 'sunday' }
]

export const faqs = [
  {
    question: 'Làm sao để đặt hàng?',
    answer: 'Bạn có thể liên hệ qua Facebook, Zalo hoặc email. Bên mình sẽ tư vấn và hướng dẫn chi tiết.'
  },
  {
    question: 'Thanh toán như thế nào?',
    answer: 'Bên mình hỗ trợ thanh toán qua ngân hàng và một số ví điện tử phổ biến.'
  },
  {
    question: 'Bao lâu nhận được hàng?',
    answer: 'Thông thường trong ngày, tối đa 24 giờ. Với tài khoản phần mềm, thời gian xử lý thường nhanh hơn.'
  },
  {
    question: 'Có bảo hành không?',
    answer:
      'Tùy từng sản phẩm sẽ có hoặc không có bảo hành. Nếu có, thông tin thời gian và điều kiện bảo hành sẽ được ghi rõ ở phần mô tả sản phẩm.'
  }
]

export const highlights = [
  {
    icon: ThunderboltOutlined,
    value: '< 3h',
    label: 'Thời gian phản hồi',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    icon: SafetyCertificateOutlined,
    value: '100%',
    label: 'Bảo mật thông tin',
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    icon: HeartOutlined,
    value: '24/7',
    label: 'Hỗ trợ tận tâm',
    gradient: 'from-rose-500 to-pink-500'
  }
]

export const viewport = { once: true, amount: 0.2 }
