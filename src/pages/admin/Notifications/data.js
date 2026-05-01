export const adminNotificationTypes = [
  'order_created',
  'order_cancelled',
  'payment_success',
  'payment_failed',
  'low_stock',
  'out_of_stock',
  'review_created',
  'refund_requested',
  'user_registered',
  'system_alert'
]

export const adminNotificationTypeGroups = {
  order_created: 'order',
  order_cancelled: 'order',
  payment_success: 'payment',
  payment_failed: 'payment',
  low_stock: 'inventory',
  out_of_stock: 'inventory',
  review_created: 'review',
  refund_requested: 'refund',
  user_registered: 'user',
  system_alert: 'system'
}

export const adminNotificationPriorityLevels = ['high', 'normal', 'low']

export const adminNotificationStatusFilters = ['all', 'unread', 'read', 'actionRequired']

export const adminNotificationTabFilters = ['all', 'unread', 'actionRequired', 'order', 'payment', 'inventory', 'review']

const now = new Date()
const minutesAgo = minutes => new Date(now.getTime() - minutes * 60 * 1000).toISOString()
const daysAgo = days => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString()

export const adminNotificationsMock = [
  {
    _id: 'noti_order_035175',
    type: 'order_created',
    priority: 'high',
    title: 'Đơn hàng mới #DH035175',
    message: 'Khách Nguyễn Văn A vừa đặt đơn 1.250.000đ.',
    targetType: 'order',
    targetId: 'DH035175',
    actionRequired: true,
    readAt: null,
    createdAt: minutesAgo(3),
    translations: {
      en: {
        title: 'New order #DH035175',
        message: 'Customer Nguyen Van A has placed an order worth 1,250,000 VND.'
      }
    }
  },
  {
    _id: 'noti_payment_035176',
    type: 'payment_success',
    priority: 'normal',
    title: 'Thanh toán thành công #DH035176',
    message: 'Khách đã thanh toán qua VNPay.',
    targetType: 'payment',
    targetId: 'DH035176',
    actionRequired: false,
    readAt: null,
    createdAt: minutesAgo(10),
    translations: {
      en: {
        title: 'Payment successful #DH035176',
        message: 'The customer paid via VNPay.'
      }
    }
  },
  {
    _id: 'noti_stock_canva',
    type: 'low_stock',
    priority: 'high',
    title: 'Sản phẩm sắp hết hàng',
    message: 'Tài khoản Canva Pro chỉ còn 3 sản phẩm.',
    targetType: 'product',
    targetId: 'canva-pro',
    actionRequired: true,
    readAt: minutesAgo(42),
    createdAt: minutesAgo(62),
    translations: {
      en: {
        title: 'Product is running low',
        message: 'Canva Pro account has only 3 items left.'
      }
    }
  },
  {
    _id: 'noti_review_881',
    type: 'review_created',
    priority: 'normal',
    title: 'Đánh giá mới cần kiểm tra',
    message: 'Khách Trần Minh để lại đánh giá 2 sao cho sản phẩm Office 365.',
    targetType: 'review',
    targetId: 'REV881',
    actionRequired: true,
    readAt: null,
    createdAt: minutesAgo(120),
    translations: {
      en: {
        title: 'New review needs checking',
        message: 'Customer Tran Minh left a 2-star review for Office 365.'
      }
    }
  },
  {
    _id: 'noti_payment_failed_035177',
    type: 'payment_failed',
    priority: 'high',
    title: 'Thanh toán thất bại #DH035177',
    message: 'Giao dịch bị từ chối. Cần kiểm tra lại đơn hàng.',
    targetType: 'payment',
    targetId: 'DH035177',
    actionRequired: true,
    readAt: null,
    createdAt: minutesAgo(220),
    translations: {
      en: {
        title: 'Payment failed #DH035177',
        message: 'The transaction was declined. The order needs to be reviewed.'
      }
    }
  },
  {
    _id: 'noti_refund_035140',
    type: 'refund_requested',
    priority: 'high',
    title: 'Yêu cầu hoàn tiền #DH035140',
    message: 'Khách yêu cầu hoàn tiền do mã kích hoạt không dùng được.',
    targetType: 'refund',
    targetId: 'DH035140',
    actionRequired: true,
    readAt: null,
    createdAt: daysAgo(1),
    translations: {
      en: {
        title: 'Refund requested #DH035140',
        message: 'The customer requested a refund because the activation code does not work.'
      }
    }
  },
  {
    _id: 'noti_user_209',
    type: 'user_registered',
    priority: 'low',
    title: 'Khách hàng mới đăng ký',
    message: 'Tài khoản khách hàng Lê Anh đã được tạo.',
    targetType: 'user',
    targetId: 'USR209',
    actionRequired: false,
    readAt: daysAgo(1),
    createdAt: daysAgo(1),
    translations: {
      en: {
        title: 'New customer registered',
        message: 'Customer account Le Anh has been created.'
      }
    }
  },
  {
    _id: 'noti_system_backup',
    type: 'system_alert',
    priority: 'normal',
    title: 'Cảnh báo hệ thống',
    message: 'Tác vụ sao lưu hôm nay hoàn tất muộn hơn bình thường.',
    targetType: 'system',
    targetId: 'backup',
    actionRequired: false,
    readAt: daysAgo(2),
    createdAt: daysAgo(2),
    translations: {
      en: {
        title: 'System alert',
        message: 'Today backup job completed later than usual.'
      }
    }
  }
]
