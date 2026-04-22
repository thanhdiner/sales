import React, { useEffect, useState } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import SEO from '@/components/SEO'
import { getPromoCodes } from '@/services/promoCodesService'
import CouponGrid from './components/CouponGrid'
import CouponsHero from './components/CouponsHero'
import CouponsSearchCard from './components/CouponsSearchCard'
import CouponsTabsCard from './components/CouponsTabsCard'
import CouponsTipsCard from './components/CouponsTipsCard'

const CouponPage = () => {
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
      } catch (error) {
        message.error('Lỗi khi lấy danh sách mã giảm giá')
      }
    }

    fetchCoupons()
  }, [])

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
    message.success(`Đã copy mã: ${code}`)

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

  const filteredCoupons = coupons.filter(coupon => {
    const normalizedSearch = searchText.toLowerCase()
    const matchesSearch =
      coupon.code?.toLowerCase().includes(normalizedSearch) ||
      coupon.title?.toLowerCase().includes(normalizedSearch)
    const matchesCategory = activeTab === 'all' || coupon.category === activeTab

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen rounded-xl bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4 dark:from-gray-800 dark:to-gray-800">
      <SEO title="Mã giảm giá" description="Khám phá các mã giảm giá và ưu đãi độc quyền tại SmartMall." />

      <div className="mx-auto max-w-7xl">
        <CouponsHero />
        <CouponsSearchCard searchText={searchText} onSearchChange={setSearchText} resultCount={filteredCoupons.length} />
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
