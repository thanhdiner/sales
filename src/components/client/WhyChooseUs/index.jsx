import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  ThunderboltOutlined,
  CreditCardOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
  ArrowRightOutlined,
  RocketOutlined,
  GiftOutlined
} from '@ant-design/icons'
import { useHomeWhyChooseUsContent } from './useHomeWhyChooseUsContent'
import './WhyChooseUs.scss'

const WHY_CHOOSE_US_ITEMS = [
  {
    key: 'fastActivation',
    Icon: ThunderboltOutlined,
    accent: '#3b82f6'
  },
  {
    key: 'fastDelivery',
    Icon: RocketOutlined,
    accent: '#06b6d4'
  },
  {
    key: 'flexiblePayment',
    Icon: CreditCardOutlined,
    accent: '#10b981'
  },
  {
    key: 'clearWarranty',
    Icon: SafetyCertificateOutlined,
    accent: '#8b5cf6'
  },
  {
    key: 'regularOffers',
    Icon: GiftOutlined,
    accent: '#f59e0b'
  },
  {
    key: 'dedicatedSupport',
    Icon: CustomerServiceOutlined,
    accent: '#ef4444'
  }
]

const getTextValue = (value, fallback = '') => {
  if (typeof value !== 'string') return fallback

  const normalizedValue = value.trim()

  return normalizedValue && normalizedValue !== '[object Object]' ? value : fallback
}

const getTextArray = (value, fallback = []) => {
  const normalizedValue = Array.isArray(value)
    ? value.filter(item => typeof item === 'string' && item.trim() && item.trim() !== '[object Object]')
    : []

  return normalizedValue.length ? normalizedValue : Array.isArray(fallback) ? fallback : []
}

const renderEmphasisText = value => {
  if (!value) return null

  return String(value)
    .split(/(<em>.*?<\/em>)/gi)
    .filter(Boolean)
    .map((part, index) => {
      const match = part.match(/^<em>(.*?)<\/em>$/i)

      return match ? <em key={index}>{match[1]}</em> : <React.Fragment key={index}>{part}</React.Fragment>
    })
}

const getScatters = i => {
  const angle = i * 137.5 * (Math.PI / 180)
  const distance = 30 + Math.abs(Math.sin(i * 11)) * 80
  const x = Math.cos(angle) * distance
  const y = Math.sin(angle) * distance - 20
  const scale = 0.5 + Math.abs(Math.sin(i * 7)) * 1.5
  const rotate = Math.sin(i * 19) * 180
  return { x, y, scale, rotate }
}

const TypewriterText = ({ phrases }) => {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [phase, setPhase] = useState('typing')

  const currentPhrase = phrases[phraseIndex] || ''

  useEffect(() => {
    if (!phrases.length) {
      return
    }

    if (phase === 'typing') {
      if (displayedText === currentPhrase) {
        setPhase('waiting')
        return
      }

      const timeout = setTimeout(() => {
        setDisplayedText(currentPhrase.substring(0, displayedText.length + 1))
      }, 35)

      return () => clearTimeout(timeout)
    }

    if (phase === 'waiting') {
      const timeout = setTimeout(() => {
        setPhase('exiting')
      }, 2500)

      return () => clearTimeout(timeout)
    }

    if (phase === 'exiting') {
      const timeout = setTimeout(() => {
        setDisplayedText('')
        setPhraseIndex(prev => (prev + 1) % phrases.length)
        setPhase('typing')
      }, 800)

      return () => clearTimeout(timeout)
    }
  }, [displayedText, phase, phraseIndex, phrases, currentPhrase])

  useEffect(() => {
    setPhraseIndex(0)
    setDisplayedText('')
    setPhase('typing')
  }, [phrases])

  return (
    <>
      <AnimatePresence>
        {phase !== 'exiting' && (
          <motion.span key={`${phraseIndex}-${currentPhrase}`} exit="exit">
            {displayedText.split(' ').map((word, wIdx, arr) => (
              <React.Fragment key={wIdx}>
                <span className="inline-block">
                  {word.split('').map((char, cIdx) => {
                    const i = wIdx * 100 + cIdx
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
  const { t } = useTranslation('clientHome')
  const { data: content } = useHomeWhyChooseUsContent()
  const viewport = { once: true, amount: 0.15 }
  const fallbackDescPhrases = t('whyChooseUsSection.descPhrases', { returnObjects: true })
  const descPhrases = getTextArray(content?.descPhrases, fallbackDescPhrases)

  const items = WHY_CHOOSE_US_ITEMS.map(({ key, Icon, accent }) => ({
    key,
    icon: <Icon />,
    title: getTextValue(content?.items?.[key]?.title, t(`whyChooseUsSection.items.${key}.title`)),
    desc: getTextValue(content?.items?.[key]?.desc, t(`whyChooseUsSection.items.${key}.desc`)),
    accent
  }))

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
            {getTextValue(content?.eyebrow, t('whyChooseUsSection.eyebrow'))}
          </span>

          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-balance dark:text-gray-100">
            {getTextValue(content?.title, t('whyChooseUsSection.title'))}
          </h2>

          <p className="mt-4 text-base md:text-lg text-gray-600 leading-7 dark:text-gray-400 min-h-[56px] md:min-h-[84px]">
            <TypewriterText phrases={descPhrases} />
          </p>
        </motion.div>

        <div className="wcu-hub mt-12">
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

          <div className="wcu-hub__line line-top" />
          <div className="wcu-hub__line line-top-right" />
          <div className="wcu-hub__line line-bottom-right" />
          <div className="wcu-hub__line line-bottom" />
          <div className="wcu-hub__line line-bottom-left" />
          <div className="wcu-hub__line line-top-left" />

          {items.map((item, idx) => (
            <motion.div
              key={item.key}
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

              <p className="wcu-card__desc">
                {renderEmphasisText(item.desc)}
              </p>
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
            {getTextValue(content?.cta, t('whyChooseUsSection.cta'))}
          </Button>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default WhyChooseUs
