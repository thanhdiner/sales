import { Check } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useHomeBuildYourKitContent } from './useHomeBuildYourKitContent'
import './BuildYourKitSection.scss'

const defaultScenarios = ['Du lịch', 'Đi học', 'Văn phòng', 'Gaming', 'Nhà cửa', 'Làm đẹp']
const fallbackProductImage = '/icons/widgetsBook.webp'
const positionKeys = ['sunglasses', 'sunscreen', 'battery', 'camera', 'backpack', 'pillow', 'bottle', 'notebook']

const defaultProducts = [
  { label: 'Kính râm', image: '/icons/fashionAccessories.webp', positionKey: 'sunglasses', className: 'sunglasses' },
  { label: 'Kem chống nắng', image: '/icons/beauty.webp', positionKey: 'sunscreen', className: 'sunscreen' },
  { label: 'Pin dự phòng', image: '/icons/consumerElectronics.webp', positionKey: 'battery', className: 'battery' },
  { label: 'Máy ảnh', image: '/icons/cameras.webp', positionKey: 'camera', className: 'camera' },
  { label: 'Balo', image: '/icons/backpackSuitcase.webp', positionKey: 'backpack', className: 'backpack' },
  { label: 'Gối cổ', image: '/icons/homeAndLiving.webp', positionKey: 'pillow', className: 'pillow' },
  { label: 'Bình nước', image: '/icons/sportOutdoor.webp', positionKey: 'bottle', className: 'bottle' },
  { label: 'Sổ tay', image: fallbackProductImage, positionKey: 'notebook', className: 'notebook' }
]

const connectorPaths = [
  'M340 252 C260 202 174 132 88 146',
  'M340 252 C306 164 284 112 232 98',
  'M340 252 C420 154 502 126 588 148',
  'M340 252 C438 242 548 254 616 286',
  'M340 252 C470 294 552 346 586 398',
  'M340 252 C392 334 424 412 436 462',
  'M340 252 C284 330 228 372 190 420',
  'M340 252 C244 270 142 306 82 334'
]

const getTextValue = (value, fallback = '') => (typeof value === 'string' && value.trim() ? value.trim() : fallback)
const getListValue = (value, fallback = []) => (Array.isArray(value) && value.length ? value : fallback)
const isPlainObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value)
const isExternalLink = value => /^(https?:|mailto:|tel:)/i.test(String(value || ''))
const isSafeInternalLink = value => typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
const normalizeLinkValue = value => {
  const link = getTextValue(value)
  if (!link) return ''
  if (isSafeInternalLink(link) || isExternalLink(link)) return link
  return ''
}

const slugifyKitId = value => {
  const slug = String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || ''
}

const sanitizePositionKey = (value, index = 0) => {
  const key = getTextValue(value).replace(/[^a-zA-Z0-9_-]/g, '')
  return key || positionKeys[index % positionKeys.length]
}

function normalizeProduct(item = {}, index = 0, fallback = {}) {
  const product = isPlainObject(item?.product) ? item.product : null
  const resolvedProductId = getTextValue(product?.id || product?._id)
  const resolvedProductTitle = getTextValue(product?.title)
  const resolvedProductImage = getTextValue(product?.thumbnail || product?.image)
  const productId = getTextValue(item.productId, resolvedProductId)
  const productSlug = getTextValue(item.productSlug, getTextValue(product?.slug))
  const customLabel = getTextValue(item.customLabel)
  const customImage = getTextValue(item.customImage)
  const legacyLabel = getTextValue(item.label, getTextValue(fallback.label))
  const legacyImage = getTextValue(item.image, getTextValue(fallback.image))
  const label = getTextValue(customLabel, getTextValue(resolvedProductTitle, legacyLabel || 'Sản phẩm'))
  const image = getTextValue(customImage, getTextValue(resolvedProductImage, legacyImage || fallbackProductImage))
  const positionKey = sanitizePositionKey(item.positionKey || item.className || fallback.positionKey || fallback.className, index)

  return {
    productId,
    productSlug,
    positionKey,
    className: positionKey,
    customLabel,
    customImage,
    categorySlugFallback: getTextValue(item.categorySlugFallback, getTextValue(fallback.categorySlugFallback)),
    label,
    image,
    product,
    unavailable: Boolean(item.unavailable)
  }
}

