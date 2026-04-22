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
    title: 'Yêu cầu đổi trả',
    description: 'Gửi yêu cầu qua website hoặc hotline',
    icon: FileTextOutlined,
  },
  {
    title: 'Xác nhận yêu cầu',
    description: 'Chúng tôi sẽ xác nhận trong 24h',
    icon: CheckCircleOutlined,
  },
  {
    title: 'Gửi sản phẩm',
    description: 'Đóng gói và gửi sản phẩm về',
    icon: TruckOutlined,
  },
  {
    title: 'Kiểm tra & xử lý',
    description: 'Kiểm tra sản phẩm và xử lý yêu cầu',
    icon: ExclamationCircleOutlined,
  },
  {
    title: 'Hoàn tất',
    description: 'Đổi sản phẩm mới hoặc hoàn tiền',
    icon: DollarOutlined,
  },
]

export const returnPolicyOnlineSteps = [
  {
    title: 'Gửi yêu cầu hỗ trợ',
    description: 'Liên hệ qua website, Zalo hoặc email',
    icon: FileTextOutlined,
  },
  {
    title: 'Xác minh & kiểm tra',
    description: 'Kiểm tra trạng thái giao dịch & tài khoản',
    icon: SearchOutlined,
  },
  {
    title: 'Xử lý & phản hồi',
    description: 'Sửa lỗi, kích hoạt lại, cấp lại dịch vụ hoặc hoàn tiền nếu đủ điều kiện',
    icon: SafetyOutlined,
  },
  {
    title: 'Hoàn tất',
    description: 'Kết thúc yêu cầu, xác nhận với khách hàng',
    icon: CheckCircleOutlined,
  },
]

export const returnPolicyReturnReasons = [
  { value: 'defective', label: 'Sản phẩm bị lỗi/hỏng', color: 'red' },
  { value: 'wrong-item', label: 'Giao sai sản phẩm', color: 'orange' },
  { value: 'not-as-described', label: 'Không đúng mô tả', color: 'yellow' },
  { value: 'size-issue', label: 'Không vừa size', color: 'blue' },
  { value: 'change-mind', label: 'Thay đổi ý định', color: 'green' },
  { value: 'damaged-shipping', label: 'Hư hỏng khi vận chuyển', color: 'purple' },
]

export const returnPolicyRefundMethods = [
  {
    method: 'Chuyển khoản ngân hàng',
    time: '2-3 tiếng làm việc',
    fee: 'Miễn phí',
    icon: '🏦',
    popular: true,
  },
  {
    method: 'Ví điện tử (MoMo, ZaloPay)',
    time: '2-3 tiếng làm việc',
    fee: 'Miễn phí',
    icon: '📱',
    popular: true,
  },
  {
    method: 'Tiền mặt tại cửa hàng',
    time: 'Ngay lập tức',
    fee: 'Miễn phí',
    icon: '💵',
    popular: false,
  },
]

export const returnPolicyProductCategories = [
  {
    category: 'Điện tử & Công nghệ',
    returnPeriod: '1-15 ngày (tùy loại)',
    conditions: ['Còn nguyên seal', 'Đầy đủ phụ kiện', 'Có hóa đơn'],
    specialNotes: 'Không áp dụng cho phần mềm đã kích hoạt',
  },
  {
    category: 'Thời trang & Phụ kiện',
    returnPeriod: '1-30 ngày (tùy loại)',
    conditions: ['Chưa qua sử dụng', 'Còn nguyên tag', 'Không bị bẩn/hỏng'],
    specialNotes: 'Đồ lót, tất vớ không được đổi trả',
  },
  {
    category: 'Mỹ phẩm & Sức khỏe',
    returnPeriod: '1-7 ngày (tùy loại)',
    conditions: ['Chưa mở nắp', 'Còn nguyên seal', 'Không dị ứng'],
    specialNotes: 'Chỉ đổi trả khi có lỗi từ nhà sản xuất',
  },
  {
    category: 'Đồ gia dụng',
    returnPeriod: '1-20 ngày (tùy loại)',
    conditions: ['Còn nguyên vẹn', 'Đầy đủ phụ kiện', 'Chưa sử dụng'],
    specialNotes: 'Đồ thủy tinh phải đóng gói cẩn thận',
  },
  {
    category: 'Sách & Văn phòng phẩm',
    returnPeriod: '1-14 ngày (tùy loại)',
    conditions: ['Không bị rách/bẩn', 'Chưa viết/đánh dấu', 'Còn nguyên vẹn'],
    specialNotes: 'Sách điện tử không được hoàn trả',
  },
  {
    category: 'Dịch vụ online / Tài khoản / Phần mềm',
    returnPeriod: '1-3 ngày (tùy loại)',
    conditions: [
      'Chưa kích hoạt hoặc chưa sử dụng',
      'Lỗi kỹ thuật không sử dụng được',
      'Giao nhầm, mua nhầm gói và chưa dùng',
    ],
    specialNotes:
      'Không hoàn/đổi nếu đã kích hoạt hoặc đã sử dụng thành công. Không áp dụng khi vi phạm điều khoản sử dụng hoặc bị khóa do người dùng.',
  },
]

