import React from 'react'
import { Card, Table, Typography } from 'antd'

const { Title, Text } = Typography

const ReturnPolicyCategories = ({ content = {} }) => {
  const columns = [
    {
      title: content.columns?.category,
      dataIndex: 'category',
      key: 'category',
      render: category => (
        <Text className="!text-sm !font-semibold !text-gray-900 dark:!text-gray-100">
          {category}
        </Text>
      ),
    },
    {
      title: content.columns?.returnPeriod,
      dataIndex: 'returnPeriod',
      key: 'returnPeriod',
      render: returnPeriod => (
        <span className="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {returnPeriod}
        </span>
      ),
    },
    {
      title: content.columns?.conditions,
      dataIndex: 'conditions',
      key: 'conditions',
      render: conditions => {
        return (
          <div className="space-y-1">
            {(conditions || []).map(condition => (
              <div
                key={condition}
                className="text-xs leading-5 text-gray-600 dark:text-gray-300"
              >
                {condition}
              </div>
            ))}
          </div>
        )
      },
    },
    {
      title: content.columns?.specialNotes,
      dataIndex: 'specialNotes',
      key: 'specialNotes',
      render: specialNotes => (
        <Text className="!text-xs !leading-5 !text-gray-500 dark:!text-gray-400">
          {specialNotes}
        </Text>
      ),
    },
  ]

  return (
    <Card className="mb-8 rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6">
        <Title
          level={2}
          className="!mb-2 !text-2xl !font-semibold !tracking-[-0.02em] !text-gray-900 dark:!text-gray-100"
        >
          {content.title}
        </Title>

        <p className="mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
          {content.description}
        </p>
      </div>

      <Table
        dataSource={content.items || []}
        columns={columns}
        rowKey="key"
        pagination={false}
        className="mb-4"
        scroll={{ x: 800 }}
      />

      <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/30">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {content.extraTitle}
        </h3>

        <p className="mt-2 mb-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
          {content.extraDescription}
        </p>
      </div>
    </Card>
  )
}

export default ReturnPolicyCategories
