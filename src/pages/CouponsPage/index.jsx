import React, { useState, useEffect } from 'react'
import { Card, Button, Typography, Space, Row, Col, Input, message, Tabs, Divider, Badge, Empty } from 'antd'
import {
  GiftOutlined,
  PercentageOutlined,
  CopyOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  FireOutlined,
  StarOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  CrownOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import { getPromoCodes } from '@/services/promoCodesService'
import { useNavigate } from 'react-router-dom'
import SEO from '@/components/SEO'

const { Title, Text, Paragraph } = Typography

const CouponPage = () => {const [copiedCoupons, setCopiedCoupons] = useState(new Set())
  const [searchText, setSearchText] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [timeLeft, setTimeLeft] = useState({})
  const [coupons, setCoupons] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await getPromoCodes()
        setCoupons(res.promoCodes || [])
      } catch (err) {
        message.error('Lỗi khi lấy danh sách mã giảm giá')
      }
    }
    fetchCoupons()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const newTimeLeft = {}
      coupons.forEach(coupon => {
        const expiry = new Date(coupon.expiresAt).getTime()
        const difference = expiry - now
        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          newTimeLeft[coupon._id] = { days, hours, minutes }
        }
      })
      setTimeLeft(newTimeLeft)
    }, 1000)
    return () => clearInterval(timer)
  }, [coupons])

  const handleCopyCoupon = code => {
    navigator.clipboard.writeText(code)
    setCopiedCoupons(prev => new Set([...prev, code]))
    message.success(`Đã copy mã: ${code}`)
    setTimeout(() => {
      setCopiedCoupons(prev => {
        const newSet = new Set(prev)
        newSet.delete(code)
        return newSet
      })
    }, 3000)
  }

  const getCategoryIcon = category => {
    switch (category) {
      case 'all':
        return <GiftOutlined className="text-pink-500" />
      case 'new':
        return <StarOutlined className="text-yellow-500" />
      case 'flash':
        return <ThunderboltOutlined className="text-red-500" />
      case 'shipping':
        return <ShoppingCartOutlined className="text-blue-500" />
      case 'vip':
        return <CrownOutlined className="text-purple-500" />
      case 'weekend':
        return <FireOutlined className="text-orange-500" />
      case 'student':
        return <GiftOutlined className="text-green-500" />
      default:
        return <PercentageOutlined />
    }
  }

  const getDiscountColor = type => {
    switch (type) {
      case 'percent':
        return 'text-red-500'
      case 'amount':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch =
      coupon.code?.toLowerCase().includes(searchText.toLowerCase()) || coupon.title?.toLowerCase().includes(searchText.toLowerCase())
    const matchesCategory = activeTab === 'all' || coupon.category === activeTab
    return matchesSearch && matchesCategory
  })

  const tabItems = [
    { key: 'all', label: 'Tất cả' },
    { key: 'new', label: 'Khách mới' },
    { key: 'flash', label: 'Flash Sale' },
    { key: 'shipping', label: 'Free Ship' },
    { key: 'vip', label: 'VIP' },
    { key: 'weekend', label: 'Cuối tuần' },
    { key: 'student', label: 'Sinh viên' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4 dark:from-gray-800 dark:to-gray-800 rounded-xl">
      <SEO title="Mã giảm giá"
        description="Khám phá các mã giảm giá và ưu đãi độc quyền tại SmartMall." />
            <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Title level={1} className="!text-4xl !text-gray-800 !mb-4">
            🎁 Kho Mã Giảm Giá
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Khám phá hàng trăm mã giảm giá hấp dẫn. Tiết kiệm ngay hôm nay!
          </Paragraph>
        </div>

        <Card className="mb-8 shadow-md rounded-xl dark:bg-gray-800">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={12}>
              <Input
                placeholder="Tìm mã giảm giá..."
                allowClear
                size="large"
                prefix={<SearchOutlined />}
                onChange={e => setSearchText(e.target.value)}
                className="w-full dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
              />
            </Col>
            <Col xs={24} md={12}>
              <div className="flex justify-end">
                <Space>
                  <Text type="secondary">Tìm thấy:</Text>
                  <Badge count={filteredCoupons.length} showZero color="blue" />
                  <Text type="secondary">mã giảm giá</Text>
                </Space>
              </div>
            </Col>
          </Row>
        </Card>

        <Card className="coupons-card mb-8 shadow-md rounded-xl dark:bg-gray-800">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            size="large"
            items={tabItems.map(item => ({
              ...item,
              label: (
                <Space>
                  {getCategoryIcon(item.key)}
                  {<span className='dark:text-gray-300'>{item.label}</span>}
                </Space>
              )
            }))}
          />
        </Card>

        {filteredCoupons.length === 0 ? (
          <Card className="text-center py-12 dark:bg-gray-800">
            <Empty description={<span className='dark:text-gray-100'>Không tìm thấy mã giảm giá nào</span>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            {filteredCoupons.map(coupon => (
              <Col xs={24} sm={12} lg={8} key={coupon._id}>
                <Card
                  className="h-full shadow-lg rounded-xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-0 dark:bg-gray-700"
                  cover={
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center">
                      <div className="text-4xl mb-2">{getCategoryIcon(coupon.category)}</div>
                      <div className={`text-3xl font-bold ${getDiscountColor(coupon.discountType)}`}>
                        {coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `${coupon.discountValue.toLocaleString()}đ`}
                      </div>
                      {coupon.maxDiscount && <div className="text-sm opacity-90">Giảm tối đa {coupon.maxDiscount.toLocaleString()}đ</div>}
                    </div>
                  }
                >
                  <Title level={4} className="!mb-2 !text-gray-800">
                    {coupon.title || `Mã: ${coupon.code}`}
                  </Title>
                  <Paragraph className="text-gray-600 text-sm">{coupon.description || 'Áp dụng theo điều kiện hệ thống'}</Paragraph>

                  <div className="bg-gray-50 rounded-lg p-3 mb-3 border-2 border-dashed border-gray-200 dark:bg-gray-700">
                    <div className="flex justify-between items-center dark:bg-gray-700">
                      <div>
                        <Text type="secondary" className="text-xs">
                          Mã giảm giá:
                        </Text>
                        <br />
                        <Text strong className="text-lg text-blue-600 font-mono tracking-wider">
                          {coupon.code}
                        </Text>
                      </div>
                      <Button
                        size="small"
                        type="primary"
                        icon={copiedCoupons.has(coupon.code) ? <CheckOutlined /> : <CopyOutlined />}
                        onClick={() => handleCopyCoupon(coupon.code)}
                        className={copiedCoupons.has(coupon.code) ? 'bg-green-500 border-green-500' : ''}
                      >
                        {copiedCoupons.has(coupon.code) ? 'Đã copy' : 'Copy'}
                      </Button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Đơn tối thiểu: {coupon.minOrder?.toLocaleString() || 0}đ</div>
                  </div>

                  {timeLeft[coupon._id] && (
                    <div className="mb-3 p-2 bg-orange-50 rounded-lg dark:bg-gray-800">
                      <Space className="w-full justify-center">
                        <ClockCircleOutlined className="text-orange-500" />
                        <Text className="text-orange-600 text-sm">
                          Còn {timeLeft[coupon._id].days}d {timeLeft[coupon._id].hours}h {timeLeft[coupon._id].minutes}m
                        </Text>
                      </Space>
                    </div>
                  )}

                  <Divider className="!my-3" />
                  <div className="mt-2">
                    <Button
                      type="primary"
                      block
                      onClick={() => {
                        navigate('/cart', { state: { autoApplyCoupon: coupon.code } })
                      }}
                    >
                      Dùng ngay
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
        <Card className="mt-12 shadow-lg rounded-xl dark:bg-gray-800">
          <Title level={3} className="text-center !mb-6">
            💡 Mẹo Sử Dụng Mã Giảm Giá
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🎯</div>
                <Title level={4}>Kiểm tra điều kiện</Title>
                <Text type="secondary">Đọc kỹ điều kiện áp dụng và giá trị đơn hàng tối thiểu</Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">⏰</div>
                <Title level={4}>Chú ý thời hạn</Title>
                <Text type="secondary">Sử dụng mã trước khi hết hạn để không bỏ lỡ ưu đãi</Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🔄</div>
                <Title level={4}>Kết hợp thông minh</Title>
                <Text type="secondary">Một số mã có có thể kết hợp với khuyến mãi khác để tiết kiệm tối đa</Text>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  )
}

export default CouponPage
