import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { Toolbar } from '@/components/admin/ui'

export default function AdminBankInfoHeader({ t, onCreate }) {
  return (
    <Toolbar
      className="admin-bank-info-header"
      title={t('page.title')}
      description={t('page.description')}
      actions={(
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreate}
          className="admin-ui-button admin-ui-button--primary admin-bank-info-btn admin-bank-info-header__create-btn"
        >
          {t('page.createButton')}
        </Button>
      )}
    />
  )
}
