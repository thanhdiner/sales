import { Search, UserPlus, CreditCard, Truck, Wallet, Landmark } from 'lucide-react'

export const shoppingGuideViewport = { once: true, amount: 0.2 }

export const shoppingGuideSteps = [
  {
    title: 'Chọn sản phẩm',
    content: 'Tìm kiếm và lựa chọn sản phẩm bạn muốn mua',
    icon: Search,
  },
  {
    title: 'Đăng nhập/Đăng ký',
    content: 'Tạo tài khoản hoặc đăng nhập để tiếp tục',
    icon: UserPlus,
  },
  {
    title: 'Thanh toán',
    content: 'Chọn phương thức thanh toán và hoàn tất đơn hàng',
    icon: CreditCard,
  },
  {
    title: 'Giao hàng',
    content: 'Theo dõi đơn hàng và nhận sản phẩm',
    icon: Truck,
  },
]

export const shoppingGuidePaymentMethods = [
  {
    name: 'Ví điện tử',
    desc: 'Hỗ trợ các ví điện tử hàng đầu tại Việt Nam.',
    popular: true,
    icon: Wallet,
    badges: ['MoMo', 'ZaloPay', 'ViettelPay'],
  },
  {
    name: 'Chuyển khoản',
    desc: 'Internet Banking & Mobile Banking nhanh chóng.',
    popular: true,
    icon: Landmark,
    badges: ['24/7 Instant Transfer'],
  },
]

export const shoppingGuideDetailedSteps = [
  {
    id: 'BƯỚC 01',
    title: 'Tìm kiếm sản phẩm',
    description:
      'Sử dụng thanh tìm kiếm thông minh tại đầu trang hoặc duyệt qua các danh mục được phân loại rõ ràng để tìm thấy sản phẩm phù hợp với nhu cầu của bạn.',
    chips: ['Tìm kiếm', 'Danh mục'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDR9c6HMFu3YLiFFZ42A88Q6Fp39ITb_0gKa2NlOjHAQQr_U6SRQcsxuHj9rH4E46tjMC6fh2ToxmN4O486tDtDq5NLD6jCF3sOuGnkZ4iBHCqQ9qVi5K6LO1XZDDqkkcPYWB4DFCZsqWTk1RGqPu_w_Vx4rsyHhXTmY_pB-f5LoRNbmLwohmXoMhiH0_TlaXSWDjS43qrJ-ICCAeQLKBj2w05jxQGwpWOS76bjUl-GQd2Enbek1I3dpb8IZs1LjzlZEwRWMTmMH2E',
    reverse: false,
  },
  {
    id: 'BƯỚC 02',
    title: 'Thêm vào giỏ hàng',
    description:
      "Chọn số lượng, màu sắc, kích thước và nhấn nút 'Thêm vào giỏ hàng'. Bạn có thể tiếp tục mua sắm hoặc đi đến giỏ hàng để thanh toán ngay.",
    checks: ['Chọn biến thể sản phẩm', 'Kiểm tra tồn kho thời gian thực'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBnGnoawIhXn07QbPwrRfv7G_E9pJIhaF-9ZPPwqFjcBsxSO88IWxCCMnw6Yt5cHa0rcg8UD6esdyKY4oWWsfjelAo4hIplZwc4fHJ-Ur_BpiUdoyD9vB_mcxLXIuMNy7iop0wa0Qqe9YCp6z11Pt79DMrMi_N7iYhh_sTkNArYIzM7R0omC4Y_BWE4fuFjj3hrGzdXynr6bpQIQ8s9ov25Apr4LEjeXs0Spe6XCTos7-JbmtfRkhrWAIQqYjiIcoFax49ONyhVBZE',
    reverse: true,
  },
  {
    id: 'BƯỚC 03 & 04',
    title: 'Kiểm tra & Điền thông tin',
    description:
      'Xem lại sản phẩm trong giỏ hàng. Nhập chính xác địa chỉ giao hàng và số điện thoại để chúng tôi có thể phục vụ bạn tốt nhất.',
    note: 'Mẹo: Lưu địa chỉ trong tài khoản để thanh toán nhanh hơn ở lần sau.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBL3JJ27QFJCsxmFnsDMBpP4g4MbeimwaTd9I537SxHGxX9PhsMaRYRWf_hUDsVn-mJkaHSFZ4tM_j0NM10-SCs30Mk0iN-O_MGbwveUu5_2UeD9zHhdKgrA5B2Al-rCBcQ24tYAugHV2cFBlEMl12P0tAK6z74CkQSdeXyZAAgbyA1LGoo_XxyTREEBmqhWGzVZrm_Of1cGCGTOrpry3Ee3ln8ECeoj964Kl6R6unTKRxZbShblbQ0EXD9dkESgx8frVn3y7EymDo',
    reverse: false,
  },
]

export const shoppingGuideSmartTips = [
  'So sánh giá trước khi mua để luôn có lựa chọn tốt nhất.',
  'Kiểm tra chính sách đổi trả cụ thể của từng loại sản phẩm.',
  'Luôn kiểm tra kỹ thông tin sản phẩm và đánh giá từ người mua trước.',
  'Tận dụng các chương trình flash sale khung giờ vàng.',
  'Sử dụng tối đa các mã giảm giá và voucher tích lũy sẵn có.',
]

export const shoppingGuideFaqData = [
  {
    question: 'Làm thế nào để theo dõi đơn hàng?',
    answer:
      'Bạn có thể theo dõi đơn hàng bằng cách đăng nhập vào tài khoản và vào mục "Đơn hàng của tôi" hoặc sử dụng mã đơn hàng được gửi qua email/SMS.',
  },
  {
    question: 'Thời gian giao hàng mất bao lâu?',
    answer: 'Thời gian giao hàng thông thường là 2-3 tiếng làm việc.',
  },
  {
    question: 'Có thể đổi trả hàng không?',
    answer:
      'Chính sách đổi trả áp dụng tùy theo từng loại sản phẩm. Vui lòng xem chi tiết chính sách đổi trả của từng sản phẩm trên trang thông tin sản phẩm.',
  },
  {
    question: 'Phí giao hàng được tính như thế nào?',
    answer: `- Sản phẩm giao dịch online (phần mềm, mã kích hoạt, tài khoản, v.v.): luôn miễn phí giao hàng. Sản phẩm sẽ được gửi qua email hoặc tin nhắn.
- Sản phẩm vật lý: Phí giao hàng được tính dựa trên khu vực và trọng lượng. Đơn hàng từ 500.000đ trở lên sẽ được miễn phí giao hàng.
`,
  },
]