function normalizeKit(kit = {}, fallbackKit = {}, index = 0, root = {}) {
  const fallbackLabel = root.scenarios?.[index] || fallbackKit.label || fallbackKit.activeScenario || root.activeScenario || defaultScenarios[index] || defaultScenarios[0]
  const label = getTextValue(kit.label, getTextValue(fallbackKit.label, fallbackLabel))
  const id = getTextValue(kit.id, getTextValue(fallbackKit.id, slugifyKitId(label) || `kit-${index + 1}`))
  const products = getListValue(kit.products, getListValue(fallbackKit.products, root.products || defaultProducts))
  const highlights = getListValue(kit.highlights, getListValue(fallbackKit.highlights, root.highlights || []))

  return {
    id,
    label,
    kicker: getTextValue(kit.kicker, getTextValue(fallbackKit.kicker, root.activeCardKicker || 'Combo đang gợi ý')),
    title: getTextValue(kit.title, getTextValue(fallbackKit.title, root.activeCardTitle || root.title || label)),
    description: getTextValue(kit.description, getTextValue(fallbackKit.description, root.description || '')),
    primaryCta: getTextValue(kit.primaryCta, getTextValue(fallbackKit.primaryCta, root.primaryCta || root.primaryCtaFallback || 'Xem combo')),
    primaryCtaLink: normalizeLinkValue(kit.primaryCtaLink) || normalizeLinkValue(fallbackKit.primaryCtaLink),
    categorySlug: getTextValue(kit.categorySlug, getTextValue(fallbackKit.categorySlug)),
    highlights: highlights.slice(0, 4),
    products: products.slice(0, 8).map((product, productIndex) => normalizeProduct(product, productIndex, fallbackKit.products?.[productIndex] || defaultProducts[productIndex]))
  }
}

function createLegacyKits(source = {}, fallback = {}, root = {}) {
  const scenarios = getListValue(source.scenarios, getListValue(fallback.scenarios, defaultScenarios))
  const legacyKit = {
    id: slugifyKitId(source.activeScenario || fallback.activeScenario || scenarios[0]) || 'default-kit',
    label: getTextValue(source.activeScenario, getTextValue(fallback.activeScenario, scenarios[0])),
    kicker: getTextValue(source.activeCardKicker, getTextValue(fallback.activeCardKicker, root.activeCardKicker)),
    title: getTextValue(source.activeCardTitle, getTextValue(fallback.activeCardTitle, root.activeCardTitle)),
    description: getTextValue(source.activeCardDescription, getTextValue(fallback.activeCardDescription, root.description)),
    primaryCta: getTextValue(source.primaryCta, getTextValue(fallback.primaryCta, root.primaryCtaFallback)),
    primaryCtaLink: normalizeLinkValue(source.primaryCtaLink) || normalizeLinkValue(fallback.primaryCtaLink),
    categorySlug: getTextValue(source.categorySlug, getTextValue(fallback.categorySlug)),
    highlights: getListValue(source.highlights, getListValue(fallback.highlights, [])),
    products: getListValue(source.products, getListValue(fallback.products, defaultProducts))
  }

  return scenarios.map((scenario, index) => normalizeKit({
    ...legacyKit,
    id: index === 0 ? legacyKit.id : slugifyKitId(scenario) || `kit-${index + 1}`,
    label: scenario
  }, {}, index, root))
}

