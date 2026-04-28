import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import TiptapEditor from '@/components/TiptapEditor'

export default function ProductTranslationFields({ form, classNamePrefix }) {
  const { t } = useTranslation('adminProducts')
  const description = Form.useWatch(['translations', 'en', 'description'], form)
  const content = Form.useWatch(['translations', 'en', 'content'], form)

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
          <Form.Item label={label('form.translations.features')}>
            <Form.List name={['translations', 'en', 'features']}>
              {(fields, { add, remove }) => (
                <div className={`${classNamePrefix}__features`}>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className={`${classNamePrefix}__feature-row`}>
                      <Form.Item {...restField} name={name} style={{ flex: 1, marginBottom: 0 }}>
                        <Input
                          className={`${classNamePrefix}__input`}
                          placeholder={t('form.translations.featurePlaceholder', { number: name + 1 })}
                        />
                      </Form.Item>

                      <Button danger type="text" className={`${classNamePrefix}__remove-feature-btn`} onClick={() => remove(name)}>
                        {t('form.removeFeature')}
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="dashed"
                    className={`${classNamePrefix}__add-feature-btn`}
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    {t('form.translations.addFeature')}
                  </Button>
                </div>
              )}
            </Form.List>
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name={['translations', 'en', 'description']} hidden>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item label={label('form.translations.description')}>
            <div className={`${classNamePrefix}__editor`}>
              <TiptapEditor
                value={description || ''}
                onChange={value => form.setFieldValue(['translations', 'en', 'description'], value)}
              />
            </div>
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name={['translations', 'en', 'content']} hidden>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item label={label('form.translations.content')}>
            <div className={`${classNamePrefix}__editor`}>
              <TiptapEditor
                value={content || ''}
                onChange={value => form.setFieldValue(['translations', 'en', 'content'], value)}
              />
            </div>
          </Form.Item>
        </Col>
      </Row>
    </div>
  )
}
