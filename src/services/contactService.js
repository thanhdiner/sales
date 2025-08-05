import { post } from '@/utils/clientRequest'

export const sendContactForm = data => post('contact', data)
