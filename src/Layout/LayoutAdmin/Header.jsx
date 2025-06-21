function Header(props) {
  const { colorBgContainer, children } = props

  return (
    <header
      style={{ background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '20px' }}
    >
      {children}
    </header>
  )
}

export default Header
