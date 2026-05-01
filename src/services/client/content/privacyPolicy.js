import { get } from '@/utils/clientRequest'

export const getPrivacyPolicyContent = () => {
  return get('privacy-policy')
}