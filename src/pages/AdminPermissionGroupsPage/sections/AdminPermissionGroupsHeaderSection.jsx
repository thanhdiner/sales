import { PlusOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Title, Text } = Typography

export default function AdminPermissionGroupsHeaderSection({ canCreateGroup, onCreateGroup }) {
  const { t } = useTranslation('adminPermissionGroups')

  return (
    <div className="admin-permission-groups-header">
      <div className="admin-permission-groups-header__content">
        <Title level={2} className="admin-permission-groups-header__title">
          {t('page.title')}
        </Title>
        <Text className="admin-permission-groups-header__description">
          {t('page.description')}
        </Text>
      </div>

      {canCreateGroup && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreateGroup}
          aria-label={t('common.create')}
          className="admin-permission-groups-create-btn"
        >
          <span className="admin-permission-groups-create-btn__label">{t('common.create')}</span>
        </Button>
      )}
    </div>
  )
}
