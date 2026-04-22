import {
  SafetyOutlined,
  LockOutlined,
  EyeOutlined,
  UserOutlined,
  DatabaseOutlined,
  GlobalOutlined,
  PhoneOutlined,
  MailOutlined,
  FileProtectOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'

export const privacyPolicySections = [
  {
    id: 'thu-thap-thong-tin',
    title: '1. Thu thập thông tin',
    icon: DatabaseOutlined,
  },
  {
    id: 'su-dung-thong-tin',
    title: '2. Sử dụng thông tin',
    icon: EyeOutlined,
  },
  {
    id: 'chia-se-thong-tin',
    title: '3. Chia sẻ thông tin',
    icon: GlobalOutlined,
  },
  {
    id: 'bao-mat-thong-tin',
    title: '4. Bảo mật thông tin',
    icon: LockOutlined,
  },
  {
    id: 'quyen-nguoi-dung',
    title: '5. Quyền của người dùng',
    icon: UserOutlined,
  },
  {
    id: 'cookies',
    title: '6. Cookies và công nghệ theo dõi',
    icon: FileProtectOutlined,
  },
  {
    id: 'lien-he',
    title: '7. Thông tin liên hệ',
    icon: PhoneOutlined,
  },
]

export const privacyPolicyDataTypes = [
  {
    title: 'Thông tin cá nhân',
    items: ['Họ tên', 'Số điện thoại', 'Email', 'Địa chỉ'],
    borderClassName: 'border-l-blue-500',
    titleClassName: '!text-blue-600',
  },
  {
    title: 'Thông tin thanh toán',
    items: ['Lịch sử giao dịch', 'Phương thức thanh toán'],
    borderClassName: 'border-l-green-500',
    titleClassName: '!text-green-600',
  },
  {
    title: 'Thông tin kỹ thuật',
    items: ['Địa chỉ IP', 'Loại trình duyệt', 'Hệ điều hành', 'Cookies'],
    borderClassName: 'border-l-orange-500',
    titleClassName: '!text-orange-600',
  },
  {
    title: 'Thông tin hành vi',
    items: ['Lịch sử duyệt web', 'Sản phẩm quan tâm', 'Thời gian truy cập'],
    borderClassName: 'border-l-purple-500',
    titleClassName: '!text-purple-600',
  },
]

export const privacyPolicyUsageTimeline = [
  {
    color: 'blue',
    title: 'Cung cấp dịch vụ',
    description: 'Xử lý đơn hàng, giao hàng, thanh toán và hỗ trợ khách hàng',
  },
  {
    color: 'green',
    title: 'Cải thiện trải nghiệm',
    description: 'Cá nhân hóa nội dung, đưa ra gợi ý sản phẩm phù hợp',
  },
  {
    color: 'orange',
    title: 'Liên lạc marketing',
    description: 'Gửi thông tin khuyến mãi, sản phẩm mới (chỉ khi bạn đồng ý)',
  },
  {
    color: 'red',
    title: 'Bảo mật và tuân thủ',
    description: 'Phát hiện gian lận, tuân thủ quy định pháp luật',
  },
]

export const privacyPolicySharingData = {
  allowed: [
    'Với đối tác vận chuyển để giao hàng',
    'Với ngân hàng/cổng thanh toán để xử lý giao dịch',
    'Với cơ quan pháp luật khi có yêu cầu hợp lệ',
    'Với sự đồng ý rõ ràng của bạn',
  ],
  disallowed: [
    'Bán thông tin cho bên thứ ba',
    'Chia sẻ với mục đích thương mại khác',
    'Tiết lộ thông tin nhạy cảm không cần thiết',
    'Chia sẻ không có sự đồng ý',
  ],
}

export const privacyPolicySecurityMeasures = [
  {
    title: 'Mã hóa SSL/TLS',
    description: 'Tất cả dữ liệu được mã hóa trong quá trình truyền tải',
    icon: LockOutlined,
    iconClassName: 'text-green-500',
  },
  {
    title: 'Firewall bảo mật',
    description: 'Hệ thống firewall đa lớp bảo vệ máy chủ',
    icon: SafetyOutlined,
    iconClassName: 'text-blue-500',
  },
  {
    title: 'Kiểm soát truy cập',
    description: 'Chỉ nhân viên được ủy quyền mới có thể truy cập dữ liệu',
    icon: UserOutlined,
    iconClassName: 'text-orange-500',
  },
  {
    title: 'Sao lưu định kỳ',
    description: 'Dữ liệu được sao lưu thường xuyên để đảm bảo an toàn',
    icon: DatabaseOutlined,
    iconClassName: 'text-purple-500',
  },
]

export const privacyPolicyUserRights = [
  'Quyền được biết về việc thu thập và sử dụng thông tin',
  'Quyền truy cập và sửa đổi thông tin cá nhân',
  'Quyền xóa tài khoản và dữ liệu cá nhân',
  'Quyền từ chối nhận thông tin quảng cáo',
  'Quyền khiếu nại khi có vi phạm quyền riêng tư',
  'Quyền yêu cầu sao chép dữ liệu cá nhân',
]

export const privacyPolicyCookieCategories = [
  {
    key: 'essential',
    title: 'Cookies thiết yếu',
    description:
      'Cần thiết cho hoạt động cơ bản của website như đăng nhập, giỏ hàng, bảo mật. Không thể tắt loại cookies này.',
  },
  {
    key: 'performance',
    title: 'Cookies hiệu suất',
    description:
      'Giúp chúng tôi hiểu cách bạn sử dụng website để cải thiện trải nghiệm. Thông tin được thu thập ẩn danh.',
  },
  {
    key: 'marketing',
    title: 'Cookies tiếp thị',
    description:
      'Được sử dụng để hiển thị quảng cáo phù hợp với sở thích của bạn trên các website khác. Bạn có thể từ chối loại cookies này.',
  },
]

export const privacyPolicyFaqData = [
  {
    question: 'Tại sao chúng tôi cần thu thập thông tin cá nhân?',
    answer:
      'Chúng tôi thu thập thông tin để cung cấp dịch vụ tốt nhất, xử lý đơn hàng, hỗ trợ khách hàng và cải thiện trải nghiệm mua sắm của bạn.',
  },
  {
    question: 'Thông tin của tôi có được chia sẻ với bên thứ ba không?',
    answer:
      'Chúng tôi chỉ chia sẻ thông tin với các đối tác tin cậy cần thiết để hoàn thành dịch vụ (như vận chuyển, thanh toán) và luôn yêu cầu họ bảo vệ thông tin theo tiêu chuẩn cao.',
  },
  {
    question: 'Tôi có thể xóa tài khoản và dữ liệu của mình không?',
    answer:
      'Có, bạn có thể yêu cầu xóa tài khoản bất cứ lúc nào. Chúng tôi sẽ xóa toàn bộ dữ liệu cá nhân trong vòng 30 ngày, trừ những thông tin cần thiết theo quy định pháp luật.',
  },
  {
    question: 'Làm thế nào để tôi kiểm soát cookies?',
    answer:
      'Bạn có thể quản lý cookies thông qua cài đặt trình duyệt. Tuy nhiên, việc vô hiệu hóa cookies có thể ảnh hưởng đến một số tính năng của website.',
  },
]

export const privacyPolicyModalContact = {
  email: 'lunashop.business.official@gmail.com',
  phone: '0822387108',
}

