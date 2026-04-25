import { Button, Col } from 'antd'
import { Link } from 'react-router-dom'

export default function HeaderLogo({ websiteConfig, isDesktop, onOpenMenu }) {
  return (
    <Col xs={12} sm={8} md={6} lg={5} xl={5} className="flex items-center gap-2">
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
          className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-sm shadow-sm object-contain ml-2 md:ml-8"
        />

        {isDesktop && (
          <span className="l-2 text-xl md:text-2xl font-semibold text-black dark:text-white whitespace-nowrap transition-all duration-500 ease-in-out overflow-hidden inline-block">
            {websiteConfig?.siteName}
          </span>
        )}
      </Link>
    </Col>
  )
}
