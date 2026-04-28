import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/ui'
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
    <>
      <AdminPageShell
        seoTitle={t('seo.title')}
        className="admin-widgets-page"
        contentClassName="admin-widgets-page__inner"
        panel
        panelClassName="admin-widgets-page__card"
      >
        <AdminWidgetsHeaderSection t={t} onCreateWidget={() => widgetForm.openModal()} />
        <AdminWidgetsStatsSection t={t} widgets={widgets} />

        <AdminWidgetsTableSection
          t={t}
          widgets={widgets}
          loading={loading}
          onEditWidget={widgetForm.openModal}
          onDeleteWidget={handleDeleteWidget}
        />
      </AdminPageShell>

      <AdminWidgetFormModal t={t} {...widgetForm} />
    </>
  )
}
