export const CHECKOUT_DELIVERY_OPTIONS = [
  { value: 'pickup', labelKey: 'checkoutProfile.deliveryOptions.pickup' },
  { value: 'contact', labelKey: 'checkoutProfile.deliveryOptions.contact' }
]

export const CHECKOUT_PAYMENT_OPTIONS = [
  { value: 'vnpay', labelKey: 'checkoutProfile.paymentOptions.vnpay' },
  { value: 'momo', labelKey: 'checkoutProfile.paymentOptions.momo' },
  { value: 'zalopay', labelKey: 'checkoutProfile.paymentOptions.zalopay' },
  { value: 'sepay', labelKey: 'checkoutProfile.paymentOptions.sepay' }
]

export const PROFILE_PHONE_PATTERN = /^0\d{9,10}$/
export const CHECKOUT_PHONE_PATTERN = /^$|^[0-9]{9,15}$/
export const MAX_AVATAR_SIZE = 2 * 1024 * 1024