export const returnPolicyFaqData = [
  {
    question: 'Tôi có thể đổi trả sản phẩm mua từ chương trình khuyến mãi không?',
    answer:
      'Có, bạn có thể đổi trả sản phẩm khuyến mãi theo chính sách thông thường. Tuy nhiên, số tiền hoàn lại sẽ là giá đã giảm, không phải giá gốc.',
  },
  {
    question: 'Chi phí vận chuyển khi đổi trả do ai chịu?',
    answer:
      'Nếu lỗi từ chúng tôi (giao sai hàng, sản phẩm lỗi), chúng tôi sẽ chịu phí vận chuyển. Nếu do thay đổi ý định của khách hàng, khách hàng sẽ chịu phí vận chuyển.',
  },
  {
    question: 'Tôi có thể đổi sang sản phẩm khác có giá trị cao hơn không?',
    answer:
      'Có, bạn có thể đổi sang sản phẩm có giá cao hơn bằng cách bù thêm phần chênh lệch. Chúng tôi sẽ tính toán và thông báo số tiền cần bù.',
  },
  {
    question: 'Thời gian xử lý đổi trả mất bao lâu?',
    answer:
      'Thông thường 5-7 ngày làm việc kể từ khi chúng tôi nhận được sản phẩm. Trong thời gian cao điểm có thể kéo dài thêm 2-3 ngày.',
  },
  {
    question: 'Tôi có thể hủy yêu cầu đổi trả đã gửi không?',
    answer:
      'Có, bạn có thể hủy yêu cầu trước khi gửi sản phẩm về. Sau khi sản phẩm đã được gửi đi, việc hủy sẽ phụ thuộc vào tình trạng xử lý.',
  },
]

export const returnPolicyTrackingStatuses = [
  { status: 'Đã tiếp nhận', time: '10:30 - 15/08/2025', icon: '📋' },
  { status: 'Đang xác minh', time: '14:20 - 15/08/2025', icon: '🔍' },
  { status: 'Chờ sản phẩm về kho', time: '09:15 - 16/08/2025', icon: '📦' },
  { status: 'Đang kiểm tra sản phẩm', time: '', icon: '⏳' },
  { status: 'Hoàn tất xử lý', time: '', icon: '✅' },
]

export const returnPolicySupportTips = [
  'Chụp ảnh sản phẩm trước khi đóng gói',
  'Giữ nguyên bao bì và phụ kiện',
  'Đóng gói cẩn thận để tránh hư hỏng',
  'Giữ lại biên lai vận chuyển',
  'Theo dõi trạng thái qua mã yêu cầu',
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
    label: 'Đổi trả miễn phí',
  },
  {
    color: 'blue',
    icon: ClockCircleOutlined,
    label: 'Thời hạn tùy loại sản phẩm',
  },
  {
    color: 'orange',
    icon: DollarOutlined,
    label: 'Hoàn tiền nhanh chóng',
  },
]
