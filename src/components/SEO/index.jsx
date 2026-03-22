import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'SmartMall'
const SITE_URL = process.env.REACT_APP_CLIENT_URL || 'https://smartmall.site'
const DEFAULT_IMAGE = `${SITE_URL}/images/og-default.jpg`
const DEFAULT_DESC =
  'SmartMall – Mua tài khoản game, phần mềm bản quyền chính hãng, giá tốt. Giao hàng nhanh, hỗ trợ tận tâm 24/7.'

/**
 * SEO component – thay thế hàm titles() cũ.
 *
 * Props:
 *   title       {string}  – tiêu đề trang (không cần kèm "| SmartMall", component tự thêm)
 *   description {string}  – meta description
 *   image       {string}  – URL ảnh Open Graph / Twitter Card
 *   url         {string}  – canonical URL (tự động lấy window.location nếu bỏ qua)
 *   noIndex     {boolean} – true để thêm robots noindex (dùng cho trang admin, checkout...)
 *   type        {string}  – og:type, mặc định 'website', dùng 'product' cho trang sản phẩm
 *
 * @example
 *   <SEO title="Trang chủ" description="Khám phá sản phẩm mới nhất..." />
 */
function SEO({
  title,
  description = DEFAULT_DESC,
  image = DEFAULT_IMAGE,
  url,
  noIndex = false,
  type = 'website'
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : SITE_URL)

  return (
    <Helmet>
      {/* ── Basic ── */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* ── Open Graph ── */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="vi_VN" />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}

export default SEO
