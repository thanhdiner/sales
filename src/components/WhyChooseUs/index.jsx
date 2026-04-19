import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import {
  ThunderboltOutlined,
  CreditCardOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
  ArrowRightOutlined,
  RocketOutlined,
  GiftOutlined
} from '@ant-design/icons'
import './WhyChooseUs.scss'

// Pseudo-random deterministic scatter for firework effect
const getScatters = (i) => {
  const angle = (i * 137.5) * (Math.PI / 180)
  const distance = 30 + Math.abs(Math.sin(i * 11)) * 80 // 30 to 110px
  const x = Math.cos(angle) * distance
  const y = Math.sin(angle) * distance - 20 // slightly upward bias
  const scale = 0.5 + Math.abs(Math.sin(i * 7)) * 1.5
  const rotate = Math.sin(i * 19) * 180
  return { x, y, scale, rotate }
}

const TypewriterText = ({ phrases }) => {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [phase, setPhase] = useState('typing') // 'typing', 'waiting', 'exiting'

  const currentPhrase = phrases[phraseIndex]

  useEffect(() => {
    if (phase === 'typing') {
      if (displayedText === currentPhrase) {
        setPhase('waiting')
        return
      }
      const timeout = setTimeout(() => {
        setDisplayedText(currentPhrase.substring(0, displayedText.length + 1))
      }, 35) // Typing speed
      return () => clearTimeout(timeout)
    }

    if (phase === 'waiting') {
      const timeout = setTimeout(() => {
        setPhase('exiting')
      }, 2500) // Wait 2.5s before explosion
      return () => clearTimeout(timeout)
    }

    if (phase === 'exiting') {
      const timeout = setTimeout(() => {
        setDisplayedText('')
        setPhraseIndex((prev) => (prev + 1) % phrases.length)
        setPhase('typing')
      }, 800) // Wait 800ms for the firework animation to complete
      return () => clearTimeout(timeout)
    }
  }, [displayedText, phase, phraseIndex, phrases, currentPhrase])

  return (
    <>
      <AnimatePresence>
        {phase !== 'exiting' && (
          <motion.span key={phraseIndex} exit="exit">
            {displayedText.split(' ').map((word, wIdx, arr) => (
              <React.Fragment key={wIdx}>
                <span className="inline-block">
                  {word.split('').map((char, cIdx) => {
                    const i = wIdx * 100 + cIdx // unique deterministic index per character
                    const { x, y, scale, rotate } = getScatters(i)
                    return (
                      <motion.span
                        key={cIdx}
                        className="inline-block"
                        variants={{
                          exit: {
                            opacity: 0,
                            x,
                            y,
                            scale,
                            rotate,
                            filter: 'blur(6px)',
                            transition: { duration: 0.6 + (i % 3) * 0.1, ease: 'easeOut' }
                          }
                        }}
                      >
                        {char}
                      </motion.span>
                    )
                  })}
                </span>
                {wIdx < arr.length - 1 && ' '}
              </React.Fragment>
            ))}
          </motion.span>
        )}
      </AnimatePresence>
      <span className="inline-block w-[2px] h-[1.1em] bg-gray-400 align-middle animate-pulse -translate-y-[1px] ml-[1px]"></span>
    </>
  )
}

