import React from 'react'
import { Card, Empty } from 'antd'
import { useTranslation } from 'react-i18next'

const CouponsEmptyState = () => {
  const { t } = useTranslation('clientCoupons')

  return (
    <Card className="py-12 text-center dark:bg-gray-800">
      <Empty description={<span className="dark:text-gray-100">{t('empty.noCoupons')}</span>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </Card>
  )
}

export default CouponsEmptyState
