import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { message } from 'antd'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Coins,
  CreditCard,
  Crown,
  Gem,
  Gift,
  Headphones,
  MessageCircleQuestion,
  ShieldCheck,
  Sparkles,
  Star,
  Truck
} from 'lucide-react'

import ClientBreadcrumb from '@/components/client/Breadcrumb'
import SEO from '@/components/shared/SEO'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { getVipContent } from '@/services/client/content/vip'
import clientVipEn from '@/i18n/locales/en/client/vip.json'
import clientVipVi from '@/i18n/locales/vi/client/vip.json'
import './index.scss'

const quickBenefitIcons = [Gift, Coins, Truck, Headphones]
const benefitIcons = [ShieldCheck, Sparkles, Truck, Headphones, Star, Gem]
const planIcons = [Sparkles, Crown, Gem]
const repeatViewport = { once: false, amount: 0.22 }

const heroMotion = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.58,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1
    }
  }
}

const heroCopyMotion = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

const heroVisualMotion = {
  hidden: { opacity: 0, x: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] }
  }
}

const quickBenefitsMotion = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.46,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08
    }
  }
}

const quickBenefitCardMotion = {
  hidden: { opacity: 0, y: 20, scale: 0.965 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
  }
}

const pricingSectionMotion = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1
    }
  }
}

const pricingHeaderMotion = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.46, ease: [0.22, 1, 0.36, 1] }
  }
}

const pricingGridMotion = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08
    }
  }
}

const pricingCardMotion = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] }
  }
}

const sectionRevealMotion = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.52,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.09
    }
  }
}

const slideLeftMotion = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

const slideRightMotion = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

const cardRevealMotion = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.44, ease: [0.22, 1, 0.36, 1] }
  }
}

const ctaSectionMotion = {
  hidden: { opacity: 0, y: 34, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1
    }
  }
}

const clone = value => JSON.parse(JSON.stringify(value || {}))

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function mergeDefaults(defaultValue, value) {
  if (Array.isArray(defaultValue)) {
    return Array.isArray(value) ? value : clone(defaultValue)
  }

  if (isPlainObject(defaultValue)) {
    const source = isPlainObject(value) ? value : {}
    const keys = new Set([...Object.keys(defaultValue), ...Object.keys(source)])

    return Array.from(keys).reduce((result, key) => {
      result[key] = Object.prototype.hasOwnProperty.call(source, key)
        ? mergeDefaults(defaultValue[key], source[key])
        : clone(defaultValue[key])
      return result
    }, {})
  }

  if (typeof defaultValue === 'string') {
    return typeof value === 'string' && value.trim() ? value : defaultValue
  }

  return value ?? defaultValue ?? ''
}

function isInternalLink(value) {
  return typeof value === 'string' && value.startsWith('/')
}

function isHashLink(value) {
  return typeof value === 'string' && value.startsWith('#')
}

function getPlanLabel(plan, fallback) {
  return plan?.name || fallback
}

function SmartLink({ to, children, className = '', variant = 'primary' }) {
  const linkClassName = `vip-action vip-action--${variant} ${className}`.trim()
  const target = to || '#vip-pricing'

  if (isHashLink(target)) {
    return (
      <a href={target} className={linkClassName}>
        {children}
      </a>
    )
  }

  if (isInternalLink(target)) {
    return (
      <Link to={target} className={linkClassName}>
        {children}
      </Link>
    )
  }

  return (
    <a href={target} className={linkClassName} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="vip-section-header">
      {eyebrow ? <p>{eyebrow}</p> : null}
      <h2>{title}</h2>
      {description ? <span>{description}</span> : null}
    </div>
  )
}

function VipHero({ hero }) {
  return (
    <motion.section
      className="vip-hero-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ ...repeatViewport, amount: 0.28 }}
      variants={heroMotion}
    >
      <motion.div className="vip-hero-section__content" variants={heroCopyMotion}>
        <p className="vip-eyebrow">
          <Crown aria-hidden="true" />
          {hero.eyebrow}
        </p>
        <h1>{hero.title}</h1>
        <p className="vip-hero-section__description">{hero.description}</p>

        {hero.status ? (
          <div className="vip-hero-section__status">
            <Sparkles aria-hidden="true" />
            <span>{hero.status}</span>
          </div>
        ) : null}

        <div className="vip-hero-section__actions">
          <SmartLink to={hero.primaryButtonLink}>
            {hero.primaryButton}
            <ArrowRight aria-hidden="true" />
          </SmartLink>
          <SmartLink to={hero.secondaryButtonLink} variant="secondary">
            {hero.secondaryButton}
          </SmartLink>
        </div>
      </motion.div>

      <motion.div className="vip-hero-section__visual" aria-label={hero.imageAlt || hero.title} variants={heroVisualMotion}>
        <div className="vip-card-visual">
          <div className="vip-card-visual__top">
            <Crown aria-hidden="true" />
            <span>SmartMall</span>
          </div>
          <strong>VIP</strong>
          <small>Silver / Gold / Diamond</small>
          <CreditCard aria-hidden="true" className="vip-card-visual__card-icon" />
        </div>
        <span className="vip-hero-section__coin vip-hero-section__coin--left">
          <Coins aria-hidden="true" />
        </span>
        <span className="vip-hero-section__coin vip-hero-section__coin--right">
          <Gem aria-hidden="true" />
        </span>
        <span className="vip-hero-section__platform" aria-hidden="true" />
      </motion.div>
    </motion.section>
  )
}

