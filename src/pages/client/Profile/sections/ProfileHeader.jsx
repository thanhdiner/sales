import { Typography } from 'antd'

const { Title, Text } = Typography

function ProfileHeader({ t }) {
  return (
    <div className="mb-9 text-left">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">{t('header.eyebrow')}</p>

      <Title level={2} className="!mb-2 !text-3xl !font-semibold !tracking-[-0.03em] !text-gray-900 dark:!text-white">
        {t('header.title')}
      </Title>

      <Text className="block max-w-xl !text-base !leading-7 !text-gray-600 dark:!text-gray-300">{t('header.description')}</Text>
    </div>
  )
}

export default ProfileHeader
