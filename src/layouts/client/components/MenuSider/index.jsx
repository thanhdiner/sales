import { useMemo } from 'react'
import { Menu, Skeleton, Tooltip } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCategoriesQuery } from '@/hooks/queries/useSharedAppQueries'
import { isNavItemActive, secondaryNavItems } from '@/layouts/client/components/Header/constants'
import './MenuSider.scss'

function MenuSiderTitle({ children }) {
  return (
    <Tooltip title={children} placement="right">
      <span className="menu-sider__title-sketch">
        <span className="menu-sider__title-star" aria-hidden="true" />
        <span className="menu-sider__title-text">{children}</span>
        <span className="menu-sider__title-line" aria-hidden="true" />
        <span className="menu-sider__title-divider" aria-hidden="true" />
      </span>
    </Tooltip>
  )
}

function findOpenKeys(list, path, parentKeys = []) {
  for (const item of list) {
    const currentKey = item.slug || item.value

    if (path.includes(currentKey)) {
      return [...parentKeys, currentKey]
    }

    if (item.children?.length) {
      const childKeys = findOpenKeys(item.children, path, [...parentKeys, currentKey])

      if (childKeys.length) {
        return childKeys
      }
    }
  }

  return []
}

function findSelectedKey(list, path) {
  for (const item of list) {
    const currentKey = item.slug || item.value

    if (path.includes(currentKey)) {
      return [currentKey]
    }

    if (item.children?.length) {
      const childSelected = findSelectedKey(item.children, path)

      if (childSelected.length) {
        return childSelected
      }
    }
  }

  return []
}

function MenuSider({ showGroupTitle = true }) {
  const location = useLocation()
  const { t } = useTranslation('clientSidebar')
  const { t: tHeader } = useTranslation('clientHeader')
  const { data: categories = [], isLoading: loading } = useCategoriesQuery()

  const selectedKeys = useMemo(() => {
    const secondaryItem = secondaryNavItems.find(item => isNavItemActive(location.pathname, item.path))
    if (secondaryItem) return [`secondary-${secondaryItem.path}`]

    return findSelectedKey(categories, location.pathname)
  }, [categories, location.pathname])
  const defaultOpenKeys = useMemo(() => findOpenKeys(categories, location.pathname), [categories, location.pathname])

  const renderCategoryItems = list =>
    list.map(category => {
      const hasChildren = category.children && category.children.length > 0
      const key = category.slug || category.value

      const parentLinkItem = {
        key: `${key}-all`,
        label: (
          <Link className="menu-sider__label" to={`/product-categories/${category.slug}`}>
            <span className="dark:text-white">
              {t('categoryMenu.allPrefix', { category: category.title })}
            </span>
          </Link>
        )
      }

      return {
        key,
        icon: category.thumbnail ? (
          <img src={category.thumbnail} alt={category.title} className="menu-sider__icon" loading="eager" decoding="async" />
        ) : (
          <span className="menu-sider__icon-placeholder" />
        ),
        label: hasChildren ? (
          <span className="menu-sider__label dark:text-white">{category.title}</span>
        ) : (
          <Link className="menu-sider__label" to={`/product-categories/${category.slug}`}>
            <span className="dark:text-white">{category.title}</span>
          </Link>
        ),
        children: hasChildren ? [parentLinkItem, ...renderCategoryItems(category.children)] : undefined
      }
    })

  const categoryItems = showGroupTitle
    ? [
        {
          key: 'product-category-group',
          type: 'group',
          label: <MenuSiderTitle>{t('categoryMenu.title')}</MenuSiderTitle>,
          className: 'menu-sider__group--divider',
          children: renderCategoryItems(categories)
        }
      ]
    : renderCategoryItems(categories)

  const secondaryItems = [
    {
      key: 'secondary-nav-group',
      type: 'group',
      label: <span className="menu-sider__secondary-title">{t('secondaryMenu.title')}</span>,
      className: 'menu-sider__secondary-group',
      children: secondaryNavItems.map(item => ({
        key: `secondary-${item.path}`,
        label: (
          <Link className="menu-sider__label menu-sider__secondary-link" to={item.path}>
            <span className="dark:text-white">{tHeader(item.labelKey)}</span>
          </Link>
        )
      }))
    }
  ]

  const items = showGroupTitle ? categoryItems : [...categoryItems, ...secondaryItems]

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active paragraph={{ rows: 7 }} title={false} />
      </div>
    )
  }

  return (
    <Menu
      mode="inline"
      items={items}
      key={`${location.pathname}-${categories.length}`}
      defaultOpenKeys={defaultOpenKeys}
      selectedKeys={selectedKeys}
      style={{ paddingBottom: '30px' }}
      className="menu-sider"
    />
  )
}

export default MenuSider
