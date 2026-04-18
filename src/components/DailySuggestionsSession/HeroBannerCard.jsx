import React from 'react'
import { RightOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

export default function HeroBannerCard({ config }) {
  const { 
    leftText = 'TIKI', 
    rightText = 'SAMSUNG', 
    title = 'Galaxy A57 | A37 5G', 
    subtitle = 'Bắt Vibe Awesome Cực Nét', 
    imageUrl = 'https://picsum.photos/400/200?random=111',
    link = '#' 
  } = config || {}

  return (
    <div className="HeroBannerCard-wrapper">
      <Link to={link || '#'} className="HeroBannerCard-root">
        <div className="brand-header">
          <span className="tiki-logo" style={{ color: '#1A94FF', fontWeight: 900 }}>{leftText}</span>
          <span style={{ color: '#888', margin: '0 4px' }}>|</span>
          <span style={{ fontWeight: 800, color: '#27272a' }}>{rightText}</span>
        </div>
        
        <div className="banner-image-container">
          <img 
            src={imageUrl || 'https://picsum.photos/400/200?random=111'} 
            alt={title} 
            className="banner-image"
            draggable={false}
            style={{ borderRadius: '8px', zIndex: 1, position: 'relative' }}
          />
        </div>
        
        <div className="banner-content">
          <h3>{title}</h3>
          <p>{subtitle}</p>
          
          <div className="banner-footer">
            <button className="see-more-btn" onClick={(e) => { e.preventDefault(); window.location.href = link || '#' }}>
              Xem thêm <RightOutlined style={{ fontSize: '10px' }} />
            </button>
            
            <div className="signature">
              <span style={{ fontFamily: 'cursive', fontWeight: 'bold' }}>{rightText}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
