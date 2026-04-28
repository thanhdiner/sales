import { PlusOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'

const { Title, Text } = Typography

export default function AdminBankInfoHeaderSection({ t, onCreate }) {
  return (
    <div className="admin-bank-info-header">
      <div>
        <Title level={2} className="admin-bank-info-header__title">
          {t('page.title')}
        </Title>

        <Text className="admin-bank-info-header__desc">
          {t('page.description')}
        </Text>
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onCreate}
        className="admin-bank-info-btn admin-bank-info-btn--primary admin-bank-info-header__create-btn"
      >
        {t('page.createButton')}
      </Button>
    </div>
  )
}
