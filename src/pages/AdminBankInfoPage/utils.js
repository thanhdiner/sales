export const ADMIN_BANK_INFO_TABLE_PAGE_SIZE = 8

export const ADMIN_BANK_INFO_FORM_INITIAL_VALUES = {
  bankName: '',
  accountNumber: '',
  accountHolder: '',
  noteTemplate: '',
  qrCode: []
}

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
