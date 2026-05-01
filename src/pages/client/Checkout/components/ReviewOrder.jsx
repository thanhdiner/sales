import { createOrder } from '@/services/client/commerce/order'
import { createPendingOrder, redirectToPayment, simulateSepayPayment } from '@/services/client/commerce/payment'
import { getActiveBankInfo } from '@/services/client/system/bankInfo'
import { formatVietnamAddress } from '@/lib/address/vietnamAddress'
import { useState } from 'react'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'

const ONLINE_METHODS = ['vnpay', 'momo', 'zalopay', 'sepay']
const REDIRECT_METHODS = ['vnpay', 'momo', 'zalopay']
const IS_DEV = import.meta.env.DEV

export function ReviewOrder({
  formData,
  paymentMethod,
  paymentMethods,
  deliveryMethod,
  deliveryOptions,
  orderItems,
  subtotal,
  discount,
  shipping,
  total,
  formatPrice,
  promo,
  onOrderSuccess
}) {
  const { t } = useTranslation('clientCheckout')
  const [loading, setLoading] = useState(false)
  const [isOrdered, setIsOrdered] = useState(false)
  const [sepayOrder, setSepayOrder] = useState(null)
  const [sepayBankInfo, setSepayBankInfo] = useState(null)
  const [loadingSepayBank, setLoadingSepayBank] = useState(false)
  const [simulatingSepay, setSimulatingSepay] = useState(false)
  const [copiedSepayField, setCopiedSepayField] = useState('')

  const isOnlinePayment = ONLINE_METHODS.includes(paymentMethod)
  const isRedirectPayment = REDIRECT_METHODS.includes(paymentMethod)
  const isSepayPayment = paymentMethod === 'sepay'
  const fullAddress = formData.address || formatVietnamAddress(formData)
  const formatPaymentAmount = amount =>
    typeof formatPrice === 'function'
      ? formatPrice(amount)
      : `${Number(amount || 0).toLocaleString('vi-VN')}đ`

  const handleConfirm = async () => {
    if (loading) return

    setLoading(true)

    try {
      const itemsWithFlashSale = orderItems.map(item => {
        if (item.isFlashSale && item.flashSaleId && item.salePrice !== undefined) {
          return {
            ...item,
            isFlashSale: true,
            flashSaleId: item.flashSaleId,
            salePrice: item.salePrice,
            discountPercent: item.discountPercent || item.discountPercentage || 0
          }
        }

        return item
      })

      const orderPayload = {
        contact: formData,
        orderItems: itemsWithFlashSale,
        deliveryMethod,
        paymentMethod,
        subtotal,
        discount,
        shipping,
        total,
        promo: promo?.code || promo || ''
      }

      if (isOnlinePayment) {
        const pendingRes = await createPendingOrder(orderPayload)
        if (!pendingRes?.orderId) throw new Error(t('reviewOrder.message.createOrderFailed'))

        setIsOrdered(true)

        if (isSepayPayment) {
          const nextSepayOrder = {
            orderId: pendingRes.orderId,
            paymentReference: pendingRes.paymentReference || pendingRes.orderId,
            amount: pendingRes.amount || total
          }

          setSepayOrder(nextSepayOrder)
          message.success(t('reviewOrder.message.sepayOrderCreated'))
          setLoadingSepayBank(true)

          try {
            const bankRes = await getActiveBankInfo()
            setSepayBankInfo(bankRes?.bankInfo || bankRes?.data || null)
          } catch {
            setSepayBankInfo(null)
          } finally {
            setLoadingSepayBank(false)
          }

          return
        }

        message.loading(t('reviewOrder.message.redirectingPayment'), 2)

        await redirectToPayment(paymentMethod, pendingRes.orderId)
        return
      }

      const res = await createOrder(orderPayload)

      if (res && res.success) {
        setIsOrdered(true)
        message.success(t('reviewOrder.message.orderSuccess'))
        if (onOrderSuccess) onOrderSuccess(res.order)
      } else {
        message.error(res.error || t('reviewOrder.message.genericError'))
      }
    } catch (err) {
      message.error(err.message || t('reviewOrder.message.genericError'))
    } finally {
      setLoading(false)
    }
  }

  const copySepayText = async (text, field) => {
    if (!text) return

    try {
      await navigator.clipboard.writeText(String(text))
      setCopiedSepayField(field)
      setTimeout(() => setCopiedSepayField(''), 1200)
      message.success(t('paymentForm.message.copySuccess'))
    } catch {
      message.error(t('paymentForm.message.copyFailed'))
    }
  }

  const handleSimulateSepayPayment = async () => {
    if (!sepayOrder?.orderId || simulatingSepay) return

    setSimulatingSepay(true)

    try {
      const res = await simulateSepayPayment(sepayOrder.paymentReference || sepayOrder.orderId)
      message.success(t('reviewOrder.message.sepaySimulateSuccess'))

      if (res?.order && onOrderSuccess) {
        await onOrderSuccess(res.order)
      }
    } catch (err) {
      message.error(err.message || t('reviewOrder.message.sepaySimulateFailed'))
    } finally {
      setSimulatingSepay(false)
    }
  }

  const selectedPayment = paymentMethods.find(method => method.id === paymentMethod)
  const selectedDelivery = deliveryOptions.find(option => option.id === deliveryMethod)

  const renderSubmitText = () => {
    if (loading) {
      if (isSepayPayment) return t('reviewOrder.button.creatingSepay')
      return isOnlinePayment ? t('reviewOrder.button.redirecting') : t('reviewOrder.button.submitting')
    }

    if (isSepayPayment) {
      return t('reviewOrder.button.createSepay')
    }

    if (isOnlinePayment) {
      return t('reviewOrder.button.payWith', { name: selectedPayment?.name || '' })
    }

    if (deliveryMethod === 'contact') {
      return t('reviewOrder.button.sendContactRequest')
    }

    return t('reviewOrder.button.confirmOrder')
  }

  return (
    <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('reviewOrder.title')}</h2>

        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">{t('reviewOrder.description')}</p>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('reviewOrder.contactInfo.title')}</h3>

          <div className="mt-3 space-y-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
            <p className="mb-0">
              <span className="font-medium text-gray-900 dark:text-gray-100">{t('reviewOrder.contactInfo.fullName')}</span>{' '}
              {formData.firstName} {formData.lastName}
            </p>

            <p className="mb-0">
              <span className="font-medium text-gray-900 dark:text-gray-100">{t('reviewOrder.contactInfo.phone')}</span> {formData.phone}
            </p>

            {formData.email && (
              <p className="mb-0">
                <span className="font-medium text-gray-900 dark:text-gray-100">{t('reviewOrder.contactInfo.email')}</span> {formData.email}
              </p>
            )}

            {fullAddress && (
              <p className="mb-0">
                <span className="font-medium text-gray-900 dark:text-gray-100">{t('reviewOrder.contactInfo.address')}</span> {fullAddress}
              </p>
            )}

            {formData.notes && (
              <p className="mb-0">
                <span className="font-medium text-gray-900 dark:text-gray-100">{t('reviewOrder.contactInfo.notes')}</span> {formData.notes}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('reviewOrder.payment.title')}</h3>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm leading-6 text-gray-600 dark:text-gray-300">{selectedPayment?.name}</span>

            {isRedirectPayment && (
              <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {t('reviewOrder.payment.autoRedirect')}
              </span>
            )}

            {isSepayPayment && (
              <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {t('reviewOrder.payment.waitingWebhook')}
              </span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('reviewOrder.delivery.title')}</h3>

          <p className="mt-3 mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {selectedDelivery
              ? t('reviewOrder.delivery.nameWithTime', {
                  name: selectedDelivery.name,
                  time: selectedDelivery.time
                })
              : ''}
          </p>
        </div>
      </div>

      {isOnlinePayment && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {isSepayPayment
              ? t('reviewOrder.payment.sepayNote')
              : t('reviewOrder.payment.onlineNote', { name: selectedPayment?.name || '' })}
          </p>
        </div>
      )}

      {sepayOrder && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('reviewOrder.sepay.title')}</h3>

          {loadingSepayBank ? (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">{t('reviewOrder.sepay.loadingBank')}</div>
          ) : sepayBankInfo ? (
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_180px]">
              <div className="space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                <div>
                  <p className="mb-1 font-medium text-gray-900 dark:text-gray-100">{t('reviewOrder.sepay.bankName')}</p>
                  <p className="mb-0">{sepayBankInfo.bankName}</p>
                </div>

                <div>
                  <p className="mb-1 font-medium text-gray-900 dark:text-gray-100">{t('reviewOrder.sepay.accountNumber')}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="mb-0 font-mono text-gray-900 dark:text-gray-100">{sepayBankInfo.accountNumber}</p>
                    <button
                      type="button"
                      onClick={() => copySepayText(sepayBankInfo.accountNumber, 'accountNumber')}
                      className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      {copiedSepayField === 'accountNumber' ? t('paymentForm.transfer.copied') : t('paymentForm.transfer.copy')}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="mb-1 font-medium text-gray-900 dark:text-gray-100">{t('reviewOrder.sepay.accountHolder')}</p>
                  <p className="mb-0">{sepayBankInfo.accountHolder}</p>
                </div>

                <div>
                  <p className="mb-1 font-medium text-gray-900 dark:text-gray-100">{t('reviewOrder.sepay.amount')}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="mb-0 font-semibold text-gray-900 dark:text-gray-100">{formatPaymentAmount(sepayOrder.amount)}</p>
                    <button
                      type="button"
                      onClick={() => copySepayText(sepayOrder.amount, 'amount')}
                      className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      {copiedSepayField === 'amount' ? t('paymentForm.transfer.copied') : t('paymentForm.transfer.copy')}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="mb-1 font-medium text-gray-900 dark:text-gray-100">{t('reviewOrder.sepay.reference')}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="mb-0 font-mono text-gray-900 dark:text-gray-100">{sepayOrder.paymentReference}</p>
                    <button
                      type="button"
                      onClick={() => copySepayText(sepayOrder.paymentReference, 'reference')}
                      className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      {copiedSepayField === 'reference' ? t('paymentForm.transfer.copied') : t('paymentForm.transfer.copy')}
                    </button>
                  </div>
                </div>

                <p className="mb-0 rounded-xl border border-gray-200 bg-white p-3 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {t('reviewOrder.sepay.description')}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                {sepayBankInfo.qrCode ? (
                  <>
                    <img
                      src={sepayBankInfo.qrCode}
                      alt={t('reviewOrder.sepay.qrAlt')}
                      className="h-40 w-40 rounded-lg border border-gray-200 object-cover dark:border-gray-700"
                      loading="lazy"
                    />
                    <a
                      href={sepayBankInfo.qrCode}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-gray-700 underline underline-offset-4 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                      {t('reviewOrder.sepay.openQr')}
                    </a>
                  </>
                ) : (
                  <p className="mb-0 text-center text-sm leading-6 text-gray-500 dark:text-gray-400">{t('reviewOrder.sepay.noQr')}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              {t('reviewOrder.sepay.missingBankInfo')}
            </div>
          )}

          {IS_DEV && (
            <button
              type="button"
              onClick={handleSimulateSepayPayment}
              disabled={simulatingSepay}
              className="mt-4 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              {simulatingSepay ? t('reviewOrder.sepay.simulating') : t('reviewOrder.sepay.simulateButton')}
            </button>
          )}
        </div>
      )}

      {!sepayOrder && (
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
          disabled={loading || isOrdered}
        >
          {renderSubmitText()}
        </button>
      )}
    </div>
  )
}
