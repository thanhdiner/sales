import './Widgets.scss'

function Widgets() {
  return (
    <>
      <div className="widgets">
        <div className="widgets__list">
          <div className="widgets__item">
            <a href="#!">
              <div className="widgets__icon--wrap">
                <img src="/icons/widgetsLike.png" alt="TOP DEAL" />
              </div>
              <p className="widgets__title highlight">TOP DEAL</p>
            </a>
          </div>
          <div className="widgets__item">
            <a href="#!">
              <div className="widgets__icon--wrap">
                <img src="/icons/widgetsTrading.png" alt="Diner Trading" />
              </div>
              <p className="widgets__title">Diner Trading</p>
            </a>
          </div>
          <div className="widgets__item">
            <a href="#!">
              <div className="widgets__icon--wrap">
                <img src="/icons/widgetsCoupon.png" alt="Coupon siêu hot" />
              </div>
              <p className="widgets__title">Coupon siêu hot</p>
            </a>
          </div>
          <div className="widgets__item">
            <a href="#!">
              <div className="widgets__icon--wrap">
                <img src="/icons/widgetsSpin.png" alt="Quay số trúng xu" />
              </div>
              <p className="widgets__title">Quay số trúng xu</p>
            </a>
          </div>
          <div className="widgets__item">
            <a href="#!">
              <div className="widgets__icon--wrap">
                <img src="/icons/widgetsForeign.png" alt="Hàng ngoại giá hot" />
              </div>
              <p className="widgets__title">Hàng ngoại giá hot</p>
            </a>
          </div>
          <div className="widgets__item">
            <a href="#!">
              <div className="widgets__icon--wrap">
                <img src="/icons/widgetsMomBaby.webp" alt="Cùng mẹ chăm bé" />
              </div>
              <p className="widgets__title">Cùng mẹ chăm bé</p>
            </a>
          </div>
          <div className="widgets__item">
            <a href="#!">
              <div className="widgets__icon--wrap">
                <img src="/icons/widgetsBook.webp" alt="Mọt sách Diner" />
              </div>
              <p className="widgets__title">Mọt sách Diner</p>
            </a>
          </div>
          <div className="widgets__item">
            <a href="#!">
              <div className="widgets__icon--wrap">
                <img src="/icons/widgetsTechnology.webp" alt="Thế giới công nghệ" />
              </div>
              <p className="widgets__title">Thế giới công nghệ</p>
            </a>
          </div>
          <div className="widgets__item">
            <a href="#!">
              <div className="widgets__icon--wrap">
                <img src="/icons/widgetsCooker.webp" alt="Yêu bếp nghiện nhà" />
              </div>
              <p className="widgets__title">Yêu bếp nghiện nhà</p>
            </a>
          </div>
          <div className="widgets__item">
            <a href="#!">
              <div className="widgets__icon--wrap">
                <img src="/icons/widgetsBeauty.webp" alt="Khỏe đẹp toàn diện" />
              </div>
              <p className="widgets__title">Khỏe đẹp toàn diện</p>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Widgets
