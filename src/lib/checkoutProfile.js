import { normalizeVietnamAddress } from './vietnamAddress'

export const DEFAULT_CHECKOUT_PROFILE = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  addressLine1: '',
  provinceCode: '',
  provinceName: '',
  districtCode: '',
  districtName: '',
  wardCode: '',
  wardName: '',
  address: '',
  notes: '',
  deliveryMethod: 'pickup',
  paymentMethod: 'transfer'
}

const normalizeText = value => (typeof value === 'string' ? value.trim() : '')

export const splitFullName = fullName => {
  const normalized = normalizeText(fullName)
  if (!normalized) return { firstName: '', lastName: '' }

  const parts = normalized.split(/\s+/).filter(Boolean)
  if (parts.length === 1) {
    return { firstName: '', lastName: parts[0] }
  }

  return {
    firstName: parts.slice(0, -1).join(' '),
    lastName: parts[parts.length - 1]
  }
}

export const normalizeCheckoutProfile = profile => {
  const normalizedAddress = normalizeVietnamAddress(profile)

  return {
    ...DEFAULT_CHECKOUT_PROFILE,
    firstName: normalizeText(profile?.firstName),
    lastName: normalizeText(profile?.lastName),
    phone: normalizeText(profile?.phone),
    email: normalizeText(profile?.email),
    ...normalizedAddress,
    notes: normalizeText(profile?.notes),
    deliveryMethod: profile?.deliveryMethod === 'contact' ? 'contact' : 'pickup',
    paymentMethod: ['transfer', 'contact', 'vnpay', 'momo', 'zalopay'].includes(profile?.paymentMethod)
      ? profile.paymentMethod
      : 'transfer'
  }
}

export const buildCheckoutFormDefaults = user => {
  const normalizedProfile = normalizeCheckoutProfile(user?.checkoutProfile)
  const fallbackName = splitFullName(user?.fullName)

  return {
    ...normalizedProfile,
    firstName: normalizedProfile.firstName || fallbackName.firstName,
    lastName: normalizedProfile.lastName || fallbackName.lastName,
    phone: normalizedProfile.phone || normalizeText(user?.phone),
    email: normalizedProfile.email || normalizeText(user?.email)
  }
}
