import { Col, Row } from 'antd'
import React from 'react'
import './Footer.scss'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Footer() {
  const styleFooterRow = {
    flexWrap: 'wrap',
    rowGap: '32px',
    columnGap: '40px',
    justifyContent: 'flex-start'
  }

  const websiteConfig = useSelector(state => state.websiteConfig.data)

  return (
    <>
      <footer className="footer dark:text-white">
        <div className="footer__easter-egg" title="Cố lên!">
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
            <h3 className="footer__heading">Hỗ trợ khách hàng</h3>
            <p className="dark:text-gray-300 footer__small-text footer__small-text--inner">
              Hotline:
              <a
                className="dark:text-gray-200 footer__small-text--inner--right"
                target="_blank"
                rel="noreferrer"
                href={`tel:${websiteConfig?.contactInfo?.phone || '0823387108'}`}
              >
                {websiteConfig?.contactInfo?.phone || '0823387108'}
              </a>
              (8h - 22h hàng ngày)
            </p>
            <Link className="dark:text-gray-300 footer__small-text" to="/shopping-guide">
              Hướng dẫn mua hàng
            </Link>
            <Link className="dark:text-gray-300 footer__small-text" to="/privacy-policy">
              Chính sách bảo mật
            </Link>
            <Link className="dark:text-gray-300 footer__small-text" to="/return-policy">
              Chính sách đổi trả & hoàn tiền
            </Link>
            <Link className="dark:text-gray-300 footer__small-text" to="/faq">
              Câu hỏi thường gặp (FAQ)
            </Link>
            <p className="dark:text-gray-300 footer__small-text footer__small-text--inner">
              Hỗ trợ khách hàng:
              <a
                className="dark:text-gray-200 footer__small-text--inner--right"
                target="_blank"
                rel="noreferrer"
                href={`mailto:${websiteConfig?.contactInfo?.email || 'smartmall.business.official@gmail.com'}`}
              >
                {websiteConfig?.contactInfo?.email || 'smartmall.business.official@gmail.com'}
              </a>
            </p>
          </Col>
          <Col className="footer__col" style={{ width: '25%', minWidth: '230px', flex: '1 1 230px' }}>
            <h3 className="footer__heading">Thông tin về chúng tôi</h3>
            <Link className="dark:text-gray-300 footer__small-text" to="/about">
              Giới thiệu chúng tôi
            </Link>
            <Link className="dark:text-gray-300 footer__small-text" to="/terms-of-service">
              Điều khoản sử dụng
            </Link>
            <Link className="dark:text-gray-300 footer__small-text" to="/cooperation-contact">
              Liên hệ hợp tác
            </Link>
          </Col>
          <Col className="footer__col" style={{ width: '25%', minWidth: '230px', flex: '1 1 230px' }}>
            <h3 className="footer__heading">Dịch vụ & sản phẩm</h3>
            <Link className="dark:text-gray-300 footer__small-text" to="/game-account">
              Tài khoản game
            </Link>
            <Link className="dark:text-gray-300 footer__small-text" to="/">
              Nâng cấp bản quyền
            </Link>
            <Link className="dark:text-gray-300 footer__small-text" to="/coupons">
              Thẻ cào & Voucher
            </Link>
            <Link className="dark:text-gray-300 footer__small-text" to="/special-package">
              Gói dịch vụ đặc biệt
            </Link>
          </Col>
          <Col className="footer__col" style={{ width: '25%', minWidth: '230px', flex: '1 1 230px' }}>
            <h3 className="footer__heading">Phương thức thanh toán</h3>
            <p className="footer__payment__list">
              <span className="footer__payment__item dark:bg-gray-200 rounded-sm">
                <img src="/icons/paymentVisa.svg" alt="Visa" />
              </span>
              <span className="footer__payment__item">
                <img src="/icons/paymentMastercard.svg" alt="Mastercard" />
              </span>
              <span className="footer__payment__item">
                <img src="/icons/paymentJCB.svg" alt="JCB" />
              </span>
              <span className="footer__payment__item">
                <img src="/icons/paymentMomo.svg" alt="Momo" />
              </span>
              <span className="footer__payment__item">
                <img src="/icons/paymentZalopay.svg" alt="ZaloPay" />
              </span>
              <span className="footer__payment__item">
                <img src="/icons/paymentViettelMoney.svg" alt="ViettelMoney" />
              </span>
              <span className="footer__payment__item">
                <img src="/icons/paymentVnpay.svg" alt="Vnpay" />
              </span>
              <span className="footer__payment__item dark:bg-gray-200 rounded-sm">
                <img src="/icons/paymentPayInCash.svg" alt="Pay-In-Cash" />
              </span>
            </p>
          </Col>
          <Col className="footer__col" style={{ width: '25%', minWidth: '230px', flex: '1 1 230px' }}>
            <h3 className="footer__heading">Kết nối với chúng tôi</h3>
            <div className="footer__icon__list">
              <a
                className="footer__icon__item"
                href={`https://www.facebook.com/${websiteConfig?.contactInfo?.facebook || 'lunashop.business.official'}`}
                rel="noreferrer"
                target="_blank"
                title="Facebook"
              >
                <img src="/icons/iconFb.svg" alt="Facebook" />
              </a>
              <a className="footer__icon__item" href="#!" rel="noreferrer" title="Youtube">
                <img src="/icons/iconYoutube.svg" alt="Youtube" />
              </a>
              <a className="footer__icon__item" href="https://zalo.me/0823387108" rel="noreferrer" target="_blank" title="Zalo">
                <img src="/icons/iconZalo.svg" alt="Zalo" />
              </a>
            </div>
          </Col>
        </Row>
      </footer>
    </>
  )
}

export default Footer
