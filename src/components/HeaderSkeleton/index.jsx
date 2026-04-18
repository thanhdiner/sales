import { Row, Col, Skeleton } from 'antd'

export default function HeaderSkeleton() {
  return (
    <header className="header header-skeleton dark:bg-gray-800" style={{ padding: '10px 70px 10px 32px' }}>
      <Row align="middle" style={{ width: '100%' }}>
        <Col xs={12} sm={8} md={6} lg={6}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Skeleton.Avatar size={48} shape="square" active />
            <Skeleton.Input style={{ width: 120 }} size="small" active />
          </div>
        </Col>
        <Col xs={0} lg={12}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton.Button key={i} style={{ width: 80, height: 24 }} size="small" active />
              ))}
          </div>
        </Col>
        <Col xs={12} lg={6}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, alignItems: 'center' }}>
            <Skeleton.Input style={{ width: 120 }} size="small" active />
            <Skeleton.Avatar size="small" shape="circle" active />
            <Skeleton.Avatar size="small" shape="circle" active />
          </div>
        </Col>
      </Row>
    </header>
  )
}
