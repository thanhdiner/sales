import React, { useState, useEffect } from 'react'
import { Shield, Zap, Headphones, DollarSign, Store, Clock, Users, Heart, Star, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SEO from '@/components/SEO'

const AboutPage = () => {

  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: Shield,
      title: 'Bảo mật đơn giản',
      description: 'Mọi giao dịch đều qua hệ thống ngân hàng và ví điện tử phổ biến.',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Zap,
      title: 'Giao hàng nhanh',
      description: 'Gửi thông tin tài khoản, phần mềm nhanh nhất có thể, đa phần trong ngày.',
      color: 'from-cyan-400 to-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    {
      icon: Headphones,
      title: 'Hỗ trợ tận tâm',
      description: 'Có thắc mắc gì, mình trả lời sớm nhất có thể (thường trong giờ hành chính).',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: DollarSign,
      title: 'Giá hợp lý',
      description: 'Luôn cố gắng bán đúng giá – không rẻ nhất, không đắt nhất.',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  const timeline = [
    {
      year: '2024',
      title: 'Khởi đầu nhỏ',
      description: 'Bắt đầu bán vài tài khoản game và phần mềm bản quyền cho bạn bè và người quen.',
      icon: Star
    },
    {
      year: '2025',
      title: 'Làm website riêng',
      description: 'Lập trang web để bán hàng cho khách lạ. Số lượng đơn chưa nhiều, vẫn chủ yếu là cá nhân tự làm.',
      icon: Sparkles
    }
  ]

  const stats = [
    { number: '100+', label: 'Khách hàng hài lòng' },
    { number: '24/7', label: 'Hỗ trợ nhanh chóng' },
    { number: '100+', label: 'Giao dịch hoàn tất' },
    { number: '1 năm', label: 'Kinh nghiệm' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden dark:from-gray-800 dark:to-gray-800 rounded-xl">
      <SEO
        title="Về SmartMall"
        description="SmartMall – Shop nhỏ chuyên bán tài khoản game và phần mềm bản quyền. Uy tín, rõ ràng, giá hợp lý, hỗ trợ tận tâm."
        url="https://smartmall.site/about"
      />
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-300/10 to-pink-300/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div
          className={`text-center py-20 px-4 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="max-w-4xl mx-auto">
            {/* Floating Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Sparkles className="w-4 h-4 mr-2" />
              Chào mừng đến với shop nhỏ của chúng mình
            </div>

            {/* Main Icon */}
            <div className="relative mb-8">
              <div className="inline-block p-8 bg-white/80 rounded-3xl shadow-2xl border border-white/50">
                <Store className="w-16 h-16 text-blue-600 mx-auto" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6 leading-tight">
              Về shop nhỏ này
            </h1>

            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8 dark:text-gray-300">
              Xin chào! Mình là một cá nhân bắt đầu bán tài khoản game và phần mềm bản quyền từ năm 2025. Shop còn nhỏ, mọi thứ đều tự làm,
              tự support. Mình luôn cố gắng mang lại trải nghiệm tốt, uy tín và rõ ràng cho khách hàng – dù chỉ mới bắt đầu!
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/70 rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-sm font-medium dark:text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4 dark:text-gray-100">Shop nhỏ nhưng có gì?</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto dark:text-gray-300">
                Dù là shop nhỏ nhưng chúng mình luôn cố gắng mang đến những dịch vụ tốt nhất
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                const isActive = activeFeature === index

                return (
                  <div
                    key={index}
                    className={`group relative bg-white/80 rounded-3xl p-8 shadow-lg border border-white/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                      isActive ? 'scale-105 shadow-2xl' : ''
                    } dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid`}
                    onMouseEnter={() => setActiveFeature(index)}
                  >
                    {/* Gradient Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}
                    ></div>

                    {/* Icon */}
                    <div
                      className={`relative mb-6 ${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300 dark:text-gray-100">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed dark:text-gray-300">{feature.description}</p>

                    {/* Hover Arrow */}
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <ArrowRight className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Story & Timeline Section */}
        <div className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* About Owner */}
              <div className="bg-white/80 rounded-3xl p-8 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Ai đứng sau shop?</h3>
                </div>

                <div className="space-y-4 text-gray-700 leading-relaxed dark:text-gray-300">
                  <p>
                    Mình là coder tự học, yêu thích công nghệ và phần mềm bản quyền. Shop này được lập ra để kiếm thêm thu nhập, đồng thời
                    mang lại những giải pháp phần mềm chính hãng, uy tín cho bạn bè và mọi người xung quanh.
                  </p>
                  <p>
                    Rất mong nhận được góp ý, phản hồi từ các bạn để cải thiện dần. Số đơn chưa nhiều, nên mỗi đơn mình đều cố gắng làm kỹ
                    và support tận tình nhất có thể!
                  </p>

                  <div className="flex items-center pt-4 text-pink-500 font-medium">
                    <Heart className="w-5 h-5 mr-2 fill-current" />
                    Cảm ơn bạn đã ghé thăm!
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white/80 rounded-3xl p-8 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Hành trình ngắn gọn</h3>
                </div>

                <div className="space-y-8">
                  {timeline.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <div key={index} className="relative flex items-start group">
                        {/* Timeline Line */}
                        {index < timeline.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-blue-300 to-cyan-300"></div>
                        )}

                        {/* Icon */}
                        <div className="relative z-10 bg-gradient-to-r from-blue-500 to-cyan-500 w-12 h-12 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex-1">
                          <div className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-2">
                            {item.year}
                          </div>
                          <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300 dark:text-gray-100">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 leading-relaxed dark:text-gray-300">{item.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/90 rounded-3xl p-12 shadow-2xl border border-white/50 relative overflow-hidden dark:bg-gray-800 dark:outline dark:outline-white dark:outline-1 dark:outline-solid">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full translate-x-20 translate-y-20"></div>

              <div className="relative z-10">
                <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  Bạn muốn thử mua?
                </h3>

                <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed dark:text-gray-300">
                  Cứ chat hoặc inbox – mình luôn trả lời nhanh nhất có thể. Hy vọng bạn sẽ hài lòng với trải nghiệm mua bán nhỏ này!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                    onClick={() => navigate('/products')}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Xem sản phẩm
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>

                  <button
                    className="px-8 py-4 border-2 border-blue-300 text-blue-700 rounded-2xl font-bold text-lg hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 hover:scale-105"
                    onClick={() =>
                      window.open('https://docs.google.com/forms/d/1ks3veXy1wEajPUkukR0ovatRGUjcB7O5EkmjXZ3_wE8/edit', '_blank')
                    }
                  >
                    Góp ý cho shop
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
