import { ShoppingBag, PackageSearch, CreditCard, RotateCcw } from 'lucide-react'

export const QUICK_ACTIONS = [
  { label: 'Hỏi về sản phẩm', text: 'Tôi muốn hỏi về sản phẩm', icon: ShoppingBag, type: 'chat' },
  { label: 'Kiểm tra đơn hàng', text: 'Tôi cần kiểm tra đơn hàng của mình', icon: PackageSearch, type: 'modal', actionId: 'order-tracking' },
  { label: 'Phương thức thanh toán', text: 'Các phương thức thanh toán được hỗ trợ?', icon: CreditCard, type: 'chat' },
  { label: 'Đổi trả hàng', text: 'Chính sách đổi trả hàng như thế nào?', icon: RotateCcw, type: 'chat' },
]