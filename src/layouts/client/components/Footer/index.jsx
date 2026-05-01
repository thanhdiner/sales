import { Col, Row } from 'antd'
import React, { useMemo } from 'react'
import './index.scss'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { getFooterContent } from '@/services/client/content/footer'
import { normalizeFooterContent } from './footerContent'

function Footer() {
  const styleFooterRow = {
    flexWrap: 'wrap',
    rowGap: '32px',
    columnGap: '40px',
    justifyContent: 'flex-start'
  }

  const websiteConfig = useSelector(state => state.websiteConfig.data)
  const language = useCurrentLanguage()
  const { data: footerData } = useQuery({
    queryKey: ['footer-content', language],
    queryFn: async () => {
      const response = await getFooterContent(language)
      return response?.data || null
    },
    staleTime: 0,
    refetchOnMount: 'always',
    meta: { persist: false },
    retry: false
  })
  const content = useMemo(
    () => normalizeFooterContent(footerData, { language, websiteConfig }),
    [footerData, language, websiteConfig]
  )
  const contact = content.customerSupport || {}
  const paymentMethods = content.payment?.methods || []
  const socialLinks = content.social?.links || []

  const renderFooterLink = link => {
    const className = 'dark:text-gray-300 footer__small-text'
    const isExternal = link.external || /^(https?:)?\/\//i.test(link.url) || /^(mailto|tel):/i.test(link.url) || link.url.startsWith('#')

    if (isExternal) {
      return (
        <a
          key={`${link.label}-${link.url}`}
          className={className}
          href={link.url}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noreferrer' : undefined}
        >
          {link.label}
        </a>
      )
    }

    return (
      <Link key={`${link.label}-${link.url}`} className={className} to={link.url}>
        {link.label}
      </Link>
    )
  }

  return (
    <>
      <footer className="footer dark:text-white">
        <div className="footer__easter-egg" title={content.easterEgg}>
          <div className="smoke-container">
            <span className="smoke-puff puff-1"></span>
            <span className="smoke-puff puff-2"></span>
            <span className="smoke-puff puff-3"></span>
          </div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3063/3063822.png"
            alt="Chibi Rider"
            className="scooter-icon chibi-scooter"
          />
        </div>

        <Row style={styleFooterRow}>
          <Col className="footer__col" style={{ width: '25%', minWidth: '230px', flex: '1 1 230px' }}>
            <h3 className="footer__heading">{contact.title}</h3>

            <p className="dark:text-gray-300 footer__small-text footer__small-text--inner">
              {contact.hotlineLabel}
              <a
                className="dark:text-gray-200 footer__small-text--inner--right"
                target="_blank"
                rel="noreferrer"
                href={`tel:${contact.phone}`}
              >
                {contact.phone}
              </a>
              {contact.workingTime}
            </p>

            {contact.links?.map(renderFooterLink)}

            <p className="dark:text-gray-300 footer__small-text footer__small-text--inner">
              {contact.supportEmailLabel}
              <a
                className="dark:text-gray-200 footer__small-text--inner--right"
                target="_blank"
                rel="noreferrer"
                href={`mailto:${contact.email}`}
              >
                {contact.email}
              </a>
            </p>
          </Col>

          <Col className="footer__col" style={{ width: '25%', minWidth: '230px', flex: '1 1 230px' }}>
            <h3 className="footer__heading">{content.about?.title}</h3>
            {content.about?.links?.map(renderFooterLink)}
          </Col>

          <Col className="footer__col" style={{ width: '25%', minWidth: '230px', flex: '1 1 230px' }}>
            <h3 className="footer__heading">{content.services?.title}</h3>
            {content.services?.links?.map(renderFooterLink)}
          </Col>

          <Col className="footer__col" style={{ width: '25%', minWidth: '230px', flex: '1 1 230px' }}>
            <h3 className="footer__heading">{content.payment?.title}</h3>

            <p className="footer__payment__list">
              {paymentMethods.map(method => (
                <span
                  key={`${method.label}-${method.icon}`}
                  className={`footer__payment__item ${/visa|payincash|pay-in-cash/i.test(method.label) ? 'dark:bg-gray-200 rounded-sm' : ''}`}
                >
                  <img src={method.icon} alt={method.label} />
                </span>
              ))}
            </p>
          </Col>

          <Col className="footer__col" style={{ width: '25%', minWidth: '230px', flex: '1 1 230px' }}>
            <h3 className="footer__heading">{content.social?.title}</h3>

            <div className="footer__icon__list">
              {socialLinks.map(link => (
                <a
                  key={`${link.label}-${link.url}`}
                  className="footer__icon__item"
                  href={link.url}
                  rel={link.external ? 'noreferrer' : undefined}
                  target={link.external ? '_blank' : undefined}
                  title={link.label}
                >
                  <img src={link.icon} alt={link.label} />
                </a>
              ))}
            </div>
          </Col>
        </Row>
      </footer>
    </>
  )
}

export default Footer
