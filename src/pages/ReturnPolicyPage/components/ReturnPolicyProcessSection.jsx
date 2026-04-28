import React from 'react'
import { Card, Grid, Steps, Typography } from 'antd'

const { Title } = Typography
const { useBreakpoint } = Grid

const toStepItems = steps =>
  steps.map(step => ({
    title: (
      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {step.title}
      </span>
    ),
    description: (
      <span className="text-sm leading-6 text-gray-600 dark:text-gray-300">
        {step.description}
      </span>
    ),
  }))

const ReturnPolicyProcessSection = ({ content = {} }) => {
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const physical = content.physical || {}
  const online = content.online || {}

  return (
    <>
      <Card className="mb-8 rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <Title
          level={2}
          className="!mb-8 text-center !text-2xl !font-semibold !tracking-[-0.02em] !text-gray-900 dark:!text-gray-100"
        >
          {physical.title}
        </Title>

        <Steps
          current={-1}
          items={toStepItems(physical.steps || [])}
          direction={isMobile ? 'vertical' : 'horizontal'}
          size={isMobile ? 'small' : 'default'}
          className="mb-6"
        />

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/30">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {physical.noteTitle}
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {physical.noteDescription}
          </p>
        </div>
      </Card>

      <Card className="mb-8 rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <Title
          level={2}
          className="!mb-8 text-center !text-2xl !font-semibold !tracking-[-0.02em] !text-gray-900 dark:!text-gray-100"
        >
          {online.title}
        </Title>

        <Steps
          current={-1}
          items={toStepItems(online.steps || [])}
          direction={isMobile ? 'vertical' : 'horizontal'}
          size={isMobile ? 'small' : 'default'}
          className="mb-6"
        />

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/30">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {online.noteTitle}
          </h3>

          {(online.noteDescriptions || []).map(description => (
            <p key={description} className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {description}
            </p>
          ))}
        </div>
      </Card>
    </>
  )
}

export default ReturnPolicyProcessSection
