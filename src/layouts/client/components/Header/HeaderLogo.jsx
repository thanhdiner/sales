import { Button, Col } from 'antd'
import { Link } from 'react-router-dom'

export default function HeaderLogo({ websiteConfig, isDesktop, onOpenMenu }) {
  return (
    <Col xs={14} sm={10} md={8} lg={5} xl={5} className="flex items-center gap-2">
      {!isDesktop && (
        <Button
          aria-label="Mở menu danh mục"
          className="header__hamburger dark:text-white"
          type="text"
          onClick={onOpenMenu}
          icon={
            <span className="flex flex-col gap-[4px]">
              <span className="block w-5 h-[2px] bg-current" />
              <span className="block w-5 h-[2px] bg-current" />
              <span className="block w-5 h-[2px] bg-current" />
            </span>
          }
        />
      )}

      <Link className="header__logo--wrap" to="/">
        <img
          src={websiteConfig?.logoUrl}
          alt={websiteConfig?.siteName || 'Logo'}
          className="w-8 h-8 bg-white rounded-lg shadow-sm object-contain ml-2 md:ml-8"
          loading="eager"
          decoding="async"
          fetchpriority="high"
        />

        <span className="header__site-name header__site-name--sketch" aria-label={websiteConfig?.siteName || 'Smartmall'}>
          <svg width="180" height="56" viewBox="0 0 180 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <text
              x="8"
              y="36"
              fontFamily="Comic Sans MS, Segoe Print, cursive"
              fontSize="28"
              fontWeight="800"
              fill="#071B4D"
              transform="rotate(-0.6 8 36)"
            >
              Smartmall
            </text>
            <path
              d="M10 43C45 45 82 42.5 124 43.5"
              stroke="#1677FF"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.45"
            />
          </svg>
          <span>{websiteConfig?.siteName}</span>
        </span>
      </Link>
    </Col>
  )
}
