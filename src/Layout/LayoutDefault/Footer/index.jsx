import { Col, QRCode, Row } from 'antd'
import React from 'react'
import './Footer.scss'

function Footer() {
  const styleFooterRow = {
    'flex-wrap': 'nowrap',
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
              <a className="footer__small-text--inner--right" target="_blank" rel="noreferrer" href="tel:0345690201">
                1900-6035
              </a>
              (1000 đ/phút, 8-21h kể cả T7, CN)
            </p>
            <a className="footer__small-text" href="/">
              Các câu hỏi thường gặp
            </a>
            <a className="footer__small-text" href="/">
              Gửi yêu cầu hỗ trợ
            </a>
            <a className="footer__small-text" href="/">
              Hướng dẫn đặt hàng
            </a>
            <a className="footer__small-text" href="/">
              Phương thức vận chuyển
            </a>
            <a className="footer__small-text" href="/">
              Chính sách kiểm hàng
            </a>
            <a className="footer__small-text" href="/">
              Chính sách đổi trả
            </a>
            <a className="footer__small-text" href="/">
              Hướng dẫn trả góp
            </a>
            <a className="footer__small-text" href="/">
              Chính sách hàng nhập khẩu
            </a>
            <p className="footer__small-text footer__small-text--inner">
              Hỗ trợ khách hàng:
              <a className="footer__small-text--inner--right" target="_blank" rel="noreferrer" href="mailto:thanhpro0922@gmail.com">
                diner@gmail.com
              </a>
            </p>
          </Col>
          <Col style={{ width: '25%' }}>
            <h3 className="footer__heading">Về Diner</h3>
            <a className="footer__small-text" href="/">
              Giới thiệu về Diner
            </a>
            <a className="footer__small-text" href="/">
              Diner Store Blog
            </a>
            <a className="footer__small-text" href="/">
              Tuyển dụng
            </a>
            <a className="footer__small-text" href="/">
              Chính sách bảo mật thanh toán
            </a>
            <a className="footer__small-text" href="/">
              Chính sách bảo mật thông tin cá nhân
            </a>
            <a className="footer__small-text" href="/">
              Chính sách giải quyết khiếu nại
            </a>
            <a className="footer__small-text" href="/">
              Điều khoản sử dụng
            </a>
            <a className="footer__small-text" href="/">
              Giới thiệu Diner Xu
            </a>
            <a className="footer__small-text" href="/">
              Tiếp thị liên kết cùng Diner
            </a>
            <a className="footer__small-text" href="/">
              Bán hàng doanh nghiệp
            </a>
            <a className="footer__small-text" href="/">
              Điều kiện vận chuyển
            </a>
          </Col>
          <Col style={{ width: '25%' }}>
            <h3 className="footer__heading">Hợp tác và liên kết</h3>
            <a className="footer__small-text" href="/">
              Quy chế hoạt động sàn GDTMĐT
            </a>
            <a className="footer__small-text" href="/">
              Bán hàng cùng Diner
            </a>
            <h3 className="footer__heading" style={{ marginTop: '25px' }}>
              Chứng nhận bởi
            </h3>
            <div className="footer__certification__list">
              <a className="footer__certification__item" href="#!">
                <img src="/icons/certification1.png" alt="bo-cong-thuong-2" />
              </a>
              <a className="footer__certification__item" href="#!">
                <img src="/icons/certification2.svg" alt="bo-cong-thuong" />
              </a>
              <a className="footer__certification__item" href="#!">
                <img src="/icons/certification3.png" alt="DMCA.com Protection Status" />
              </a>
            </div>
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
              <span className="footer__payment__item">
                <img src="/icons/paymentInstalment.svg" alt="Instalment" />
              </span>
            </p>
          </Col>
          <Col style={{ width: '25%' }}>
            <h3 className="footer__heading">Kết nối với chúng tôi</h3>
            <div className="footer__icon__list">
              <a
                className="footer__icon__item"
                href="https://www.facebook.com/programmer.diner"
                rel="noreferrer"
                target="_blank"
                title="Facebook"
              >
                <img src="/icons/iconFb.svg" alt="Facebook" />
              </a>
              <a className="footer__icon__item" href="https://www.youtube.com/@Sontungmtp" rel="noreferrer" target="_blank" title="Youtube">
                <img src="/icons/iconYoutube.svg" alt="Youtube" />
              </a>
              <a className="footer__icon__item" href="https://zalo.me/0345690201" rel="noreferrer" target="_blank" title="Zalo">
                <img src="/icons/iconZalo.svg" alt="Zalo" />
              </a>
            </div>
            <h3 style={{ marginTop: '25px' }} className="footer__heading">
              Tải ứng dụng trên điện thoại
            </h3>
            <div className="footer__downloadApp__list">
              <div className="footer__downloadApp--left">
                <QRCode size={80} bordered={false} value="https://www.youtube.com/@Sontungmtp" />
              </div>
              <div className="footer__downloadApp--right">
                <a
                  title="App Store"
                  target="_blank"
                  rel="noreferrer"
                  className="footer__downloadApp__item"
                  href="https://www.youtube.com/@Sontungmtp"
                >
                  <img src="/images/appstore.png" alt="AppStore" />
                </a>
                <a
                  title="Play Store"
                  target="_blank"
                  rel="noreferrer"
                  className="footer__downloadApp__item"
                  href="https://www.youtube.com/@Sontungmtp"
                >
                  <img src="/images/playstore.png" alt="PlayStore" />
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </footer>
    </>
  )
}

export default Footer
