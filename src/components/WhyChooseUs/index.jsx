import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import {
  ThunderboltOutlined,
  CreditCardOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
  ArrowRightOutlined
} from '@ant-design/icons'
import { CardSpotlight } from '@/components/ui/card-spotlight'

const WhyChooseUs = () => {
  const navigate = useNavigate()
  const viewport = { once: true, amount: 0.2 }

  const items = [
    {
      icon: <ThunderboltOutlined />,
      title: 'Kích hoạt nhanh chóng',
      desc: 'Xử lý đơn nhanh, hỗ trợ trong ngày và luôn có người phản hồi khi cần.',
      iconClass: 'text-blue-600 bg-blue-50'
    },
    {
      icon: <CreditCardOutlined />,
      title: 'Thanh toán linh hoạt',
      desc: 'Hỗ trợ nhiều hình thức thanh toán tiện lợi, phù hợp với nhu cầu của bạn.',
      iconClass: 'text-emerald-600 bg-emerald-50'
    },
    {
      icon: <SafetyCertificateOutlined />,
      title: 'Bảo hành rõ ràng',
      desc: 'Cam kết hỗ trợ nếu phát sinh lỗi trong quá trình sử dụng.',
      iconClass: 'text-violet-600 bg-violet-50'
    },
    {
      icon: <CustomerServiceOutlined />,
      title: 'Hỗ trợ tận tâm',
      desc: 'Tư vấn nhanh, dễ hiểu và đồng hành trong suốt quá trình mua hàng.',
      iconClass: 'text-orange-600 bg-orange-50'
    }
  ]

  return (
    <motion.section
      className="mt-10 rounded-2xl bg-white border border-gray-200"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="max-w-7xl mx-auto px-4 py-10 md:px-6 md:py-12">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          viewport={viewport}
        >
          <span className="inline-flex items-center rounded-full bg-orange-50 text-orange-600 px-4 py-1.5 text-sm font-medium">
            Tại sao nên chọn chúng tôi
          </span>

          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance">
            Mua hàng nhanh, hỗ trợ rõ ràng, <br className="hidden md:block" /> trải nghiệm yên tâm hơn
          </h2>

          <p className="mt-4 text-base md:text-lg text-gray-600 leading-7">
            Chúng tôi tập trung vào những điều quan trọng nhất: xử lý nhanh, thanh toán thuận tiện,
            chính sách rõ ràng và hỗ trợ khi bạn cần.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08, ease: 'easeOut' }}
              viewport={viewport}
            >
              <CardSpotlight
                className="group transition-shadow duration-300 shadow-sm hover:shadow-lg bg-gray-50/50 border border-gray-100"
                color="rgba(79, 140, 255, 0.2)"
                radius={330}
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${item.iconClass}`}
                >
                  {item.icon}
                </div>

                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {item.desc}
                </p>
              </CardSpotlight>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
          viewport={viewport}
        >
          <Button
            type="primary"
            size="large"
            icon={<ArrowRightOutlined />}
            onClick={() => navigate('/products')}
            className="!h-12 !px-6 !rounded-full !font-semibold"
          >
            Khám phá ngay
          </Button>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default WhyChooseUs