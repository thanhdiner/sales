import { Card } from 'antd'
import SEO from '@/components/SEO'
import { useAdminWidgetForm } from './hooks/useAdminWidgetForm'
import { useAdminWidgetsData } from './hooks/useAdminWidgetsData'
import AdminWidgetFormModal from './sections/AdminWidgetFormModal'
import AdminWidgetsHeaderSection from './sections/AdminWidgetsHeaderSection'
import AdminWidgetsStatsSection from './sections/AdminWidgetsStatsSection'
import AdminWidgetsTableSection from './sections/AdminWidgetsTableSection'
import './AdminWidgetsPage.scss'

export default function AdminWidgetsPage() {
  const { widgets, loading, fetchWidgets, handleDeleteWidget } = useAdminWidgetsData()
  const widgetForm = useAdminWidgetForm({ onSaved: fetchWidgets })

  return (
    <div className="admin-widgets-page">
      <SEO title="Admin - Widgets" noIndex />

      <div className="admin-widgets-page__inner">
        <Card className="admin-widgets-page__card">
          <AdminWidgetsHeaderSection onCreateWidget={() => widgetForm.openModal()} />
          <AdminWidgetsStatsSection widgets={widgets} />

          <AdminWidgetsTableSection
            widgets={widgets}
            loading={loading}
            onEditWidget={widgetForm.openModal}
            onDeleteWidget={handleDeleteWidget}
          />
        </Card>

        <AdminWidgetFormModal {...widgetForm} />
      </div>
    </div>
  )
}
