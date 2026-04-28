import { Spin } from 'antd'
import SEO from '@/components/SEO'

function ProfileLoadingState({ t }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
      <SEO title={t('seo.title')} noIndex />
      <Spin size="large" tip={t('loading.profile')} />
    </div>
  )
}

export default ProfileLoadingState