function normalizeBuildYourKitContent(content, fallback) {
  const source = isPlainObject(content) ? content : {}
  const fallbackSource = isPlainObject(fallback) ? fallback : {}
  const hasSourceContent = Object.keys(source).length > 0
  const hasSourceKits = Array.isArray(source.kits) && source.kits.length > 0
  const fallbackKits = Array.isArray(fallbackSource.kits) ? fallbackSource.kits : []
  const root = {
    enabled: source.enabled ?? fallbackSource.enabled ?? true,
    eyebrow: getTextValue(source.eyebrow, getTextValue(fallbackSource.eyebrow, 'Build Your Kit')),
    title: getTextValue(source.title, getTextValue(fallbackSource.title, 'Gợi ý combo theo nhu cầu')),
    description: getTextValue(source.description, getTextValue(fallbackSource.description)),
    activeScenario: getTextValue(source.activeScenario, getTextValue(fallbackSource.activeScenario, defaultScenarios[0])),
    activeCardKicker: getTextValue(source.activeCardKicker, getTextValue(fallbackSource.activeCardKicker, 'Combo đang gợi ý')),
    activeCardTitle: getTextValue(source.activeCardTitle, getTextValue(fallbackSource.activeCardTitle, 'Du lịch thông minh')),
    primaryCta: getTextValue(source.primaryCta, getTextValue(fallbackSource.primaryCta, 'Xem combo')),
    primaryCtaFallback: getTextValue(source.primaryCtaFallback, getTextValue(fallbackSource.primaryCtaFallback, getTextValue(source.primaryCta, getTextValue(fallbackSource.primaryCta, 'Xem combo')))),
    secondaryCta: getTextValue(source.secondaryCta, getTextValue(fallbackSource.secondaryCta, 'Tự chọn sản phẩm')),
    secondaryCtaLink: normalizeLinkValue(source.secondaryCtaLink) || normalizeLinkValue(fallbackSource.secondaryCtaLink) || '/products',
    scenarios: getListValue(source.scenarios, getListValue(fallbackSource.scenarios, defaultScenarios)),
    highlights: getListValue(source.highlights, getListValue(fallbackSource.highlights, [])),
    products: getListValue(source.products, getListValue(fallbackSource.products, defaultProducts))
  }

  let kits = []

  if (hasSourceKits) {
    kits = source.kits.map((kit, index) => normalizeKit(kit, fallbackKits[index] || {}, index, root))
  } else if (hasSourceContent) {
    kits = createLegacyKits(source, fallbackSource, root)
  } else if (fallbackKits.length) {
    kits = fallbackKits.map((kit, index) => normalizeKit(kit, {}, index, root))
  } else {
    kits = createLegacyKits(fallbackSource, {}, root)
  }

  kits = kits.filter(kit => kit.id && kit.label)

  return {
    ...root,
    defaultKitId: getTextValue(source.defaultKitId, getTextValue(fallbackSource.defaultKitId, kits[0]?.id || '')),
    kits
  }
}

function getInitialKitId(normalized) {
  if (!normalized?.kits?.length) return ''
  const defaultKit = normalized.kits.find(kit => kit.id === normalized.defaultKitId)
  return defaultKit?.id || normalized.kits[0].id
}

function resolveKitLink(kit, fallback = {}) {
  const configuredLink = normalizeLinkValue(kit?.primaryCtaLink)
  if (configuredLink) return configuredLink
  if (kit?.categorySlug) return `/product-categories/${encodeURIComponent(kit.categorySlug)}`
  const fallbackLink = normalizeLinkValue(fallback.primaryCtaLink)
  if (fallbackLink) return fallbackLink
  return `/products?q=${encodeURIComponent(kit?.label || fallback.activeScenario || '')}`
}

function resolveProductLink(product) {
  if (product?.unavailable) {
    return product.categorySlugFallback ? `/product-categories/${encodeURIComponent(product.categorySlugFallback)}` : ''
  }

  const productSlug = getTextValue(product?.product?.slug, product?.productSlug)
  if (productSlug) return `/products/${encodeURIComponent(productSlug)}`
  if (product?.categorySlugFallback) return `/product-categories/${encodeURIComponent(product.categorySlugFallback)}`
  return ''
}

function SmartLink({ to, className, ariaLabel, title, style, children }) {
  if (isExternalLink(to)) {
    return (
      <a className={className} href={to} aria-label={ariaLabel} title={title} style={style} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return (
    <Link className={className} to={to || '/products'} aria-label={ariaLabel} title={title} style={style}>
      {children}
    </Link>
  )
}

function ChipSvg({ active }) {
  const stroke = active ? '#1677FF' : '#D8E0EA'
  const strokeSoft = active ? '#8EC5FF' : '#EEF2F7'
  const fill = active ? '#F8FBFF' : '#FFFFFF'

  return (
    <svg className="build-kit__tab-bg" viewBox="0 0 110 42" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M20.5 3.5C35.4 2.6 55.8 3.4 75.2 3.2C91.6 3 105 8.2 106.5 20.2C108 32.4 95.8 38.6 79.5 39.1C56.6 39.8 36.2 39.4 20.4 38.2C9.6 37.4 3.6 30.6 4.1 20.8C4.6 10.5 9.8 4.2 20.5 3.5Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.8 5.2C36.1 4.3 56.2 5.1 75.1 4.8C90.8 4.6 102.8 9.5 104 20.1C105.3 31 94.4 36.5 79.1 37C56.8 37.8 36.6 36.8 21 36.9C11.2 37 6.1 29.8 6.5 21C6.9 11.8 10.9 5.8 20.8 5.2Z"
        stroke={strokeSoft}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function InfoBadge({ children, variant = 1 }) {
  const paths = {
    1: {
      outer: 'M17.5 3.8C36 2.8 57.5 3.7 79 3.2C98 2.8 118.5 3.4 132 4.2C142.2 4.8 149.5 11.2 150.2 20.2C150.8 29.6 143.5 36.2 132.8 37.3C111 39.4 88.5 37.4 66.5 38C44.2 38.7 28.5 38.2 17.2 36.5C8.4 35.2 3.8 29.3 4.4 20.5C5 11.2 8.8 4.4 17.5 3.8Z',
      inner: 'M18.2 5.4C36.8 4.4 57.7 5.2 79 4.8C97.7 4.4 117.5 5 131 5.9C140 6.5 146.8 12.1 147.2 20.2C147.6 28.8 141.2 34.6 132.2 35.4C111.2 37.4 88.7 35.7 66.8 36.2C44.5 36.9 29.2 36.1 18.2 34.9C10.8 34.1 7.3 28.7 7.7 20.8C8.1 12.2 10.8 5.9 18.2 5.4Z'
    },
    2: {
      outer: 'M18.5 4.5C38.5 3.2 60.6 4.3 81 3.8C101.5 3.2 119.8 3.6 132.8 5.1C142.6 6.2 150 12.1 149.2 21.5C148.3 31.5 139.5 36.5 128.8 37.2C107 38.6 86 37.1 64.5 37.8C42.5 38.5 27.7 38 17 35.6C8.8 33.8 4.3 28 5 19.8C5.7 10.7 10.2 5 18.5 4.5Z',
      inner: 'M19 6C38.8 5 60.1 5.9 80.5 5.4C100.5 4.9 119 5.5 131.4 6.9C140 7.9 146.5 13 146 21.1C145.3 29.8 137.6 34.5 128.1 35.2C106.8 36.6 86.2 35.4 65 35.9C43 36.5 28.3 36.1 18.6 34.1C11.4 32.7 8.1 27.7 8.4 20.2C8.8 12 11.7 6.5 19 6Z'
    }
  }
  const p = paths[variant] || paths[1]

  return (
    <span className="build-kit__info-badge">
      <svg className="build-kit__info-bg" viewBox="0 0 154 42" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d={p.outer} fill="#FFFFFF" stroke="#EEF2F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={p.inner} stroke="#F5F7FA" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg className="build-kit__info-check" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M3.2 9.4C4.8 10.8 6.3 12 7.4 13.1C9.5 9.8 11.8 6.6 15 3.8" stroke="#1677FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{children}</span>
    </span>
  )
}

function ProductNode({ product, index }) {
  const label = getTextValue(product.customLabel, getTextValue(product.product?.title, product.label))
  const image = getTextValue(product.customImage, getTextValue(product.product?.thumbnail, product.image || fallbackProductImage))
  const link = resolveProductLink(product)
  const positionKey = sanitizePositionKey(product.positionKey, index)
  const className = `kit-map__product kit-map__product--${positionKey} kit-map__product--index-${index}`
  const style = { '--delay': `${index * 0.18}s` }
  const body = (
    <>
      <div className="kit-map__product-image">
        <img
          src={image}
          alt={label}
          loading="lazy"
          onError={event => {
            event.currentTarget.onerror = null
            event.currentTarget.src = fallbackProductImage
          }}
        />
      </div>
      <span className="kit-map__product-label" title={label}>
        {label}
        <svg className="kit-map__label-border" viewBox="0 0 104 24" preserveAspectRatio="none" aria-hidden="true">
          <rect x="1" y="1" width="102" height="22" rx="11" pathLength="1" />
        </svg>
      </span>
    </>
  )

  if (link) {
    return (
      <SmartLink to={link} className={`${className} kit-map__product--link`} ariaLabel={label} title={label} style={style}>
        {body}
      </SmartLink>
    )
  }

  return (
    <div className={className} style={style} title={label}>
      {body}
    </div>
  )
}

function Mascot() {
  return (
    <div className="kit-mascot" aria-label="SmartMall shopping assistant">
      <svg className="kit-mascot__svg" viewBox="0 0 180 230" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="kitSkin" x1="62" x2="118" y1="38" y2="104" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffe7c7" />
            <stop offset="1" stopColor="#f4b183" />
          </linearGradient>
          <linearGradient id="kitLens" x1="116" x2="154" y1="66" y2="104" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f8fdff" />
            <stop offset="1" stopColor="#bcecff" />
          </linearGradient>
        </defs>
        <ellipse className="kit-mascot__shadow" cx="90" cy="213" rx="48" ry="9" />
        <path className="kit-mascot__leg" d="M69 148 H84 L80 204 H65 Z" />
        <path className="kit-mascot__leg" d="M96 148 H111 L116 204 H101 Z" />
        <path className="kit-mascot__shoe" d="M61 203 C68 198 78 199 82 205 L82 211 H58 Z" />
        <path className="kit-mascot__shoe" d="M99 203 C106 198 117 199 122 205 L124 211 H99 Z" />
        <path className="kit-mascot__body" d="M56 100 C72 90 107 90 123 101 C130 122 128 148 119 168 C103 176 76 176 61 168 C52 148 50 121 56 100 Z" />
        <path className="kit-mascot__shirt" d="M75 101 H104 L109 168 H70 Z" />
        <path className="kit-mascot__neck" d="M80 86 H99 V105 C94 111 85 111 80 105 Z" />
        <path className="kit-mascot__ear" d="M58 67 C49 65 49 79 58 79 Z" />
        <path className="kit-mascot__ear" d="M120 67 C129 65 129 79 120 79 Z" />
        <circle className="kit-mascot__head" cx="89" cy="63" r="31" />
        <path className="kit-mascot__hair" d="M59 59 C59 38 76 27 96 30 C115 33 126 47 121 64 C107 55 91 52 75 55 C68 56 63 58 59 59 Z" />
        <path className="kit-mascot__hair-front" d="M72 36 C84 25 107 29 117 45 C101 42 84 45 69 57 Z" />
        <circle className="kit-mascot__eye" cx="78" cy="68" r="2.7" />
        <circle className="kit-mascot__eye" cx="100" cy="68" r="2.7" />
        <path className="kit-mascot__brow" d="M72 61 C77 59 82 59 86 62" />
        <path className="kit-mascot__brow" d="M94 62 C99 59 104 59 108 61" />
        <path className="kit-mascot__nose" d="M89 70 C92 75 91 79 88 81" />
        <path className="kit-mascot__smile" d="M79 85 C86 91 95 91 101 85" />
        <path className="kit-mascot__arm kit-mascot__arm--top" d="M118 110 C130 108 144 101 157 93" />
        <path className="kit-mascot__arm kit-mascot__arm--bottom" d="M61 111 C51 123 47 137 51 151" />
        <path className="kit-mascot__hand" d="M153 88 C150 94 154 101 161 101 C167 100 169 93 165 89 C162 86 156 85 153 88 Z" />
        <path className="kit-mascot__hand" d="M47 148 C42 154 47 162 55 158 C60 152 54 145 47 148 Z" />
        <g className="kit-mascot__glass">
          <circle className="kit-mascot__lens" cx="144" cy="73" r="18" />
          <path className="kit-mascot__shine" d="M134 69 C139 63 147 61 153 65" />
          <path className="kit-mascot__handle" d="M159 88 L164 97" />
        </g>
        <path className="kit-mascot__sparkle" d="M158 45 L161 52 L168 55 L161 58 L158 65 L155 58 L148 55 L155 52 Z" />
      </svg>
    </div>
  )
}

export default function BuildYourKitSection() {
  const { t } = useTranslation('clientHome')
  const { data: content, isLoading, isError } = useHomeBuildYourKitContent()
  const fallback = t('buildYourKitSection', { returnObjects: true })
  const normalized = useMemo(() => normalizeBuildYourKitContent(content, fallback), [content, fallback])
  const [selectedKitId, setSelectedKitId] = useState('')
  const initialKitId = getInitialKitId(normalized)
  const activeKitId = normalized.kits.some(kit => kit.id === selectedKitId) ? selectedKitId : initialKitId

  if (normalized.enabled === false || !normalized.kits.length) return null

  const activeKit = normalized.kits.find(kit => kit.id === activeKitId) || normalized.kits[0]
  const primaryLink = resolveKitLink(activeKit, normalized)
  const secondaryLink = normalized.secondaryCtaLink || '/products'
  const sectionClassName = [
    'build-kit',
    isLoading ? 'build-kit--loading' : '',
    isError ? 'build-kit--fallback' : ''
  ].filter(Boolean).join(' ')

  const handleTabKeyDown = (event, index) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']
    if (!keys.includes(event.key)) return

    event.preventDefault()
    const lastIndex = normalized.kits.length - 1
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? lastIndex
        : event.key === 'ArrowRight'
          ? index === lastIndex ? 0 : index + 1
          : index === 0 ? lastIndex : index - 1
    const tabList = event.currentTarget.closest('[role="tablist"]')
    const tabs = Array.from(tabList?.querySelectorAll('[role="tab"]') || [])

    setSelectedKitId(normalized.kits[nextIndex].id)
    tabs[nextIndex]?.focus()
  }

  return (
    <section className={sectionClassName} aria-labelledby="build-kit-title" aria-busy={isLoading ? 'true' : undefined}>
      <div className="build-kit__content">
        <div className="build-kit__copy">
          <div className="build-kit__eyebrow" aria-label={normalized.eyebrow}>
            <svg viewBox="0 0 190 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M27.5 9.8C44.2 8.7 66.8 9.3 88.5 8.9C111.7 8.5 136.8 8.2 158.1 9.7C170.5 10.6 181.2 18.6 179.4 28.6C177.6 38.8 166.3 43.5 154.2 43.9C126.7 44.9 100.3 43.4 72.8 44.2C53.2 44.8 34.9 45.2 22.2 42.3C12.8 40.2 6.4 33.8 8.2 25.7C10.1 17.3 16.5 10.5 27.5 9.8Z" fill="#F8FBFF" stroke="#2F80ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M26.8 11.2C43.5 10.4 65.4 10.8 88.1 10.3C113.2 9.8 136.5 9.4 157.2 11.1C168.5 12 178.1 19.1 177.1 28.1C176 37.5 165.5 41.6 153.7 42.2C126.2 43.5 99.5 41.6 73.4 42.7C52.8 43.6 34.5 43.8 23.2 40.9C14.8 38.8 9.2 32.7 10.1 26.1C11.2 18.4 17.2 11.7 26.8 11.2Z" stroke="#8EC5FF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
              <path className="build-kit__eyebrow-sparkle" d="M35.5 16.2C36.8 21.2 38.4 23.5 43.1 25.1C38.4 26.7 36.8 29 35.5 34C34.1 29 32.6 26.7 27.8 25.1C32.6 23.5 34.1 21.2 35.5 16.2Z" fill="none" stroke="#1677FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path className="build-kit__eyebrow-sparkle" d="M48.2 13.5C48.8 16.1 49.9 17.2 52.5 18C49.9 18.8 48.8 20 48.2 22.5C47.4 20 46.4 18.8 43.9 18C46.4 17.2 47.4 16.1 48.2 13.5Z" fill="none" stroke="#1677FF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M68 35.5C89 37.2 116.5 36.6 143.5 35.4" stroke="#1677FF" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
            </svg>
            <span>{normalized.eyebrow}</span>
          </div>

          <h2 id="build-kit-title" className="build-kit__title">
            <span>{normalized.title}</span>
            <svg viewBox="0 0 430 58" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M13 39.5C63 36.5 112 40.5 164 37.8C224 34.7 286 37.6 350 35.5C377 34.6 400 35.3 419 37.5" stroke="#FFD38A" strokeWidth="8" strokeLinecap="round" opacity="0.45" />
              <path d="M9 18C6 14 5 11 4 7" stroke="#F47C20" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M19 12C18 8 18.5 5 20 2" stroke="#F47C20" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M405 15C411 12 415 9 419 5" stroke="#1677FF" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M411 24C417 24 421 25 426 27" stroke="#1677FF" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M26 45.5C87 49.5 150 45.5 214 47.5C279 49.5 343 46 402 47.2" stroke="#071B4D" strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />
            </svg>
          </h2>

          {normalized.description ? <p className="build-kit__description">{normalized.description}</p> : null}

          <div className="build-kit__active-card" aria-label={`${activeKit.kicker}: ${activeKit.title}`}>
            <svg className="build-kit__active-card-frame" viewBox="0 0 420 88" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M24 5.5C82 3.8 153 5.2 217 4.5C283 3.8 351 3.5 391 5.4C404 6 415 16 416 29C417 42 416 57 412 68C408 79 397 84 383 84.5C305 87 227 84 148 85C96 85.7 50 85.8 24 83C12 81.7 5 72 4.5 58C4 44 4 30 7 20C10 10 14 6 24 5.5Z" fill="#F8FBFF" stroke="#6DB6FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M25 7.2C84 5.8 154 7 217 6.2C286 5.5 350 5.2 389 7.1C401 7.8 412 17 413 29.5C414 42.8 413 56 409 67C405 77 396 81.5 382 82C304 84.4 227 82.2 149 83.3C96 84 52 83.2 26 80.8C15 79.8 8 71 7.2 58.5C6.5 45 6.5 31 9.4 21.5C12.2 12.5 16 7.8 25 7.2Z" stroke="#BBD9FF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg className="build-kit__active-card-pin" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M9 1.6C5.4 1.6 2.8 4.3 2.8 7.7C2.8 12.2 9 19.7 9 19.7C9 19.7 15.2 12.2 15.2 7.7C15.2 4.3 12.6 1.6 9 1.6Z" stroke="#1677FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 10.2C10.4 10.2 11.4 9.2 11.4 7.8C11.4 6.5 10.4 5.4 9 5.4C7.7 5.4 6.6 6.5 6.6 7.8C6.6 9.2 7.7 10.2 9 10.2Z" stroke="#1677FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="build-kit__active-card-content">
              <p>{activeKit.kicker}</p>
              <h3>{activeKit.title}</h3>
              {activeKit.description ? <span>{activeKit.description}</span> : null}
            </div>
          </div>

          <div className="build-kit__tabs" role="tablist" aria-label="Build Your Kit scenarios">
            {normalized.kits.map((kit, index) => {
              const active = kit.id === activeKit.id

              return (
                <button
                  key={kit.id}
                  id={`build-kit-tab-${kit.id}`}
                  className={active ? 'is-active' : ''}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`build-kit-panel-${kit.id}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setSelectedKitId(kit.id)}
                  onKeyDown={event => handleTabKeyDown(event, index)}
                >
                  <ChipSvg active={active} />
                  <span>{kit.label}</span>
                </button>
              )
            })}
          </div>

          <div className="build-kit__mini-list" aria-label="Combo highlights">
            {activeKit.highlights.slice(0, 2).map((item, index) => (
              <InfoBadge key={`${activeKit.id}-${item}`} variant={index + 1}>{item}</InfoBadge>
            ))}
          </div>

          <div className="build-kit__actions">
            <SmartLink to={primaryLink} className="build-kit__primary combo-btn" ariaLabel={activeKit.primaryCta}>
              <svg viewBox="0 0 250 70" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path className="bg" d="M30 12C60 10 91 11 122 10.5C153 10 184 10.5 207 12C221 13 229 22 229 34C229 47 219 56 204 58C168 61 128 58 89 59C58 60 36 59 22 56C11 54 6 44 7 32C8 20 16 13 30 12Z" fill="#1677FF" stroke="#0F66D8" strokeWidth="2" strokeLinecap="round" />
                <path d="M30 15C61 13.5 91 14 122 13.5C153 13 182 14 205 15.5C217 16.3 225 23 225 34C225 45 216 52 202 54C168 56.5 128 55 90 55.5C59 56 38 55 24 53C14 51.5 10 43 10.8 32.5C11.6 22 18 15.5 30 15Z" stroke="#75B7FF" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
                <path className="spark" d="M26 4L28 11L35 13L28 15L26 22L24 15L17 13L24 11L26 4Z" fill="white" opacity="0.8" />
                <path className="spark" d="M221 4L223 10L229 12L223 14L221 20L219 14L213 12L219 10L221 4Z" fill="#FFD166" opacity="0.95" />
                <path className="scribble" d="M26 44C55 46 88 43 117 44C137 44.7 151 43.5 165 43" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
                <g className="arrow">
                  <path d="M190 34H205" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M199 27L206 34L199 41" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </svg>
              <span className="build-kit__primary-text">{activeKit.primaryCta}</span>
            </SmartLink>
            {normalized.secondaryCta ? (
              <SmartLink to={secondaryLink} className="build-kit__secondary" ariaLabel={normalized.secondaryCta}>
                <Check size={17} />
                <span>{normalized.secondaryCta}</span>
              </SmartLink>
            ) : null}
          </div>
        </div>

        <div className="build-kit__stage-card" id={`build-kit-panel-${activeKit.id}`} role="tabpanel" aria-labelledby={`build-kit-tab-${activeKit.id}`}>
          <div className="kit-map" aria-label={`${activeKit.label} combo product map`}>
            <svg className="kit-map__lines" viewBox="0 0 680 520" aria-hidden="true">
              <g className="kit-map__line-base">
                {connectorPaths.map(path => (
                  <path key={path} d={path} />
                ))}
              </g>
              <g className="kit-map__line-flow">
                {connectorPaths.map((path, index) => (
                  <path key={path} d={path} pathLength="1" style={{ '--line-delay': `${index * 0.18}s` }} />
                ))}
              </g>
            </svg>
            <Mascot />
            {activeKit.products.map((product, index) => (
              <ProductNode key={`${activeKit.id}-${product.productId || product.productSlug || product.label}-${index}`} product={product} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
