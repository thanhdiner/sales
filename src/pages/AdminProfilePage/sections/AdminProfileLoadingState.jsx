import { Spin } from 'antd'

export default function AdminProfileLoadingState({ t }) {
  return (
    <Spin tip={t('loading.profile')}>
      <div className="min-h-[200px]" />
    </Spin>
  )
}