function VipQuickBenefits({ items = [] }) {
  if (!items.length) return null

  return (
    <motion.section
      className="vip-quick-benefits"
      aria-label="VIP quick benefits"
      initial="hidden"
      whileInView="visible"
      viewport={{ ...repeatViewport, amount: 0.24 }}
      variants={quickBenefitsMotion}
    >
      {items.map((item, index) => {
        const Icon = quickBenefitIcons[index % quickBenefitIcons.length]
        const visualTypes = ['gift', 'coins', 'truck', 'support']
        const visualType = visualTypes[index % visualTypes.length]

        return (
          <motion.article className="vip-quick-benefit" key={`${item.title}-${index}`} variants={quickBenefitCardMotion}>
            <div className={`vip-quick-benefit__visual vip-quick-benefit__visual--${visualType}`} aria-hidden="true">
              <span className="vip-quick-benefit__glow" />
              <span className="vip-quick-benefit__object">
                <Icon strokeWidth={1.8} />
              </span>
              {visualType === 'gift' ? <span className="vip-quick-benefit__badge">%</span> : null}
              {visualType === 'coins' ? (
                <>
                  <span className="vip-quick-benefit__coin vip-quick-benefit__coin--one" />
                  <span className="vip-quick-benefit__coin vip-quick-benefit__coin--two">P</span>
                </>
              ) : null}
              {visualType === 'truck' ? <span className="vip-quick-benefit__parcel" /> : null}
            </div>

            <div className="vip-quick-benefit__content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>

            <span className="vip-quick-benefit__dots" aria-hidden="true" />
          </motion.article>
        )
      })}
    </motion.section>
  )
}

