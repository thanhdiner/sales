import { useTranslation } from 'react-i18next'
import { PageShell } from '@/components/admin/ui'
import { useWidgetForm } from './hooks/useWidgetForm'
import { useWidgets } from './hooks/useWidgetsData'
import WidgetFormModal from './sections/WidgetFormModal'
import WidgetsHeader from './sections/WidgetsHeader'
import WidgetsStats from './sections/WidgetsStats'
import WidgetsTable from './sections/WidgetsTable'
import './index.scss'

export default function Widgets() {
  const { t } = useTranslation('adminWidgets')
  const { widgets, loading, fetchWidgets, handleDeleteWidget } = useWidgets({ t })
  const widgetForm = useWidgetForm({ onSaved: fetchWidgets, t })

  return (
    <>
      <PageShell
        seoTitle={t('seo.title')}
        className="admin-widgets-page"
        contentClassName="admin-widgets-page__inner"
        panel
        panelClassName="admin-widgets-page__card"
      >
        <WidgetsHeader t={t} onCreateWidget={() => widgetForm.openModal()} />
        <WidgetsStats t={t} widgets={widgets} />

        <WidgetsTable t={t} widgets={widgets} loading={loading} onEditWidget={widgetForm.openModal} onDeleteWidget={handleDeleteWidget} />
      </PageShell>

      <WidgetFormModal t={t} {...widgetForm} />
    </>
  )
}
