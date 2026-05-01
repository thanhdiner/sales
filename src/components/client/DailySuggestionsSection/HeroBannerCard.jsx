import React from 'react'
import { RightOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function HeroBannerCard({ config }) {
  const { t } = useTranslation('clientHome')

  if (!config?.imageUrl && !config?.title) {
    return null
  }

  const {
    leftText,
    rightText,
    title,
    subtitle,
    imageUrl,
    link = '#'
  } = config

  return (
    <div className="HeroBannerCard-wrapper">
      <Link to={link || '#'} className="HeroBannerCard-root">
        {(leftText || rightText) && (
          <div className="brand-header">
            {leftText && (
              <span className="tiki-logo" style={{ color: '#1A94FF', fontWeight: 900 }}>
                {leftText}
              </span>
            )}

            {leftText && rightText && <span className="brand-separator">|</span>}

            {rightText && <span className="brand-name">{rightText}</span>}
          </div>
        )}

        {imageUrl && (
          <div className="banner-image-container">
            <img
              src={imageUrl}
              alt={title || rightText || 'Banner'}
              className="banner-image"
              draggable={false}
              style={{ borderRadius: '8px', zIndex: 1, position: 'relative' }}
            />
          </div>
        )}

        {(title || subtitle) && (
          <div className="banner-content">
            {title && <h3>{title}</h3>}
            {subtitle && <p>{subtitle}</p>}

            <div className="banner-footer">
              <button className="see-more-btn" onClick={(e) => { e.preventDefault(); window.location.href = link || '#' }}>
                {t('dailySuggestionsSection.heroBanner.seeMore')} <RightOutlined style={{ fontSize: '10px' }} />
              </button>

              {rightText && (
                <div className="signature">
                  <span>{rightText}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Link>
    </div>
  )
}