function VipPricing({ section, plans = [], onSelectPlan }) {
  if (!plans.length) return null

  return (
    <motion.section
      className="vip-section vip-pricing-section"
      id="vip-pricing"
      initial="hidden"
      whileInView="visible"
      viewport={repeatViewport}
      variants={pricingSectionMotion}
    >
      <motion.div variants={pricingHeaderMotion}>
        <SectionHeader {...section} />
      </motion.div>

      <motion.div className="vip-plan-grid" variants={pricingGridMotion}>
        {plans.map((plan, index) => {
          const PlanIcon = planIcons[index % planIcons.length]

          return (
            <motion.article
              className={`vip-plan ${plan.highlighted ? 'vip-plan--highlighted' : ''}`}
              key={`${plan.name}-${index}`}
              variants={pricingCardMotion}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="vip-plan__topline">
                <span className={`vip-plan__icon vip-plan__icon--${index + 1}`} aria-hidden="true">
                  <PlanIcon strokeWidth={2.1} />
                </span>

                <div className="vip-plan__heading">
                  <h3>{plan.name}</h3>
                  {plan.badge ? <span>{plan.badge}</span> : null}
                </div>
              </div>

              <div className="vip-plan__price">
                <strong>{plan.price}</strong>
                {plan.period ? <span>{plan.period}</span> : null}
              </div>

              {plan.description ? <p>{plan.description}</p> : null}

              <ul>
                {(plan.features || []).map(feature => (
                  <li key={feature}>
                    <CheckCircle2 aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`vip-action vip-action--${plan.highlighted ? 'primary' : 'secondary'}`}
                onClick={() => onSelectPlan(plan)}
              >
                {plan.ctaLabel}
                <ArrowRight aria-hidden="true" />
              </button>
            </motion.article>
          )
        })}
      </motion.div>
    </motion.section>
  )
}

function renderComparisonCell(value) {
  if (value === '✓') {
    return (
      <span className="vip-comparison-table__included">
        <CheckCircle2 aria-label="Included" />
      </span>
    )
  }

  return <span>{value}</span>
}

function VipComparison({ section, rows = [], plans = [], language }) {
  if (!rows.length) return null

  const columns = [
    { key: 'silver', label: getPlanLabel(plans[0], 'Silver'), Icon: ShieldCheck },
    { key: 'gold', label: getPlanLabel(plans[1], 'Gold'), Icon: Crown, badge: plans[1]?.badge || 'Popular' },
    { key: 'diamond', label: getPlanLabel(plans[2], 'Diamond'), Icon: Gem }
  ]

  return (
    <motion.section
      className="vip-section vip-comparison-section"
      id="vip-comparison"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.32 }}
      variants={ctaSectionMotion}
    >
      <motion.div className="vip-comparison-section__summary" variants={slideLeftMotion}>
        <SectionHeader {...section} />
        <div className="vip-comparison-visual" aria-hidden="true">
          <span className="vip-comparison-visual__spark vip-comparison-visual__spark--one" />
          <span className="vip-comparison-visual__spark vip-comparison-visual__spark--two" />
          <span className="vip-comparison-visual__spark vip-comparison-visual__spark--three" />
          <span className="vip-comparison-visual__gift" />
          <span className="vip-comparison-visual__bag">
            <Crown />
          </span>
          <span className="vip-comparison-visual__gem">
            <Gem />
          </span>
        </div>
      </motion.div>

      <motion.div className="vip-comparison-table-wrap" variants={slideRightMotion}>
        <div className="vip-comparison-scroll">
          <table className="vip-comparison-table">
          <thead>
            <tr>
              <th>{language === 'en' ? 'Benefit' : 'Quyền lợi'}</th>
              {columns.map(({ key, label, Icon, badge }) => (
                <th key={key} className={`vip-comparison-table__plan vip-comparison-table__plan--${key}`}>
                  <span className="vip-comparison-table__plan-label">
                    <Icon aria-hidden="true" />
                    <span>{label}</span>
                    {badge ? <small>{badge}</small> : null}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.benefit}-${index}`}>
                <td>{row.benefit}</td>
                {columns.map(({ key }) => (
                  <td key={key} className={`vip-comparison-table__cell--${key}`}>
                    {renderComparisonCell(row[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </motion.div>
    </motion.section>
  )
}

function VipBenefits({ section, items = [] }) {
  if (!items.length) return null

  return (
    <motion.section
      className="vip-section vip-featured-benefits"
      id="vip-benefits"
      initial="hidden"
      whileInView="visible"
      viewport={repeatViewport}
      variants={sectionRevealMotion}
    >
      <motion.div className="vip-featured-benefits__intro" variants={slideLeftMotion}>
        {section?.eyebrow ? <p>{section.eyebrow}</p> : null}
        <h2>{section?.title}</h2>
        {section?.description ? <span>{section.description}</span> : null}
      </motion.div>

      <motion.div className="vip-featured-benefits__grid" variants={sectionRevealMotion}>
        {items.map((item, index) => {
          const Icon = benefitIcons[index % benefitIcons.length]
          const visualType = ['discount', 'points', 'shipping', 'support'][index % 4]

          return (
            <motion.article className="vip-featured-benefit-card" key={`${item.title}-${index}`} variants={cardRevealMotion}>
              <div className={`vip-featured-benefit-card__visual vip-featured-benefit-card__visual--${visualType}`} aria-hidden="true">
                <span className="vip-featured-benefit-card__glow" />
                <span className="vip-featured-benefit-card__object">
                  <Icon strokeWidth={1.8} />
                </span>
                {visualType === 'discount' ? <span className="vip-featured-benefit-card__badge">%</span> : null}
                {visualType === 'points' ? (
                  <>
                    <span className="vip-featured-benefit-card__coin vip-featured-benefit-card__coin--one" />
                    <span className="vip-featured-benefit-card__coin vip-featured-benefit-card__coin--two">P</span>
                  </>
                ) : null}
                {visualType === 'shipping' ? <span className="vip-featured-benefit-card__parcel" /> : null}
              </div>

              <div className="vip-featured-benefit-card__content">
                <h3>{item.title}</h3>
                {item.description ? <p>{item.description}</p> : null}
              </div>

              <span className="vip-featured-benefit-card__arrow" aria-hidden="true">
                <ArrowRight />
              </span>
            </motion.article>
          )
        })}
      </motion.div>
    </motion.section>
  )
}

function VipFaq({ section, items = [], openIndex, onToggle }) {
  if (!items.length) return null

  return (
    <motion.section
      className="vip-section vip-section--faq"
      initial="hidden"
      whileInView="visible"
      viewport={repeatViewport}
      variants={sectionRevealMotion}
    >
      <motion.div variants={slideLeftMotion}>
        <SectionHeader {...section} />
      </motion.div>

      <motion.div className="vip-faq-list" variants={sectionRevealMotion}>
        {items.map((item, index) => {
          const isOpen = openIndex === index

          return (
            <motion.article className={`vip-faq-item ${isOpen ? 'vip-faq-item--open' : ''}`} key={`${item.question}-${index}`} variants={cardRevealMotion}>
              <button type="button" aria-expanded={isOpen} onClick={() => onToggle(index)}>
                <span className="vip-faq-item__icon" aria-hidden="true">
                  <MessageCircleQuestion strokeWidth={1.9} />
                </span>
                <span className="vip-faq-item__content">
                  <span className="vip-faq-item__question">{item.question}</span>
                  {isOpen ? <span className="vip-faq-item__answer">{item.answer}</span> : null}
                </span>
                <span className="vip-faq-item__toggle" aria-hidden="true">
                  <ChevronDown />
                </span>
              </button>
            </motion.article>
          )
        })}
      </motion.div>
    </motion.section>
  )
}

function VipCta({ cta }) {
  return (
    <motion.section
      className="vip-cta-section"
      initial="hidden"
      whileInView="visible"
      viewport={repeatViewport}
      variants={sectionRevealMotion}
    >
      <motion.div className="vip-cta-section__icon" variants={slideLeftMotion}>
        <Crown aria-hidden="true" />
      </motion.div>
      <motion.div className="vip-cta-section__content" variants={cardRevealMotion}>
        <h2>{cta.title}</h2>
        <p>{cta.description}</p>
      </motion.div>
      <motion.div className="vip-cta-section__action" variants={slideRightMotion}>
        <SmartLink to={cta.buttonLink}>
          {cta.button}
          <ArrowRight aria-hidden="true" />
        </SmartLink>
      </motion.div>
    </motion.section>
  )
}

export default function Vip() {
  const language = useCurrentLanguage()
  const navigate = useNavigate()
  const user = useSelector(state => state.clientUser?.user)
  const [remoteContent, setRemoteContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openFaqIndex, setOpenFaqIndex] = useState(0)
  const defaults = language === 'en' ? clientVipEn : clientVipVi

  useEffect(() => {
    let mounted = true

    const fetchContent = async () => {
      setLoading(true)

      try {
        const response = await getVipContent(language)
        if (mounted) setRemoteContent(response?.data || null)
      } catch {
        if (mounted) setRemoteContent(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchContent()

    return () => {
      mounted = false
    }
  }, [language])

  const content = useMemo(() => mergeDefaults(defaults, remoteContent), [defaults, remoteContent])
  const handleSelectPlan = useCallback(
    (plan = {}) => {
      const selectedPlan = plan.name || 'VIP'
      const isLoggedIn = Boolean(user?._id || user?.id)

      if (typeof window !== 'undefined') {
        try {
          window.sessionStorage.setItem(
            'pendingVipPlan',
            JSON.stringify({
              name: selectedPlan,
              price: plan.price || '',
              period: plan.period || ''
            })
          )
        } catch {
          // sessionStorage can be blocked in private browsing; the action still continues.
        }
      }

      if (!isLoggedIn) {
        message.info(language === 'en' ? 'Please sign in before choosing a VIP plan.' : 'Vui lòng đăng nhập trước khi chọn gói VIP.')
        navigate('/user/login', { state: { from: { pathname: '/vip' }, vipPlan: selectedPlan } })
        return
      }

      message.info(
        language === 'en'
          ? 'VIP payment flow is being prepared. Your selected plan has been saved.'
          : 'Luồng thanh toán VIP đang được hoàn thiện. Gói bạn chọn đã được ghi nhớ.'
      )
    },
    [language, navigate, user]
  )

  const toggleFaq = useCallback(index => {
    setOpenFaqIndex(current => (current === index ? -1 : index))
  }, [])

  return (
    <main className="vip-page" aria-busy={loading}>
      <SEO title={content.seo.title} description={content.seo.description} url="https://smartmall.site/vip" />

      <div className="vip-page__inner">
        <ClientBreadcrumb
          className="mb-4"
          label={language === 'en' ? 'VIP breadcrumb' : 'Đường dẫn VIP'}
          items={[
            { label: language === 'en' ? 'Home' : 'Trang chủ', to: '/' },
            { label: language === 'en' ? 'VIP Membership' : 'Hội viên VIP' }
          ]}
        />
        <VipHero hero={content.hero} />
        <VipQuickBenefits items={content.quickBenefits} />
        <VipPricing section={content.plansSection} plans={content.plans} onSelectPlan={handleSelectPlan} />
        <VipComparison section={content.comparisonSection} rows={content.comparisonRows} plans={content.plans} language={language} />
        <VipBenefits section={content.benefitsSection} items={content.benefits} />
        <VipFaq section={content.faqSection} items={content.faqs} openIndex={openFaqIndex} onToggle={toggleFaq} />
        <VipCta cta={content.cta} />
      </div>
    </main>
  )
}
