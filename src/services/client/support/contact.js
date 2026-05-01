import { post } from '@/utils/clientRequest'

export const sendContactForm = data => {
  return post('contact', data)
}
