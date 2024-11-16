import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import './MenuSider.scss'

function MenuSider() {
  const items = [
    {
      key: 'product-category',
      label: 'Product category',
      type: 'group',
      className: 'menu-sider menu-sider__group--divider',
      children: [
        {
          key: 'men-clothes',
          label: <Link to="/products/men-clothes">Men Clothes</Link>,
          icon: <img className="menu-sider__icon" src="/icons/menClothes.webp" alt="Men Clothes" />,
          className: 'menu-sider menu-sider__item'
        },
        {
          key: 'women-clothes',
          label: <Link to="/products/women-clothes">Women Clothes</Link>,
          icon: <img className="menu-sider__icon" src="/icons/womenClothes.webp" alt="Women Clothes" />,
          className: 'menu-sider menu-sider__item'
        },
        {
          key: 'home-living',
          label: <Link to="/products/home-living">Home & Living</Link>,
          icon: <img className="menu-sider__icon" src="/icons/homeAndLiving.webp" alt="Home & Living" />,
          className: 'menu-sider menu-sider__item'
        },
        {
          key: 'phone-table',
          label: <Link to="/products/phone-table">Phone & Table</Link>,
          icon: <img className="menu-sider__icon" src="/icons/phoneAndTable.webp" alt="Phone & Table" />,
          className: 'menu-sider menu-sider__item'
        },
        {
          key: 'moms-kids-babies',
          label: <Link to="/products/moms-kids-babies">Moms, Kids & Babies</Link>,
          icon: <img className="menu-sider__icon" src="/icons/momsKidsBabies.webp" alt="Moms, Kids & Babies" />,
          className: 'menu-sider menu-sider__item'
        },
        {
          key: 'computer-accessories',
          label: <Link to="/products/computer-accessories">Computer & Accessories</Link>,
          icon: <img className="menu-sider__icon" src="/icons/computerAccessories.webp" alt="Computer & Accessories" />,
          className: 'menu-sider menu-sider__item'
        },
        {
          key: 'consumer-electronics',
          label: <Link to="/products/consumer-electronics">Consumer & Electronics</Link>,
          icon: <img className="menu-sider__icon" src="/icons/consumerElectronics.webp" alt="Consumer & Electronics" />,
          className: 'menu-sider menu-sider__item'
        },
        {
          key: 'beauty',
          label: <Link to="/products/beauty">Beauty</Link>,
          icon: <img className="menu-sider__icon" src="/icons/beauty.webp" alt="Beauty" />,
          className: 'menu-sider menu-sider__item'
        },
        {
          key: 'automotive',
          label: <Link to="/products/automotive">Automotive</Link>,
          icon: <img className="menu-sider__icon" src="/icons/automotive.webp" alt="Automotive" />,
          className: 'menu-sider menu-sider__item'
        },
        {
          key: 'sport-outdoor',
          label: <Link to="/products/sport-outdoor">Sport & Outdoor</Link>,
          icon: <img className="menu-sider__icon" src="/icons/sportOutdoor.webp" alt="Sport & Outdoor" />,
          className: 'menu-sider menu-sider__item'
        },
        {
          key: 'men-shoes',
          label: <Link to="/products/men-shoes">Men Shoes</Link>,
          icon: <img className="menu-sider__icon" src="/icons/menShoes.webp" alt="Men Shoes" />,
          className: 'menu-sider menu-sider__item'
        },
        {
          key: 'electronics-refrigerator',
          label: <Link to="/products/electronics-refrigerator">Electronics & Refrigerator</Link>,
          icon: <img className="menu-sider__icon" src="/icons/electronicsRefrigerator.webp" alt="Electronics & Refrigerator" />,
          className: 'menu-sider menu-sider__item'
        },
        {
          key: 'women-shoes',
          label: <Link to="/products/women-shoes">Women Shoes</Link>,
          icon: <img className="menu-sider__icon" src="/icons/womenShoes.webp" alt="Women Shoes" />,
          className: 'menu-sider menu-sider__item'
        },
        {
          key: 'fashion-accessories',
          label: <Link to="/products/fashion-accessories">Fashion & Accessories</Link>,
          icon: <img className="menu-sider__icon" src="/icons/fashionAccessories.webp" alt="Fashion & Accessories" />,
          className: 'menu-sider menu-sider__item'
        },
        {
          key: 'watches',
          label: <Link to="/products/watches">Watches</Link>,
          icon: <img className="menu-sider__icon" src="/icons/watches.webp" alt="Watches" />,
          className: 'menu-sider menu-sider__item'
        },
        {
          key: 'backpack-suitcase',
          label: <Link to="/products/backpack-suitcase">Backpack & Suitcase</Link>,
          icon: <img className="menu-sider__icon" src="/icons/backpackSuitcase.webp" alt="Backpack & Suitcase" />,
          className: 'menu-sider menu-sider__item'
        },
        {
          key: 'women-bags',
          label: <Link to="/products/women-bags">Women Bags</Link>,
          icon: <img className="menu-sider__icon" src="/icons/womenBags.webp" alt="Women Bags" />,
          className: 'menu-sider menu-sider__item'
        },
        {
          key: 'men-bags',
          label: <Link to="/products/men-bags">Men Bags</Link>,
          icon: <img className="menu-sider__icon" src="/icons/menBags.webp" alt="Men Bags" />,
          className: 'menu-sider menu-sider__item'
        }
      ]
    },
    {
      key: 'utilities',
      label: 'Utilities',
      type: 'group',
      className: 'menu-sider menu-sider__group--divider',
      children: [
        {
          key: 'card-wallet-promotions',
          label: <Link to="/events/card-wallet-promotions">Card & Wallet Promotions</Link>,
          icon: <img className="menu-sider__icon" src="/icons/cardWalletPromotions.webp" alt="Card & Wallet Promotions" />,
          className: 'menu-sider menu-sider__item'
        },
        {
          key: 'pay-bills-top-up-card',
          label: <Link to="/events/pay-bills-top-up-card">Pay Bills & Top-up Card</Link>,
          icon: <img className="menu-sider__icon" src="/icons/payBillTopUpCard.webp" alt="Pay Bills & Top-up Card" />,
          className: 'menu-sider menu-sider__item'
        },
        {
          key: 'buy-now-pay-later',
          label: <Link to="/events/buy-now-pay-later">Buy Now & Pay Later</Link>,
          icon: <img className="menu-sider__icon" src="/icons/buyNowPayLater.webp" alt="Buy Now & Pay Later" />,
          className: 'menu-sider menu-sider__item'
        }
      ]
    }
  ]

  return (
    <>
      <Menu items={items}></Menu>
    </>
  )
}

export default MenuSider
