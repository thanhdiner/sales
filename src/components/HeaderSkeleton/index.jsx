import { Row, Col, Skeleton } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

export default function HeaderSkeleton() {
  return (
    <header className="header header-skeleton">
      <Row align="middle" gutter={12} style={{ width: '100%' }}>
        <Col xs={12} sm={8} md={6} lg={5} xl={5}>
          <div className="header-skeleton__logo">
            <Skeleton.Avatar size={48} shape="square" active />
            <Skeleton.Input className="header-skeleton__site-name" size="small" active />
          </div>
        </Col>

        <Col xs={0} lg={9} xl={9} className="flex items-center justify-center">
          <div className="header-skeleton__nav">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton.Button key={i} className="header-skeleton__nav-item" size="small" active />
            ))}
          </div>
        </Col>

        <Col xs={12} sm={16} md={18} lg={10} xl={10} className="flex justify-end items-center gap-1">
          <div className="header-skeleton__actions">
            <div className="header-skeleton__search">
              <div className="header-skeleton__search-input">
                <SearchOutlined className="header-skeleton__search-icon" />
                <Skeleton.Input className="header-skeleton__search-placeholder" size="small" active />
              </div>
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton.Avatar key={i} className="header-skeleton__icon" size={32} shape="circle" active />
            ))}
          </div>
        </Col>
      </Row>
    </header>
  )
}
