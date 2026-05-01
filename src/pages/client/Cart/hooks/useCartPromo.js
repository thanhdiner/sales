import { useCallback, useState } from 'react'
import { message } from 'antd'
import { validatePromoCode } from '@/services/client/commerce/promoCode'

export function useCartPromo({ formatPrice, subtotal, t }) {
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const buildPromoDescription = useCallback(
    res => {
      if (!res.promoInfo) {
        return res.message || ''
      }

      if (res.promoInfo.discountType === 'percent') {
        if (res.promoInfo.maxDiscount) {
          return t('promo.percentMaxDescription', {
            value: res.promoInfo.discountValue,
            max: formatPrice(res.promoInfo.maxDiscount)
          })
        }

        return t('promo.percentDescription', {
          value: res.promoInfo.discountValue
        })
      }

      return t('promo.fixedDescription', {
        value: formatPrice(res.promoInfo.discountValue)
      })
    },
    [formatPrice, t]
  )

  const handleApplyPromo = useCallback(
    async customCode => {
      try {
        setIsLoading(true)

        const codeToApply = customCode || promoCode

        if (!codeToApply?.trim()) {
          message.warning(t('message.promoRequired'))
          return
        }

        const res = await validatePromoCode({ code: codeToApply, subtotal })

        if (res.valid) {
          setAppliedPromo({
            code: codeToApply,
            ...res,
            description: buildPromoDescription(res)
          })

          setPromoCode(codeToApply)
          message.success(res.message || t('message.promoSuccess'))
        } else {
          message.warning(res.message || t('message.promoInvalid'))
        }
      } catch (err) {
        message.error(err.message || t('message.genericError'))
      } finally {
        setIsLoading(false)
      }
    },
    [buildPromoDescription, promoCode, subtotal, t]
  )

  const clearPromo = useCallback(() => {
    setAppliedPromo(null)
    setPromoCode('')
  }, [])

  return {
    appliedPromo,
    clearPromo,
    handleApplyPromo,
    isLoading,
    promoCode,
    setPromoCode
  }
}
