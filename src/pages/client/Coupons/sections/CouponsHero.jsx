import React from 'react'
import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Title, Paragraph } = Typography

const CouponsHero = () => {
  const { t } = useTranslation('clientCoupons')

  return (
    <div className="mb-10 text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">{t('hero.eyebrow')}</p>

      <Title level={1} className="!mb-4 !text-4xl !font-semibold !tracking-[-0.03em] !text-gray-900 dark:!text-white">
        {t('hero.title')}
      </Title>

      <Paragraph className="mx-auto !mb-0 max-w-2xl !text-base !leading-7 !text-gray-600 dark:!text-gray-300">
        {t('hero.description')}
      </Paragraph>
    </div>
  )
}

export default CouponsHero
