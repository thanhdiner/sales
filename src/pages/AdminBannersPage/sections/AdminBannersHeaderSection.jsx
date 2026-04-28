import { Button, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

const { Title, Text } = Typography

export default function AdminBannersHeaderSection({ onCreateBanner }) {
  const { t } = useTranslation('adminBanners')

  return (
    <div className="admin-banners-header">
      <div className="admin-banners-header__content">
        <Title level={2} className="admin-banners-header__title">
          {t('page.title')}
        </Title>
        <Text className="admin-banners-header__description">
          {t('page.description')}
        </Text>
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onCreateBanner}
        aria-label={t('common.create')}
        className="admin-banners-create-btn"
      >
        <span className="admin-banners-create-btn__label">{t('common.create')}</span>
      </Button>
    </div>
  )
}
