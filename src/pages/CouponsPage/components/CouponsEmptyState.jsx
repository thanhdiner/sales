import React from 'react'
import { Card, Empty } from 'antd'

const CouponsEmptyState = () => {
  return (
    <Card className="py-12 text-center dark:bg-gray-800">
      <Empty
        description={<span className="dark:text-gray-100">Không tìm thấy mã giảm giá nào</span>}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    </Card>
  )
}

export default CouponsEmptyState
