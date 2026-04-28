import { Card } from 'antd'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
import { useAdminWidgetForm } from './hooks/useAdminWidgetForm'
import { useAdminWidgetsData } from './hooks/useAdminWidgetsData'
import AdminWidgetFormModal from './sections/AdminWidgetFormModal'
import AdminWidgetsHeaderSection from './sections/AdminWidgetsHeaderSection'
import AdminWidgetsStatsSection from './sections/AdminWidgetsStatsSection'
import AdminWidgetsTableSection from './sections/AdminWidgetsTableSection'
import './AdminWidgetsPage.scss'

export default function AdminWidgetsPage() {
  const { t } = useTranslation('adminWidgets')
  const { widgets, loading, fetchWidgets, handleDeleteWidget } = useAdminWidgetsData({ t })
  const widgetForm = useAdminWidgetForm({ onSaved: fetchWidgets, t })

  return (
    <div className="admin-widgets-page">
      <SEO title={t('seo.title')} noIndex />

      <div className="admin-widgets-page__inner">
        <Card className="admin-widgets-page__card">
          <AdminWidgetsHeaderSection t={t} onCreateWidget={() => widgetForm.openModal()} />
          <AdminWidgetsStatsSection t={t} widgets={widgets} />

          <AdminWidgetsTableSection
            t={t}
            widgets={widgets}
            loading={loading}
            onEditWidget={widgetForm.openModal}
            onDeleteWidget={handleDeleteWidget}
          />
        </Card>

        <AdminWidgetFormModal t={t} {...widgetForm} />
      </div>
    </div>
  )
}
