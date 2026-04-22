import { Card } from 'antd'
import SEO from '@/components/SEO'
import { useAdminWidgetForm } from './hooks/useAdminWidgetForm'
import { useAdminWidgetsData } from './hooks/useAdminWidgetsData'
import AdminWidgetFormModal from './sections/AdminWidgetFormModal'
import AdminWidgetsHeaderSection from './sections/AdminWidgetsHeaderSection'
import AdminWidgetsStatsSection from './sections/AdminWidgetsStatsSection'
import AdminWidgetsTableSection from './sections/AdminWidgetsTableSection'

export default function AdminWidgetsPage() {
  const { widgets, loading, fetchWidgets, handleDeleteWidget } = useAdminWidgetsData()
  const widgetForm = useAdminWidgetForm({ onSaved: fetchWidgets })

  return (
    <div className="min-h-screen rounded-xl bg-slate-50 p-6 dark:bg-gray-900">
      <SEO title="Admin - Widgets" noIndex />

      <Card className="rounded-xl border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
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
  )
}
