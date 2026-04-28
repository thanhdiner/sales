import { Button, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export default function AdminWidgetsHeaderSection({ t, onCreateWidget }) {
  return (
    <div className="admin-widgets-header">
      <div className="admin-widgets-header__content">
        <Title level={2} className="admin-widgets-header__title">
          {t('page.title')}
        </Title>
        <Text className="admin-widgets-header__description">{t('page.subtitle')}</Text>
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onCreateWidget}
        className="admin-widgets-btn admin-widgets-btn--primary admin-widgets-btn--create"
      >
        <span className="admin-widgets-btn__label">{t('page.createButton')}</span>
      </Button>
    </div>
  )
}
