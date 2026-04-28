import { Col, Row } from 'antd'

import AdminLocalizedContentPage, { buildLocalizedInitialValues } from '@/components/AdminLocalizedContentPage'
import {
  getAdminGameNewsContent,
  updateAdminGameNewsContent
} from '@/services/gameNewsContentService'
import clientComingSoonEn from '@/i18n/locales/en/client/comingSoon.json'
import clientComingSoonVi from '@/i18n/locales/vi/client/comingSoon.json'
import './AdminGameNewsPage.scss'

const getInitialValues = data => buildLocalizedInitialValues(data, {
  vi: clientComingSoonVi.gameNews || {},
  en: clientComingSoonEn.gameNews || {}
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
        <Col xs={24} md={14}>
          <TextField root={root} path={['title']} label={t('fields.title')} required />
        </Col>
        <Col xs={24} md={10}>
          <TextField root={root} path={['status']} label={t('fields.status')} required />
        </Col>
        <Col xs={24}>
          <TextField root={root} path={['description']} label={t('fields.description')} rows={3} required />
        </Col>
        <Col xs={24}>
          <TextField root={root} path={['descriptionSecondLine']} label={t('fields.descriptionSecondLine')} rows={2} required />
        </Col>
      </Row>
    </Section>
  </>
)

function AdminGameNewsPage() {
  return (
    <AdminLocalizedContentPage
      namespace="adminGameNews"
      classPrefix="admin-game-news"
      getContent={getAdminGameNewsContent}
      updateContent={updateAdminGameNewsContent}
      getInitialValues={getInitialValues}
      queryKey={['gameNewsContent']}
      previewPath="/game-news"
      renderFields={renderFields}
    />
  )
}

export default AdminGameNewsPage
