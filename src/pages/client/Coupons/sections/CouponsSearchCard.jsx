import React from 'react'
import { Card, Col, Input, Row, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Text } = Typography

const CouponsSearchCard = ({ searchText, onSearchChange, resultCount }) => {
  const { t } = useTranslation('clientCoupons')
  const resultSuffix = t(resultCount === 1 ? 'search.foundSuffixSingular' : 'search.foundSuffix', {
    defaultValue: t('search.foundSuffix')
  })

  return (
    <Card className="coupons-search-card mb-6 rounded-xl border border-gray-200 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <Row gutter={[16, 12]} align="middle">
        <Col xs={24} md={16}>
          <div className="w-full max-w-xl">
            <Input
              value={searchText}
              placeholder={t('search.placeholder')}
              allowClear
              size="large"
              onChange={event => onSearchChange(event.target.value)}
              className="coupon-search-input h-11 w-full rounded-lg border-gray-300 bg-white text-sm text-gray-900 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-100"
            />
          </div>
        </Col>

        <Col xs={24} md={8}>
          <div className="flex justify-start md:justify-end">
            <Text className="!text-sm !text-gray-600 dark:!text-slate-300">
              {t('search.foundPrefix')} <span className="font-semibold text-gray-900 dark:text-slate-100">{resultCount}</span> {resultSuffix}
            </Text>
          </div>
        </Col>
      </Row>
    </Card>
  )
}

export default CouponsSearchCard
