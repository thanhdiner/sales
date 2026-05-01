import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { message } from 'antd'
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
  Home,
  ShieldCheck,
  Sparkles,
  Star,
  Truck
} from 'lucide-react'

import SEO from '@/components/shared/SEO'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { getVipContent } from '@/services/client/content/vip'
import clientVipEn from '@/i18n/locales/en/client/vip.json'
import clientVipVi from '@/i18n/locales/vi/client/vip.json'
import './index.scss'

const fallbackImage = '/icons/cardWalletPromotions.webp'

const quickBenefitIcons = [Gift, Coins, Truck, Headphones]
const benefitIcons = [ShieldCheck, Sparkles, Truck, Headphones, Star, Gem]

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
    return <a href={target} className={linkClassName}>{children}</a>
  }

  if (isInternalLink(target)) {
    return <Link to={target} className={linkClassName}>{children}</Link>
  }

  return <a href={target} className={linkClassName} target="_blank" rel="noreferrer">{children}</a>
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

function VipBreadcrumb({ language }) {
  return (
    <nav className="vip-breadcrumb" aria-label="Breadcrumb">
      <Link to="/">
        <Home aria-hidden="true" />
        {language === 'en' ? 'Home' : 'Trang chủ'}
      </Link>
      <span aria-hidden="true">/</span>
      <span>VIP Membership</span>
    </nav>
  )
}

function VipHero({ hero, heroImage }) {
  return (
    <section className="vip-hero-section">
      <div className="vip-hero-section__content">
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
      </div>

      <div className="vip-hero-section__visual" aria-label={hero.imageAlt || hero.title}>
        <img src={heroImage} alt={hero.imageAlt || hero.title} />
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
      </div>
    </section>
  )
}

function VipQuickBenefits({ items = [] }) {
  if (!items.length) return null

  return (
    <section className="vip-quick-benefits" aria-label="VIP quick benefits">
      {items.map((item, index) => {
        const Icon = quickBenefitIcons[index % quickBenefitIcons.length]

        return (
          <article className="vip-quick-benefit" key={`${item.title}-${index}`}>
            <span>
              <Icon aria-hidden="true" />
            </span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        )
      })}
    </section>
  )
}

function VipPricing({ section, plans = [], onSelectPlan }) {
  if (!plans.length) return null

  return (
    <section className="vip-section" id="vip-pricing">
      <SectionHeader {...section} />

      <div className="vip-plan-grid">
        {plans.map((plan, index) => (
          <article className={`vip-plan ${plan.highlighted ? 'vip-plan--highlighted' : ''}`} key={`${plan.name}-${index}`}>
            <div className="vip-plan__heading">
              <h3>{plan.name}</h3>
              {plan.badge ? <span>{plan.badge}</span> : null}
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
          </article>
        ))}
      </div>
    </section>
  )
}

function renderComparisonCell(value) {
  if (value === '✓') {
    return <CheckCircle2 aria-label="Included" />
  }

  return <span>{value}</span>
}

function VipComparison({ section, rows = [], plans = [], language }) {
  if (!rows.length) return null

  const labels = [
    getPlanLabel(plans[0], 'Silver'),
    getPlanLabel(plans[1], 'Gold'),
    getPlanLabel(plans[2], 'Diamond')
  ]

  return (
    <section className="vip-section" id="vip-comparison">
      <SectionHeader {...section} />

      <div className="vip-comparison-scroll">
        <table className="vip-comparison-table">
          <thead>
            <tr>
              <th>{language === 'en' ? 'Benefit' : 'Quyền lợi'}</th>
              {labels.map(label => <th key={label}>{label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.benefit}-${index}`}>
                <td>{row.benefit}</td>
                <td>{renderComparisonCell(row.silver)}</td>
                <td>{renderComparisonCell(row.gold)}</td>
                <td>{renderComparisonCell(row.diamond)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function VipBenefits({ section, items = [] }) {
  if (!items.length) return null

  return (
    <section className="vip-section" id="vip-benefits">
      <SectionHeader {...section} />

      <div className="vip-benefit-grid">
        {items.map((item, index) => {
          const Icon = benefitIcons[index % benefitIcons.length]

          return (
            <article className="vip-benefit-card" key={`${item.title}-${index}`}>
              <span className="vip-benefit-card__icon">
                <Icon aria-hidden="true" />
              </span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function VipFaq({ section, items = [], openIndex, onToggle }) {
  if (!items.length) return null

  return (
    <section className="vip-section vip-section--faq">
      <SectionHeader {...section} />

      <div className="vip-faq-list">
        {items.map((item, index) => {
          const isOpen = openIndex === index

          return (
            <article className={`vip-faq-item ${isOpen ? 'vip-faq-item--open' : ''}`} key={`${item.question}-${index}`}>
              <button type="button" aria-expanded={isOpen} onClick={() => onToggle(index)}>
                <span>{item.question}</span>
                <ChevronDown aria-hidden="true" />
              </button>
              {isOpen ? <p>{item.answer}</p> : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}

function VipCta({ cta }) {
  return (
    <section className="vip-cta-section">
      <div className="vip-cta-section__icon">
        <Crown aria-hidden="true" />
      </div>
      <div>
        <h2>{cta.title}</h2>
        <p>{cta.description}</p>
      </div>
      <SmartLink to={cta.buttonLink}>
        {cta.button}
        <ArrowRight aria-hidden="true" />
      </SmartLink>
    </section>
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
  const heroImage = content.hero?.imageUrl || fallbackImage

  const handleSelectPlan = useCallback((plan = {}) => {
    const selectedPlan = plan.name || 'VIP'
    const isLoggedIn = Boolean(user?._id || user?.id)

    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem('pendingVipPlan', JSON.stringify({
          name: selectedPlan,
          price: plan.price || '',
          period: plan.period || ''
        }))
      } catch {
        // sessionStorage can be blocked in private browsing; the action still continues.
      }
    }

    if (!isLoggedIn) {
      message.info(language === 'en'
        ? 'Please sign in before choosing a VIP plan.'
        : 'Vui lòng đăng nhập trước khi chọn gói VIP.')
      navigate('/user/login', { state: { from: { pathname: '/vip' }, vipPlan: selectedPlan } })
      return
    }

    message.info(language === 'en'
      ? 'VIP payment flow is being prepared. Your selected plan has been saved.'
      : 'Luồng thanh toán VIP đang được hoàn thiện. Gói bạn chọn đã được ghi nhớ.')
  }, [language, navigate, user])

  const toggleFaq = useCallback(index => {
    setOpenFaqIndex(current => (current === index ? -1 : index))
  }, [])

  return (
    <main className="vip-page" aria-busy={loading}>
      <SEO title={content.seo.title} description={content.seo.description} url="https://smartmall.site/vip" />

      <div className="vip-page__inner">
        <VipBreadcrumb language={language} />
        <VipHero hero={content.hero} heroImage={heroImage} />
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
