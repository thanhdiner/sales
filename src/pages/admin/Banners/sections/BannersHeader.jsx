import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { Toolbar } from '@/components/admin/ui'

export default function BannersHeader({ onCreateBanner }) {
  const { t } = useTranslation('adminBanners')

  return (
    <Toolbar
      className="admin-banners-header"
      contentClassName="admin-banners-header__content"
      title={t('page.title')}
      description={t('page.description')}
      actions={(
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreateBanner}
          aria-label={t('common.create')}
          className="admin-ui-button admin-ui-button--primary admin-banners-create-btn"
        >
          <span className="admin-banners-create-btn__label">{t('common.create')}</span>
        </Button>
      )}
    />
  )
}
