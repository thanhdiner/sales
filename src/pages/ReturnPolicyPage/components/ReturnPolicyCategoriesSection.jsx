import React from 'react'
import { Card, Table, Typography } from 'antd'
import { returnPolicyProductCategories } from '../data'

const { Title, Text } = Typography

const columns = [
  {
    title: 'Danh mục sản phẩm',
    dataIndex: 'category',
    key: 'category',
    render: text => (
      <Text className="!text-sm !font-semibold !text-gray-900 dark:!text-gray-100">
        {text}
      </Text>
    ),
  },
  {
    title: 'Thời hạn đổi trả',
    dataIndex: 'returnPeriod',
    key: 'returnPeriod',
    render: text => (
      <span className="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {text}
      </span>
    ),
  },
  {
    title: 'Điều kiện',
    dataIndex: 'conditions',
    key: 'conditions',
    render: conditions => (
      <div className="space-y-1">
        {conditions.map(condition => (
          <div
            key={condition}
            className="text-xs leading-5 text-gray-600 dark:text-gray-300"
          >
            {condition}
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Lưu ý đặc biệt',
    dataIndex: 'specialNotes',
    key: 'specialNotes',
    render: text => (
      <Text className="!text-xs !leading-5 !text-gray-500 dark:!text-gray-400">
        {text}
      </Text>
    ),
  },
]

const ReturnPolicyCategoriesSection = () => {
  return (
    <Card className="mb-8 rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6">
        <Title
          level={2}
          className="!mb-2 !text-2xl !font-semibold !tracking-[-0.02em] !text-gray-900 dark:!text-gray-100"
        >
          Thời hạn đổi trả theo danh mục
        </Title>

        <p className="mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Thời hạn đổi trả được tính từ ngày nhận hàng và có thể khác nhau tùy theo từng nhóm sản phẩm.
        </p>
      </div>

      <Table
        dataSource={returnPolicyProductCategories}
        columns={columns}
        rowKey="category"
        pagination={false}
        className="mb-4"
        scroll={{ x: 800 }}
      />

      <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/30">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Thông tin bổ sung
        </h3>

        <p className="mt-2 mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Các sản phẩm trong chương trình clearance sale có thể có thời hạn đổi trả ngắn hơn.
        </p>
      </div>
    </Card>
  )
}

export default ReturnPolicyCategoriesSection