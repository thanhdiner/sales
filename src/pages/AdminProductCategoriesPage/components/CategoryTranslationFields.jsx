import { Col, Form, Input, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import TiptapEditor from '@/components/TiptapEditor'

function CategoryTranslationFields({ form }) {
  const { t } = useTranslation('adminProductCategories')
  const description = Form.useWatch(['translations', 'en', 'description'], form)
  const content = Form.useWatch(['translations', 'en', 'content'], form)

  const label = key => <span className="admin-product-categories-form__label">{t(key)}</span>

  return (
    <div className="admin-product-categories-form__translation-section">
      <div className="admin-product-categories-form__translation-header">
        <h3 className="admin-product-categories-form__translation-title">{t('form.translations.sectionTitle')}</h3>
      </div>

      <Row gutter={[16, 0]}>
        <Col span={24}>
          <Form.Item name={['translations', 'en', 'title']} label={label('form.translations.title')}>
            <Input className="admin-product-categories-input" placeholder={t('form.translations.titlePlaceholder')} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label={label('form.translations.description')}>
            <TiptapEditor
              value={description || ''}
              onChange={value => form.setFieldValue(['translations', 'en', 'description'], value)}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label={label('form.translations.content')}>
            <TiptapEditor value={content || ''} onChange={value => form.setFieldValue(['translations', 'en', 'content'], value)} />
          </Form.Item>
        </Col>
      </Row>
    </div>
  )
}

export default CategoryTranslationFields
