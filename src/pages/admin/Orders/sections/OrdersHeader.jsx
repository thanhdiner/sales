import { DownloadOutlined, FilterOutlined, ReloadOutlined, TableOutlined } from '@ant-design/icons'
import { Button, Checkbox, Dropdown } from 'antd'
import { useTranslation } from 'react-i18next'
import { ORDER_COLUMN_KEYS } from '../utils'

export default function OrdersHeader({ columnsVisible, loading, onColumnsVisibleChange, onExport, onRefresh, onToggleFilters }) {
  const { t } = useTranslation('adminOrders')
  const columnOptions = ORDER_COLUMN_KEYS.map(key => ({
    label: t(`table.columns.${key}`),
    value: key,
    disabled: key === 'actions'
  }))
  const checkedColumns = ORDER_COLUMN_KEYS.filter(key => columnsVisible?.[key] !== false)

  return (
    <div className="mb-3 flex flex-col gap-3 sm:mb-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-[var(--admin-text)] sm:text-2xl">{t('page.title')}</h1>
        <p className="text-sm text-[var(--admin-text-muted)]">{t('page.description')}</p>
      </div>

      <div className="flex flex-wrap gap-2 lg:justify-end">
        <Button icon={<ReloadOutlined />} loading={loading} onClick={onRefresh}>
          {t('actions.refresh')}
        </Button>
        <Button icon={<DownloadOutlined />} onClick={onExport}>
          {t('actions.export')}
        </Button>
        <Dropdown
          trigger={['click']}
          placement="bottomRight"
          dropdownRender={() => (
            <div className="admin-orders-column-menu">
              <div className="admin-orders-column-menu__title">{t('columnMenu.title')}</div>
              <Checkbox.Group
                className="admin-orders-column-menu__group"
                options={columnOptions}
                value={checkedColumns}
                onChange={onColumnsVisibleChange}
              />
            </div>
          )}
        >
          <Button icon={<TableOutlined />}>{t('actions.toggleColumns')}</Button>
        </Dropdown>
        <Button icon={<FilterOutlined />} onClick={onToggleFilters}>
          {t('actions.filter')}
        </Button>
      </div>
    </div>
  )
}
