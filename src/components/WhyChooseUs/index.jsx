import React from 'react'
import './WhyChooseUs.scss'
import { useNavigate } from 'react-router-dom'

const WhyChooseUs = () => {
  const navigate = useNavigate()

  const items = [
    {
      icon: '🔑',
      title: 'Kích hoạt nhanh chóng',
      desc: 'Trong vòng 2–3h, hỗ trợ 24/7 kể cả ngày nghỉ',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      darkBg: 'from-blue-900/20 to-cyan-900/20'
    },
    {
      icon: '💳',
      title: 'Thanh toán linh hoạt',
      desc: 'COD, chuyển khoản, ví điện tử, thẻ quốc tế tiện lợi',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      darkBg: 'from-emerald-900/20 to-teal-900/20'
    },
    {
      icon: '🛡',
      title: 'Bảo hành uy tín',
      desc: 'Đảm bảo key hoạt động đúng, hỗ trợ đổi nếu lỗi',
      gradient: 'from-purple-500 to-violet-500',
      bgGradient: 'from-purple-50 to-violet-50',
      darkBg: 'from-purple-900/20 to-violet-900/20'
    },
    {
      icon: '⭐',
      title: 'Uy tín & hỗ trợ 24/7',
      desc: 'Hàng nghìn khách hàng tin tưởng, tư vấn tận tâm',
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      darkBg: 'from-amber-900/20 to-orange-900/20'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden rounded-xl mt-10">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full"></div>
        <div className="absolute top-1/2 right-20 w-32 h-32 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-gradient-to-br from-green-400 to-blue-400 rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/70 dark:bg-gray-800/70 rounded-full border border-white/20 dark:border-gray-700/50 mb-6">
            <span className="text-sm font-medium bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Tại sao chọn chúng tôi
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-800 via-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-white dark:via-purple-400 dark:to-blue-400">
              Trải nghiệm mua sắm
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">hoàn hảo nhất</span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Chúng tôi cam kết mang đến cho bạn dịch vụ tốt nhất với những giá trị vượt trội
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, idx) => (
            <div key={idx} className="group relative">
              <div
                className={`
                relative bg-white/80 dark:bg-gray-800/80
                p-8 rounded-3xl shadow-lg hover:shadow-2xl 
                border border-white/20 dark:border-gray-700/50
                transform hover:-translate-y-4 transition-all duration-500 ease-out
                hover:scale-105 cursor-pointer
                before:absolute before:inset-0 before:rounded-3xl
                before:bg-gradient-to-br before:${item.bgGradient} dark:before:bg-gradient-to-br dark:before:${item.darkBg}
                before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
                overflow-hidden
              `}
              >
                <div
                  className={`
                  absolute inset-0 bg-gradient-to-br ${item.bgGradient} dark:bg-gradient-to-br dark:${item.darkBg}
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl
                `}
                ></div>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl"></div>

                <div className="relative z-10">
                  <div className="relative mb-6">
                    <div
                      className={`
                      w-20 h-20 rounded-2xl bg-gradient-to-br ${item.gradient}
                      flex items-center justify-center mb-4 mx-auto
                      shadow-lg group-hover:shadow-xl transform group-hover:scale-110
                      transition-all duration-300 group-hover:rotate-6
                    `}
                    >
                      <div className="text-3xl">{item.icon}</div>
                    </div>

                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300 delay-150"></div>
                  </div>

                  <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300 whitespace-nowrap">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                    {item.desc}
                  </p>

                  <div
                    className={`
                    w-0 h-1 bg-gradient-to-r ${item.gradient} rounded-full mt-4
                    group-hover:w-full transition-all duration-500 delay-200
                  `}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-semibold hover:from-orange-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
           onClick={() => navigate('/products')}
          >
            <span>Khám phá ngay</span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
