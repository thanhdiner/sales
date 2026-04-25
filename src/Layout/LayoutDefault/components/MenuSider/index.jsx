import { useCallback, useEffect, useState } from 'react'
import { Menu, Skeleton } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { useCategoriesQuery } from '@/hooks/queries/useSharedAppQueries'
import './MenuSider.scss'

function MenuSider() {
  const location = useLocation()
  const [openKeys, setOpenKeys] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])
  const { data: categories = [], isLoading: loading } = useCategoriesQuery()

  const findOpenKeys = useCallback((list, path, parentKeys = []) => {
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
  }, [])

  const findSelectedKey = useCallback((list, path) => {
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
  }, [])

  useEffect(() => {
    if (!categories.length) {
      return
    }

    setSelectedKeys(findSelectedKey(categories, location.pathname))
    setOpenKeys(findOpenKeys(categories, location.pathname))
  }, [categories, findOpenKeys, findSelectedKey, location.pathname])

  const renderCategoryItems = list =>
    list.map(category => {
      const hasChildren = category.children && category.children.length > 0
      const key = category.slug || category.value

      return {
        key,
        icon: category.thumbnail ? (
          <img src={category.thumbnail} alt={category.title} className="menu-sider__icon" />
        ) : (
          <span className="menu-sider__icon-placeholder" />
        ),
        label: (
          <Link className="menu-sider__label" to={`/product-categories/${category.slug}`}>
            <span className="dark:text-white">{category.title}</span>
          </Link>
        ),
        children: hasChildren ? renderCategoryItems(category.children) : undefined
      }
    })

  const items = [
    {
      key: 'product-category-group',
      type: 'group',
      label: <span className="dark:text-white">Danh mục sản phẩm</span>,
      className: 'menu-sider__group--divider',
      children: renderCategoryItems(categories)
    }
  ]

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
      openKeys={openKeys}
      onOpenChange={keys => setOpenKeys(keys)}
      selectedKeys={selectedKeys}
      style={{ paddingBottom: '30px' }}
      className="menu-sider"
    />
  )
}

export default MenuSider
