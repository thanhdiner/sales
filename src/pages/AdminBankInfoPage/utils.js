export const ADMIN_BANK_INFO_TABLE_PAGE_SIZE = 8

export const ADMIN_BANK_INFO_FORM_INITIAL_VALUES = {
  bankName: '',
  accountNumber: '',
  accountHolder: '',
  noteTemplate: '',
  translations: {
    en: {
      bankName: '',
      accountHolder: '',
      noteTemplate: ''
    }
  },
  qrCode: []
}

const isEnglishLanguage = language => String(language || '').toLowerCase().startsWith('en')

const hasText = value => typeof value === 'string' && value.trim().length > 0

export const getBankInfoTranslationValues = bankInfo => ({
  en: {
    bankName: bankInfo?.translations?.en?.bankName || '',
    accountHolder: bankInfo?.translations?.en?.accountHolder || '',
    noteTemplate: bankInfo?.translations?.en?.noteTemplate || ''
  }
})

export const getLocalizedBankInfoField = (bankInfo, field, language, fallback = '') => {
  if (!bankInfo) return fallback

  const translatedValue = isEnglishLanguage(language) ? bankInfo.translations?.en?.[field] : ''
  if (hasText(translatedValue)) return translatedValue

  const baseValue = bankInfo[field]
  if (hasText(baseValue)) return baseValue

  return baseValue ?? fallback
}

export const getLocalizedBankInfoBankName = (bankInfo, language, fallback = '') =>
  getLocalizedBankInfoField(bankInfo, 'bankName', language, fallback)

export const getLocalizedBankInfoAccountHolder = (bankInfo, language, fallback = '') =>
  getLocalizedBankInfoField(bankInfo, 'accountHolder', language, fallback)

export const getLocalizedBankInfoNoteTemplate = (bankInfo, language, fallback = '') =>
  getLocalizedBankInfoField(bankInfo, 'noteTemplate', language, fallback)

export const getBankInfoQrFileList = bankInfo =>
  bankInfo?.qrCode
    ? [
        {
          uid: bankInfo._id,
          name: bankInfo.qrCode.split('/').pop(),
          status: 'done',
          url: bankInfo.qrCode
        }
      ]
    : []

export const buildBankInfoFormData = ({
  values,
  editing,
  oldQR,
  qrToDelete,
  isRemoveQR
}) => {
  const formData = new FormData()
  const previousQrImage = qrToDelete || oldQR
  const file = values.qrCode?.[0]?.originFileObj

  formData.append('bankName', values.bankName)
  formData.append('accountNumber', values.accountNumber)
  formData.append('accountHolder', values.accountHolder)
  formData.append('noteTemplate', values.noteTemplate)

  if (values.translations) {
    formData.append('translations', JSON.stringify(values.translations))
  }

  if (file) {
    formData.append('qrCode', file)

    if (previousQrImage) {
      formData.append('oldImage', previousQrImage)
    }
  } else if (editing && isRemoveQR) {
    formData.append('oldImage', previousQrImage)
    formData.append('deleteImage', true)
    formData.append('qrCode', '')
  }

  if (!editing) {
    formData.append('isActive', 'false')
  }

  return formData
}
