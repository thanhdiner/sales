import { DownloadOutlined, FilterOutlined, PlusOutlined, ReloadOutlined, TableOutlined, TagsOutlined } from '@ant-design/icons'
import { Button, Checkbox, Dropdown } from 'antd'
import { useTranslation } from 'react-i18next'
import { ResourceHeader, ResourceUtility } from '@/components/admin/shared/ResourceManager'

export default function PromoCodesHeader({ columnsVisible, loading, onColumnsVisibleChange, onCreate, onExport, onRefresh, onToggleFilter }) {
  const { t } = useTranslation('adminPromoCodes')
  const columns = [
    'code',
    'campaign',
    'discountType',
    'conditions',
    'usage',
    'audience',
    'expiresAt',
    'createdAt',
    'status',
    'actions'
  ]
  const columnMenu = (
    <div className="admin-promo-codes-column-menu">
      <div className="admin-promo-codes-column-menu__title">{t('columnMenu.title')}</div>
      <Checkbox.Group
        value={columns.filter(key => columnsVisible[key])}
        onChange={checkedValues => {
          const nextColumnsVisible = {}
          columns.forEach(key => {
            nextColumnsVisible[key] = key === 'actions' || checkedValues.includes(key)
          })
          onColumnsVisibleChange(nextColumnsVisible)
        }}
      >
        <div className="admin-promo-codes-column-menu__grid">
          {columns.map(key => (
            <label key={key} className="admin-promo-codes-column-menu__item">
              <Checkbox value={key} disabled={key === 'actions'} />
              <span>{t(`table.columns.${key}`)}</span>
            </label>
          ))}
        </div>
      </Checkbox.Group>
    </div>
  )

  const utilityButtons = [
    {
      key: 'refresh',
      icon: <ReloadOutlined spin={loading} />,
      label: t('actions.refresh'),
      className: 'admin-promo-codes-btn admin-promo-codes-btn--utility',
      onClick: onRefresh
    },
    {
      key: 'export',
      icon: <DownloadOutlined />,
      label: t('actions.export'),
      className: 'admin-promo-codes-btn admin-promo-codes-btn--utility',
      onClick: onExport
    },
    {
      key: 'toggle-columns',
      dropdown: (
        <Dropdown dropdownRender={() => columnMenu} trigger={['click']} placement="bottomRight" arrow>
          <Button className="admin-promo-codes-btn admin-promo-codes-btn--utility">
            <TableOutlined />
            {t('actions.toggleColumns')}
          </Button>
        </Dropdown>
      )
    },
    {
      key: 'filter',
      icon: <FilterOutlined />,
      label: t('actions.filter'),
      className: 'admin-promo-codes-btn admin-promo-codes-btn--utility',
      onClick: onToggleFilter
    },
    {
      key: 'create',
      icon: <PlusOutlined />,
      label: t('actions.create'),
      className: 'admin-promo-codes-btn admin-promo-codes-btn--add',
      onClick: onCreate
    }
  ]

  return (
    <ResourceHeader
      className="admin-promo-codes-wrap admin-promo-codes-title-wrap"
      icon={<TagsOutlined />}
      title={t('page.title')}
      utility={
        <ResourceUtility
          buttons={utilityButtons.map(button => ({
            ...button,
            labelClassName: 'admin-promo-codes-btn__label'
          }))}
          className="admin-promo-codes-utility"
          itemClassPrefix="admin-promo-codes-utility-item"
        />
      }
    />
  )
}
