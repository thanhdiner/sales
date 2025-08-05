import { Col, QRCode, Row } from 'antd'
import React from 'react'
import './Footer.scss'
import { Link } from 'react-router-dom'

function Footer() {
  const styleFooterRow = {
    flexWrap: 'nowrap',
    columnGap: '20px',
    justifyContent: 'space-between'
  }

  return (
    <>
      <footer className="footer">
        <Row style={styleFooterRow}>
          <Col style={{ width: '25%' }}>
            <h3 className="footer__heading">Hỗ trợ khách hàng</h3>
            <p className="footer__small-text footer__small-text--inner">
              Hotline:
              <a className="footer__small-text--inner--right" target="_blank" rel="noreferrer" href="tel:+84345690201">
                0823387108
              </a>
              (8h - 22h hàng ngày)
            </p>
            <Link className="footer__small-text" to="/shopping-guide">
              Hướng dẫn mua hàng
            </Link>
            <Link className="footer__small-text" to="/privacy-policy">
              Chính sách bảo mật
            </Link>
            <Link className="footer__small-text" to="/return-policy">
              Chính sách đổi trả & hoàn tiền
            </Link>
            <Link className="footer__small-text" to="/payment-guide">
              Hướng dẫn thanh toán
            </Link>
            <Link className="footer__small-text" to="/faq">
              Câu hỏi thường gặp (FAQ)
            </Link>
            <p className="footer__small-text footer__small-text--inner">
              Hỗ trợ khách hàng:
              <a
                className="footer__small-text--inner--right"
                target="_blank"
                rel="noreferrer"
                href="mailto:lunashop.business.official@gmail.com"
              >
                lunashop.business.official@gmail.com
              </a>
            </p>
          </Col>
          <Col style={{ width: '25%' }}>
            <h3 className="footer__heading">Thông tin về chúng tôi</h3>
            <Link className="footer__small-text" to="/about">
              Giới thiệu chúng tôi
            </Link>
            <Link className="footer__small-text" to="/terms-of-service">
              Điều khoản sử dụng
            </Link>
            <Link className="footer__small-text" to="/cooperation-contact">
              Liên hệ hợp tác
            </Link>
          </Col>
          <Col style={{ width: '25%' }}>
            <h3 className="footer__heading">Dịch vụ & sản phẩm</h3>
            <Link className="footer__small-text" to="/game-account">
              Tài khoản game
            </Link>
            <Link className="footer__small-text" to="/">
              Nâng cấp bản quyền
            </Link>
            <Link className="footer__small-text" to="/coupons">
              Thẻ cào & Voucher
            </Link>
            <Link className="footer__small-text" to="/special-package">
              Gói dịch vụ đặc biệt
            </Link>
          </Col>
          <Col style={{ width: '25%' }}>
            <h3 className="footer__heading">Phương thức thanh toán</h3>
            <p className="footer__payment__list">
              <span className="footer__payment__item">
                <img src="/icons/paymentVisa.svg" alt="Visa" />
              </span>
              <span className="footer__payment__item">
                <img src="/icons/paymentMastercard.svg" alt="Mastercard" />
              </span>
              <span className="footer__payment__item">
                <img src="/icons/paymentJCB.svg" alt="JCB" />
              </span>
              <span className="footer__payment__item">
                <img src="/icons/paymentMomo.svg" alt="M" />
              </span>
              <span className="footer__payment__item">
                <img src="/icons/paymentZaloPay.svg" alt="ViettelMoney" />
              </span>
              <span className="footer__payment__item">
                <img src="/icons/paymentViettelMoney.svg" alt="ZaloPay" />
              </span>
              <span className="footer__payment__item">
                <img src="/icons/paymentVnpay.svg" alt="Vnpay" />
              </span>
              <span className="footer__payment__item">
                <img src="/icons/paymentPayInCash.svg" alt="Pay-In-Cash" />
              </span>
            </p>
          </Col>
          <Col style={{ width: '25%' }}>
            <h3 className="footer__heading">Kết nối với chúng tôi</h3>
            <div className="footer__icon__list">
              <a
                className="footer__icon__item"
                href="https://www.facebook.com/lunashop.business.official"
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
