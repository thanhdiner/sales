import { Col, Row } from 'antd'

import LocalizedContent, { buildLocalizedInitialValues } from '@/components/admin/LocalizedContent'
import {
  getGameAccountContent,
  updateGameAccountContent
} from '@/services/admin/content/gameAccount'
import clientComingSoonEn from '@/i18n/locales/en/client/comingSoon.json'
import clientComingSoonVi from '@/i18n/locales/vi/client/comingSoon.json'
import './index.scss'

const getInitialValues = data => buildLocalizedInitialValues(data, {
  vi: clientComingSoonVi.gameAccount || {},
  en: clientComingSoonEn.gameAccount || {}
})

const renderFields = ({ root, t, Section, TextField }) => (
  <>
    <Section title={t('sections.seo')}>
      <Row gutter={16}>
        <Col xs={24} md={10}>
          <TextField root={root} path={['seo', 'title']} label={t('fields.seoTitle')} required />
        </Col>
        <Col xs={24} md={14}>
          <TextField root={root} path={['seo', 'description']} label={t('fields.seoDescription')} rows={2} />
        </Col>
      </Row>
    </Section>

    <Section title={t('sections.content')} description={t('sections.contentDescription')}>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <TextField root={root} path={['eyebrow']} label={t('fields.eyebrow')} />
        </Col>
        <Col xs={24} md={16}>
          <TextField root={root} path={['title']} label={t('fields.title')} required />
        </Col>
        <Col xs={24}>
          <TextField root={root} path={['description']} label={t('fields.description')} rows={4} required />
        </Col>
        <Col xs={24}>
          <TextField root={root} path={['note']} label={t('fields.note')} rows={3} />
        </Col>
      </Row>
    </Section>
  </>
)

function GameAccount() {
  return (
    <LocalizedContent
      namespace="adminGameAccount"
      classPrefix="admin-game-account"
      api={{
        getContent: getGameAccountContent,
        updateContent: updateGameAccountContent,
        queryKey: ['gameAccountContent']
      }}
      formConfig={{
        getInitialValues,
        renderFields
      }}
      previewConfig={{
        previewPath: '/game-account'
      }}
    />
  )
}

export default GameAccount
