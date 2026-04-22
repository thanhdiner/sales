import React from 'react'
import { FallOutlined, RiseOutlined } from '@ant-design/icons'
import { Card, Col, Empty, Row, Skeleton, Typography } from 'antd'
import { formatCurrency } from '../utils/dashboardTransforms'

const { Text } = Typography

export default function TopProductsSection({ loading, topProducts }) {
  return (
    <Row gutter={[16, 16]} className="products-row">
      <Col span={24}>
        <Card
          title="Sản phẩm bán chạy"
          className="products-card rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
        >
          {loading ? (
            <Row gutter={[16, 16]}>
              {Array.from({ length: 8 }).map((_, idx) => (
                <Col xs={24} sm={12} lg={8} xl={6} xxl={4} key={idx}>
                  <div className="product-item rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                    <div className="product-img-wrapper" style={{ marginBottom: 12 }}>
                      <Skeleton.Avatar shape="square" size={64} active style={{ borderRadius: 12 }} />
                    </div>

                    <div className="product-rank">
                      <Skeleton.Input style={{ width: 32, height: 18, borderRadius: 6 }} active size="small" />
                    </div>

                    <div className="product-info" style={{ paddingRight: 12 }}>
                      <Skeleton.Input
                        style={{
                          width: 128,
                          height: 20,
                          borderRadius: 6,
                          marginBottom: 12
                        }}
                        active
                        size="small"
                      />

                      <div className="product-stats" style={{ marginBottom: 12 }}>
                        <div className="stat" style={{ marginBottom: 6 }}>
                          <Skeleton.Input
                            style={{
                              width: 56,
                              height: 16,
                              borderRadius: 5,
                              marginRight: 6
                            }}
                            active
                            size="small"
                          />
                          <Skeleton.Input style={{ width: 28, height: 16, borderRadius: 5 }} active size="small" />
                        </div>

                        <div className="stat">
                          <Skeleton.Input
                            style={{
                              width: 64,
                              height: 16,
                              borderRadius: 5,
                              marginRight: 6
                            }}
                            active
                            size="small"
                          />
                          <Skeleton.Input style={{ width: 48, height: 16, borderRadius: 5 }} active size="small" />
                        </div>
                      </div>

                      <Skeleton.Button style={{ width: 56, height: 20, borderRadius: 999 }} active size="small" />
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : topProducts?.length > 0 ? (
            <Row gutter={[16, 16]}>
              {topProducts.map((product, index) => (
                <Col xs={24} sm={12} lg={8} xl={6} xxl={4} key={product._id || `${product.name}-${index}`}>
                  <div className="product-item rounded-2xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900">
                    <div className="product-img-wrapper">
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          borderRadius: 12,
                          objectFit: 'cover'
                        }}
                      />
                    </div>

                    <div className="product-rank">#{index + 1}</div>

                    <div className="product-info">
                      <Text strong className="product-name">
                        {product.name}
                      </Text>

                      <div className="product-stats">
                        <div className="stat">
                          <Text type="secondary">Đã bán: </Text>
                          <Text strong>{product.sales}</Text>
                        </div>

                        <div className="stat">
                          <Text type="secondary">Doanh thu: </Text>
                          <Text strong>{formatCurrency(product.revenue)}</Text>
                        </div>
                      </div>

                      <div className={`product-trend ${product.trend}`}>
                        {product.trend === 'up' ? <RiseOutlined /> : <FallOutlined />}
                        <Text>{product.trend === 'up' ? 'Tăng' : 'Giảm'}</Text>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty description="Chưa có dữ liệu sản phẩm bán chạy" />
          )}
        </Card>
      </Col>
    </Row>
  )
}