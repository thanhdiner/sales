import { Col, Form, Input, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { AdminFeatureListField, AdminRichTextField } from '@/components/admin/form'

export default function ProductTranslationFields({ form, classNamePrefix }) {
  const { t } = useTranslation('adminProducts')

  const label = key => <span className={`${classNamePrefix}__label`}>{t(key)}</span>

  return (
    <div className={`${classNamePrefix}__translation-section`}>
      <div className={`${classNamePrefix}__translation-header`}>
        <h3 className={`${classNamePrefix}__translation-title`}>{t('form.translations.sectionTitle')}</h3>
      </div>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Form.Item name={['translations', 'en', 'title']} label={label('form.translations.title')}>
            <Input className={`${classNamePrefix}__input`} placeholder={t('form.translations.titlePlaceholder')} />
          </Form.Item>
        </Col>

        <Col xs={24} lg={12}>
          <Form.Item name={['translations', 'en', 'deliveryInstructions']} label={label('form.translations.deliveryInstructions')}>
            <Input.TextArea
              className={`${classNamePrefix}__textarea`}
              rows={3}
              placeholder={t('form.translations.deliveryInstructionsPlaceholder')}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <AdminFeatureListField
            addButtonClassName={`${classNamePrefix}__add-feature-btn`}
            addLabel={t('form.translations.addFeature')}
            fieldClassName={`${classNamePrefix}__features`}
            inputClassName={`${classNamePrefix}__input`}
            label={label('form.translations.features')}
            name={['translations', 'en', 'features']}
            placeholder={fieldName => t('form.translations.featurePlaceholder', { number: fieldName + 1 })}
            removeButtonClassName={`${classNamePrefix}__remove-feature-btn`}
            removeLabel={t('form.removeFeature')}
            rowClassName={`${classNamePrefix}__feature-row`}
          />
        </Col>

        <Col span={24}>
          <AdminRichTextField
            editorClassName={`${classNamePrefix}__editor`}
            form={form}
            label={label('form.translations.description')}
            name={['translations', 'en', 'description']}
          />
        </Col>

        <Col span={24}>
          <AdminRichTextField
            editorClassName={`${classNamePrefix}__editor`}
            form={form}
            label={label('form.translations.content')}
            name={['translations', 'en', 'content']}
          />
        </Col>
      </Row>
    </div>
  )
}