const WhyChooseUs = () => {
  const navigate = useNavigate()
  const viewport = { once: true, amount: 0.15 }

  const descPhrases = [
    'Chúng tôi tập trung vào những điều quan trọng nhất: xử lý nhanh, thanh toán thuận tiện, chính sách rõ ràng và hỗ trợ khi bạn cần.',
    'Cam kết mang đến trải nghiệm mua sắm tuyệt vời nhất với hàng ngàn ưu đãi và dịch vụ chăm sóc khách hàng tận tâm.',
    'Hệ thống bảo mật hiện đại, đảm bảo an toàn tuyệt đối cho mọi giao dịch và thông tin cá nhân của bạn.',
    'Tốc độ giao hàng siêu tốc, luôn đồng hành cùng bạn trên mọi hành trình mua sắm trực tuyến.'
  ]


  const items = [
    {
      icon: <ThunderboltOutlined />,
      title: 'Kích hoạt nhanh chóng',
      desc: (
        <>
          Xử lý đơn nhanh, hỗ trợ <em>trong ngày</em> và luôn có người <em>phản hồi</em> khi cần.
        </>
      ),
      accent: '#3b82f6'
    },
    {
      icon: <RocketOutlined />,
      title: 'Giao hàng siêu tốc',
      desc: (
        <>
          <em>Vận chuyển nhanh</em> toàn quốc, theo dõi đơn hàng <em>realtime</em> mọi lúc.
        </>
      ),
      accent: '#06b6d4'
    },
    {
      icon: <CreditCardOutlined />,
      title: 'Thanh toán linh hoạt',
      desc: (
        <>
          Hỗ trợ nhiều <em>hình thức thanh toán</em> tiện lợi, phù hợp với nhu cầu của bạn.
        </>
      ),
      accent: '#10b981'
    },
    {
      icon: <SafetyCertificateOutlined />,
      title: 'Bảo hành rõ ràng',
      desc: (
        <>
          <em>Cam kết hỗ trợ</em> nếu phát sinh lỗi trong quá trình sử dụng.
        </>
      ),
      accent: '#8b5cf6'
    },
    {
      icon: <GiftOutlined />,
      title: 'Ưu đãi thường xuyên',
      desc: (
        <>
          <em>Flash sale</em>, voucher giảm giá và chương trình <em>tích điểm</em> hấp dẫn.
        </>
      ),
      accent: '#f59e0b'
    },
    {
      icon: <CustomerServiceOutlined />,
      title: 'Hỗ trợ tận tâm',
      desc: (
        <>
          <em>Tư vấn nhanh</em>, dễ hiểu và đồng hành trong suốt quá trình <em>mua hàng</em>.
        </>
      ),
      accent: '#ef4444'
    }
  ]

  const positions = ['pos-top', 'pos-top-right', 'pos-bottom-right', 'pos-bottom', 'pos-bottom-left', 'pos-top-left']

  return (
    <motion.section
      className="why-choose-us mt-10 rounded-2xl border border-gray-200 dark:border-gray-600"
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
          <span className="wcu-pill-spotlight inline-flex items-center rounded-full bg-orange-50 text-orange-600 px-4 py-1.5 text-sm font-medium dark:bg-orange-900/30 dark:text-orange-400">
            Tại sao nên chọn chúng tôi
          </span>

          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance dark:text-gray-100">
            Mua hàng nhanh, hỗ trợ rõ ràng, <br className="hidden md:block" /> trải nghiệm yên tâm hơn
          </h2>

          <p className="mt-4 text-base md:text-lg text-gray-600 leading-7 dark:text-gray-400 min-h-[56px] md:min-h-[84px]">
            <TypewriterText phrases={descPhrases} />
          </p>
        </motion.div>

        {/* ── Hub-spoke layout ── */}
        <div className="wcu-hub mt-12">
          {/* Central hub */}
          <motion.div
            className="wcu-hub__center"
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            viewport={viewport}
          >
            <div className="wcu-hub__icons">
              <span className="wcu-hub__icon-item">◇</span>
              <span className="wcu-hub__icon-item">◆</span>
              <span className="wcu-hub__icon-item">□</span>
              <span className="wcu-hub__icon-item">■</span>
            </div>
          </motion.div>

          {/* 6 connector lines via CSS */}
          <div className="wcu-hub__line line-top" />
          <div className="wcu-hub__line line-top-right" />
          <div className="wcu-hub__line line-bottom-right" />
          <div className="wcu-hub__line line-bottom" />
          <div className="wcu-hub__line line-bottom-left" />
          <div className="wcu-hub__line line-top-left" />

          {/* 6 Cards */}
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              className={`wcu-card ${positions[idx]}`}
              style={{ '--accent': item.accent }}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + idx * 0.07, ease: 'easeOut' }}
              viewport={viewport}
            >
              <div className="wcu-card__connector-icon" style={{ color: item.accent }}>
                {item.icon}
              </div>
              <h3 className="wcu-card__title">{item.title}</h3>
              <p className="wcu-card__desc">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-10 flex justify-center"
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