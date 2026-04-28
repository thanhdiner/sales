import React, { useEffect, useMemo, useState } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
import { getPromoCodes } from '@/services/promoCodesService'
import CouponGrid from './components/CouponGrid'
import CouponsHero from './components/CouponsHero'
import CouponsSearchCard from './components/CouponsSearchCard'
import CouponsTabsCard from './components/CouponsTabsCard'
import CouponsTipsCard from './components/CouponsTipsCard'
import { getLocalizedPromoCode } from '@/utils/promoCodeLocalization'

const CouponPage = () => {
  const { t, i18n } = useTranslation('clientCoupons')
  const language = i18n.resolvedLanguage || i18n.language
  const [copiedCoupons, setCopiedCoupons] = useState(new Set())
  const [searchText, setSearchText] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [timeLeft, setTimeLeft] = useState({})
  const [coupons, setCoupons] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await getPromoCodes()
        setCoupons(response.promoCodes || [])
      } catch {
        message.error(t('message.loadFailed'))
      }
    }

    fetchCoupons()
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

  const localizedCoupons = useMemo(
    () => coupons.map(coupon => getLocalizedPromoCode(coupon, language)),
    [coupons, language]
  )

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
    <div className="coupons-page min-h-screen rounded-xl bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4 dark:bg-gray-950 dark:bg-none">
      <SEO
        title={t('page.seo.title')}
        description={t('page.seo.description')}
      />

      <div className="mx-auto max-w-7xl">
        <CouponsHero />
        <CouponsSearchCard
          searchText={searchText}
          onSearchChange={setSearchText}
          resultCount={filteredCoupons.length}
        />
        <CouponsTabsCard activeTab={activeTab} onTabChange={setActiveTab} />
        <CouponGrid
          coupons={filteredCoupons}
          copiedCoupons={copiedCoupons}
          timeLeft={timeLeft}
          onCopyCoupon={handleCopyCoupon}
          onUseCoupon={handleUseCoupon}
        />
        <CouponsTipsCard />
      </div>
    </div>
  )
}

export default CouponPage
