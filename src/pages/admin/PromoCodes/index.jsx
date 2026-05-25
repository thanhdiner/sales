import React from 'react'
import { useTranslation } from 'react-i18next'
import { Resource } from '@/components/admin/ui'
import PromoCodeDetailModal from './components/PromoCodeDetailModal'
import PromoCodeFormModal from './components/PromoCodeFormModal'
import { usePromoCodesController } from './hooks/usePromoCodesController'
import PromoCodesFilters from './sections/PromoCodesFilters'
import PromoCodesHeader from './sections/PromoCodesHeader'
import PromoCodesMobileList from './sections/PromoCodesMobileList'
import PromoCodesPagination from './sections/PromoCodesPagination'
import PromoCodesStats from './sections/PromoCodesStats'
import PromoCodesTable from './sections/PromoCodesTable'
import './index.scss'

export default function PromoCodes() {
  const { t, i18n } = useTranslation('adminPromoCodes')
  const language = i18n.resolvedLanguage || i18n.language
  const controller = usePromoCodesController({ t, language })

  return (
    <>
      <Resource
        resource="promo-codes"
        seoTitle={t('seo.title')}
        className="admin-promo-codes-page"
        contentClassName="admin-promo-codes-page__inner"
        header={
          <PromoCodesHeader
            columnsVisible={controller.columnsVisible}
            loading={controller.loading}
            fetching={controller.fetching}
            onColumnsVisibleChange={controller.setColumnsVisible}
            onCreate={controller.handleCreate}
            onExport={controller.handleExport}
            onRefresh={controller.refreshCurrentPage}
            onToggleFilter={() => controller.setShowFilters(prev => !prev)}
          />
        }
        stats={<PromoCodesStats promoCodes={controller.promoCodes} language={language} />}
        filters={
          controller.showFilters ? (
            <PromoCodesFilters filters={controller.filters} onFiltersChange={controller.handleFiltersChange} onClearFilters={controller.handleClearFilters} />
          ) : null
        }
        table={
          <PromoCodesTable
            promoCodes={controller.promoCodes}
            loading={controller.loading}
            language={language}
            columnsVisible={controller.columnsVisible}
            onCopy={controller.handleCopy}
            onShowDetail={controller.showDetail}
            onEdit={controller.handleEdit}
            onDuplicate={controller.handleDuplicate}
            onToggleStatus={controller.handleToggleStatus}
            onExtendExpiry={controller.handleExtendExpiry}
            onDelete={controller.handleDelete}
          />
        }
        mobileList={
          <PromoCodesMobileList
            promoCodes={controller.promoCodes}
            loading={controller.loading}
            language={language}
            onCopy={controller.handleCopy}
            onShowDetail={controller.showDetail}
            onEdit={controller.handleEdit}
            onDuplicate={controller.handleDuplicate}
            onToggleStatus={controller.handleToggleStatus}
            onExtendExpiry={controller.handleExtendExpiry}
            onDelete={controller.handleDelete}
          />
        }
        pagination={<PromoCodesPagination pagination={controller.pagination} language={language} onPageChange={controller.handleTableChange} />}
      />

      <PromoCodeFormModal
        open={controller.modalVisible}
        editingCode={controller.editingCode}
        form={controller.form}
        loading={controller.loading}
        language={language}
        t={t}
        onCancel={() => controller.setModalVisible(false)}
        onSubmit={controller.handleFormSubmit}
      />

      <PromoCodeDetailModal
        open={controller.detailModalVisible}
        selectedCode={controller.selectedCode}
        language={language}
        t={t}
        onCancel={controller.closeDetail}
      />
    </>
  )
}
