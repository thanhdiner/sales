import { Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import './MenuSider.scss'
import { useEffect, useState } from 'react'
import { getProductCategoryTree } from '@/services/productCategoryService'

function MenuSider() {
  const [categories, setCategories] = useState([])
  const [openKeys, setOpenKeys] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])
  const location = useLocation()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getProductCategoryTree()
        setCategories(res.data)

        const expandedKeys = findOpenKeys(res.data, location.pathname)
        setOpenKeys(expandedKeys)
      } catch (err) {
        console.error('Failed to fetch categories', err)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    if (categories.length > 0) {
      const selected = findSelectedKey(categories, location.pathname)
      const expandedKeys = findOpenKeys(categories, location.pathname)

      setSelectedKeys(selected)
      setOpenKeys(expandedKeys)
    }
  }, [location.pathname, categories])

  const findOpenKeys = (list, path, parentKeys = []) => {
    for (const item of list) {
      const currentKey = item.slug || item.value
      if (path.includes(currentKey)) return [...parentKeys, currentKey]
      if (item.children?.length) {
        const childKeys = findOpenKeys(item.children, path, [...parentKeys, currentKey])
        if (childKeys.length) return childKeys
      }
    }
    return []
  }

  const findSelectedKey = (list, path) => {
    for (const item of list) {
      const currentKey = item.slug || item.value
      if (path.includes(currentKey)) return [currentKey]
      if (item.children?.length) {
        const childSelected = findSelectedKey(item.children, path)
        if (childSelected.length) return childSelected
      }
    }
    return []
  }

  const renderCategoryItems = list =>
    list.map(category => {
      const hasChildren = category.children && category.children.length > 0
      const key = category.slug || category.value

      return {
        key,
        icon: category.thumbnail ? <img src={category.thumbnail} alt={category.title} className="menu-sider__icon" /> : null,
        label: (
          <Link className="menu-sider__label" to={`/product-categories/${category.slug}`}>
            {category.title}
          </Link>
        ),
        children: hasChildren ? renderCategoryItems(category.children) : undefined
      }
    })

  const items = [
    {
      key: 'product-category-group',
      type: 'group',
      label: 'Danh mục sản phẩm',
      className: 'menu-sider__group--divider',
      children: renderCategoryItems(categories)
    }
  ]

  return (
    <Menu
      mode="inline"
      items={items}
      openKeys={openKeys}
      onOpenChange={keys => setOpenKeys(keys)}
      selectedKeys={selectedKeys}
      style={{ paddingBottom: '30px' }}
    />
  )
}

export default MenuSider
