import { Menu } from 'antd'
import { Link } from 'react-router-dom'

function MenuSider() {
  const items = [
    {
      label: <Link to="/thoi-trang-nam">Thời trang nam</Link>,
      icon: <img src="/icons/384ca1a678c4ee93a0886a204f47645d.png.webp" alt="Thời trang nam" />,
      key: 'thoi-trang-nam'
    }
  ]

  return (
    <>
      <Menu items={items}></Menu>
    </>
  )
}

export default MenuSider
