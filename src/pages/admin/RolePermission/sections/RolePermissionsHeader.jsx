import { Save } from 'lucide-react'
import { Button, Select, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { getLocalizedRoleLabel } from '@/utils/adminAccessLocalization'

const { Title, Text } = Typography

export default function RolePermissionsHeader({
  canEditRolePermission,
  loading,
  roles,
  selectedRoleId,
  onRoleChange,
  onSave
}) {
  const { t, i18n } = useTranslation('adminRolePermission')
  const language = i18n.resolvedLanguage || i18n.language
  const roleOptions = roles.map(role => ({
    value: role._id,
    label: getLocalizedRoleLabel(role, language, role.label || '')
  }))

  return (
    <>
      <div className="admin-role-permission-header">
        <div className="admin-role-permission-header__content">
          <Title level={3} className="admin-role-permission-header__title">
            {t('page.title')}
          </Title>

          <Text className="admin-role-permission-header__description">
            {t('page.description')}
          </Text>
        </div>

        {canEditRolePermission && (
          <Button
            type="primary"
            onClick={onSave}
            loading={loading}
            icon={<Save size={16} />}
            aria-label={t('actions.saveChanges')}
            className="admin-role-permission-btn admin-role-permission-btn--primary"
          >
            <span>{t('actions.saveChanges')}</span>
          </Button>
        )}
      </div>

      <div className="admin-role-permission-role-picker">
        <span className="admin-role-permission-role-picker__label">{t('rolePicker.label')}</span>
        <Select
          value={selectedRoleId || undefined}
          options={roleOptions}
          placeholder={t('rolePicker.placeholder')}
          onChange={onRoleChange}
          loading={loading}
          disabled={!roleOptions.length}
          className="admin-role-permission-role-picker__select"
          popupClassName="admin-role-permission-role-picker__popup"
          getPopupContainer={trigger => trigger.parentNode}
        />
      </div>
    </>
  )
}