import dayjs from 'dayjs'
import { Card, Typography } from 'antd'
import { CameraOutlined, CloseCircleFilled } from '@ant-design/icons'
import { getAvatarFallback } from '../utils/profileUtils'

const { Title, Text } = Typography

function ProfileSummaryCard({ avatarPreview, className = '', inputRef, onFileChange, onRemoveAvatar, t, user }) {
  return (
    <Card
      className={`rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:col-span-4 ${className}`}
      styles={{ body: { padding: '28px' } }}
    >
      <div className="text-center">
        <div className="relative mb-6 inline-block">
          <div className="relative mx-auto h-28 w-28">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt={t('avatar.alt')}
                className="h-28 w-28 cursor-pointer rounded-full border border-gray-200 object-cover shadow-sm dark:border-gray-700"
                onClick={() => inputRef.current.click()}
              />
            ) : (
              <div
                className="flex h-28 w-28 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-3xl font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200"
                onClick={() => inputRef.current.click()}
              >
                {getAvatarFallback(user, t('avatar.fallback'))}
              </div>
            )}

            <button
              type="button"
              onClick={() => inputRef.current.click()}
              className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label={t('avatar.change')}
            >
              <CameraOutlined />
            </button>

            {avatarPreview && (
              <CloseCircleFilled
                className="absolute -right-1 -top-1 cursor-pointer rounded-full bg-white text-xl text-gray-400 transition-colors hover:text-gray-700 dark:bg-gray-800 dark:hover:text-gray-200"
                onClick={onRemoveAvatar}
                title={t('avatar.remove')}
              />
            )}
          </div>

          <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} className="!hidden" />
        </div>

        <Title level={4} className="!mb-1 !text-lg !font-semibold !text-gray-900 dark:!text-white">
          {user.fullName || user.username}
        </Title>

        <Text className="block !text-sm !text-gray-500 dark:!text-gray-400">@{user.username}</Text>

        <div className="mt-5 space-y-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/30">
            <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{t('profileCard.status')}</p>
            <p className="mb-0 text-sm text-gray-600 dark:text-gray-300">
              {user.status === 'active' ? t('profileCard.active') : user.status}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/30">
            <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{t('profileCard.lastLogin')}</p>
            <p className="mb-0 text-sm text-gray-600 dark:text-gray-300">
              {user.lastLogin ? dayjs(user.lastLogin).format('HH:mm DD/MM/YYYY') : t('profileCard.noLastLogin')}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProfileSummaryCard
