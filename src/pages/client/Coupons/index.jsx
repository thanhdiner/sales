import React, { useEffect, useMemo, useState } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import MobileBackButton from '@/components/shared/MobileBackButton'
import SEO from '@/components/shared/SEO'
import { getPromoCodes } from '@/services/client/commerce/promoCode'
import CouponGrid from './components/CouponGrid'
import CouponsHero from './sections/CouponsHero'
import CouponsSearchCard from './sections/CouponsSearchCard'
import CouponsTabsCard from './sections/CouponsTabsCard'
import CouponsTipsCard from './sections/CouponsTipsCard'
import { getLocalizedPromoCode } from '@/utils/promoCodeLocalization'
import './index.scss'

const Coupon = () => {
  const { t, i18n } = useTranslation('clientCoupons')
  const language = i18n.resolvedLanguage || i18n.language
  const [copiedCoupons, setCopiedCoupons] = useState(new Set())
  const [searchText, setSearchText] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [timeLeft, setTimeLeft] = useState({})
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const fetchCoupons = async () => {
      setLoading(true)

      try {
        const response = await getPromoCodes()
        if (isMounted) setCoupons(response.promoCodes || [])
      } catch {
        if (isMounted) message.error(t('message.loadFailed'))
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchCoupons()

    return () => {
      isMounted = false
    }
  }, [t])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const nextTimeLeft = {}

      coupons.forEach(coupon => {
        const expiry = new Date(coupon.expiresAt).getTime()
        const difference = expiry - now

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          nextTimeLeft[coupon._id] = { days, hours, minutes }
        }
      })

      setTimeLeft(nextTimeLeft)
    }, 1000)

    return () => clearInterval(timer)
  }, [coupons])

  const handleCopyCoupon = code => {
    navigator.clipboard.writeText(code)
    setCopiedCoupons(previous => new Set([...previous, code]))
    message.success(t('message.copySuccess', { code }))

    setTimeout(() => {
      setCopiedCoupons(previous => {
        const nextCoupons = new Set(previous)
        nextCoupons.delete(code)
        return nextCoupons
      })
    }, 3000)
  }

  const handleUseCoupon = code => {
    navigate('/cart', { state: { autoApplyCoupon: code } })
  }

  const localizedCoupons = useMemo(() => coupons.map(coupon => getLocalizedPromoCode(coupon, language)), [coupons, language])

  const filteredCoupons = localizedCoupons.filter(coupon => {
    const normalizedSearch = searchText.toLowerCase()
    const matchesSearch =
      coupon.code?.toLowerCase().includes(normalizedSearch) ||
      coupon.title?.toLowerCase().includes(normalizedSearch) ||
      coupon.description?.toLowerCase().includes(normalizedSearch)
    const matchesCategory = activeTab === 'all' || coupon.category === activeTab

    return matchesSearch && matchesCategory
  })

  return (
    <div className="coupons-page">
      <SEO title={t('page.seo.title')} description={t('page.seo.description')} />

      <div className="coupons-page__shell">
        <MobileBackButton />
        <CouponsHero />
        <CouponsSearchCard searchText={searchText} onSearchChange={setSearchText} resultCount={loading ? 0 : filteredCoupons.length} />
        <CouponsTabsCard activeTab={activeTab} onTabChange={setActiveTab} />
        <CouponGrid
          coupons={filteredCoupons}
          copiedCoupons={copiedCoupons}
          loading={loading}
          timeLeft={timeLeft}
          onCopyCoupon={handleCopyCoupon}
          onUseCoupon={handleUseCoupon}
        />
        <CouponsTipsCard />
      </div>
    </div>
  )
}

export default Coupon
