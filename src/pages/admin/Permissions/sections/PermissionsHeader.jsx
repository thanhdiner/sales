import { PlusOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'

const { Title, Text } = Typography

export default function PermissionsHeader({ t, canCreatePermission, onCreatePermission }) {
  return (
    <div className="admin-permissions-header">
      <div className="min-w-0">
        <Title level={2} className="admin-permissions-header__title !mb-1 !text-2xl !font-semibold !text-[var(--admin-text)]">
          {t('page.title')}
        </Title>
        <Text className="admin-permissions-header__description text-sm text-[var(--admin-text-muted)]">{t('page.description')}</Text>
      </div>

      {canCreatePermission && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreatePermission}
          className="admin-permissions-create-btn h-10 rounded-lg !border-none !bg-[var(--admin-accent)] px-4 font-medium !text-white shadow-none hover:!opacity-90"
        >
          <span>{t('common.create')}</span>
        </Button>
      )}
    </div>
  )
}
