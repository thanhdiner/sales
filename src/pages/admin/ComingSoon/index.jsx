import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Col, Row } from 'antd'
import { useTranslation } from 'react-i18next'

import LocalizedContent, { buildLocalizedInitialValues } from '@/components/admin/LocalizedContentPage'
import {
  getComingSoonContent,
  updateComingSoonContent
} from '@/services/admin/content/comingSoon'
import clientComingSoonEn from '@/i18n/locales/en/client/comingSoon.json'
import clientComingSoonVi from '@/i18n/locales/vi/client/comingSoon.json'
import './index.scss'

const PAGE_CONFIG = {
  community: {
    contentKey: 'community',
    routeKey: 'community',
    previewPath: '/community',
    labelKey: 'community'
  },
  'quick-support': {
    contentKey: 'quickSupport',
    routeKey: 'quick-support',
    previewPath: '/quick-support',
    labelKey: 'quickSupport'
  },
  license: {
    contentKey: 'license',
    routeKey: 'license',
    previewPath: '/license',
    labelKey: 'license'
  }
}

const getInitialValues = (data, config) => buildLocalizedInitialValues(data, {
  vi: clientComingSoonVi[config.contentKey] || {},
  en: clientComingSoonEn[config.contentKey] || {}
}, {
  omittedKeys: ['key']
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
        <Col xs={24}>
          <TextField root={root} path={['title']} label={t('fields.title')} required />
        </Col>
        <Col xs={24}>
          <TextField root={root} path={['description']} label={t('fields.description')} rows={3} required />
        </Col>
        <Col xs={24}>
          <TextField root={root} path={['descriptionSecondLine']} label={t('fields.descriptionSecondLine')} rows={3} />
        </Col>
        <Col xs={24}>
          <TextField root={root} path={['status']} label={t('fields.status')} required />
        </Col>
      </Row>
    </Section>
  </>
)

function ComingSoon() {
  const { t } = useTranslation('adminComingSoonPages')
  const location = useLocation()
  const routeKey = location.pathname.replace(/^\/admin\/?/, '').split('/')[0]
  const config = useMemo(() => PAGE_CONFIG[routeKey] || PAGE_CONFIG.community, [routeKey])
  const pageName = t(`pages.${config.labelKey}`)

  return (
    <LocalizedContent
      namespace="adminComingSoonPages"
      classPrefix="admin-coming-soon"
      context={config}
      textParams={{ page: pageName }}
      getContent={currentConfig => getComingSoonContent(currentConfig.routeKey)}
      updateContent={(payload, currentConfig) => updateComingSoonContent(currentConfig.routeKey, payload)}
      getInitialValues={getInitialValues}
      queryKey={currentConfig => ['comingSoonContent', currentConfig.routeKey]}
      previewPath={currentConfig => currentConfig.previewPath}
      renderFields={renderFields}
    />
  )
}

export default ComingSoon
