import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { AdminToolbar } from '@/components/admin/ui'

export default function AdminWidgetsHeaderSection({ t, onCreateWidget }) {
  return (
    <AdminToolbar
      className="admin-widgets-header"
      contentClassName="admin-widgets-header__content"
      title={t('page.title')}
      description={t('page.subtitle')}
      actions={(
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreateWidget}
          className="admin-ui-button admin-ui-button--primary admin-widgets-btn admin-widgets-btn--create"
        >
          <span className="admin-widgets-btn__label">{t('page.createButton')}</span>
        </Button>
      )}
    />
  )
}
