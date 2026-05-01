import React from 'react'
import { Card, Typography } from 'antd'

const { Title } = Typography

const PolicyCard = ({
  id,
  title,
  icon: Icon,
  iconClassName = 'text-blue-500',
  titleClassName = '',
  className = '',
  children,
}) => {
  return (
    <Card id={id} className={`shadow-lg rounded-xl dark:bg-gray-800 ${className}`}>
      <Title level={2} className={`!mb-6 !text-2xl ${titleClassName}`}>
        {Icon ? <Icon className={`mr-3 ${iconClassName}`} /> : null}
        {title}
      </Title>
      {children}
    </Card>
  )
}

export default PolicyCard
