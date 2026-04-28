import { CloseOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Select, Form, message, TreeSelect, InputNumber } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { getAdminProductCategoryTree } from '@/services/adminProductCategoryService'
import { getLocalizedProductCategoryTree } from '@/pages/AdminProductCategoriesPage/utils/productCategoryLocalization'
import { useTranslation } from 'react-i18next'

const { Option } = Select

function AdminProductsFilter({ onFilter, initialValues }) {
  const { t, i18n } = useTranslation('adminProducts')
  const [form] = Form.useForm()
  const [treeData, setTreeData] = useState([])
  const language = i18n.resolvedLanguage || i18n.language
  const localizedTreeData = useMemo(() => getLocalizedProductCategoryTree(treeData, language), [language, treeData])

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        const response = await getAdminProductCategoryTree()
        if (response) setTreeData(response)
      } catch (error) {
        message.error(t('filters.loadCategoryError'))
      }
    }

    fetchTreeData()
  }, [t])

  //# handler
  const handleSubmit = async values => {
    const cleaned = Object.fromEntries(Object.entries(values).filter(([_, v]) => v !== undefined && v !== '' && v !== 'all'))
    onFilter(cleaned)
  }

  const handleClear = () => {
    form.resetFields()
    onFilter({})
  }

  return (
    <div className="products-filter">
      <Form
        form={form}
        initialValues={{
          status: 'all',
          show: '10',
          ...initialValues
        }}
        onFinish={handleSubmit}
        layout="vertical"
        className="products-filter-form admin-products-filter-form"
      >
        <Form.Item name="productName" label={<span className="admin-products-filter-label">{t('filters.productName')}</span>}>
          <Input placeholder={t('filters.productNamePlaceholder')} className="admin-products-input" />
        </Form.Item>
        <Form.Item name="price" label={<span className="admin-products-filter-label">{t('filters.price')}</span>}>
          <InputNumber min={0} step={1000} className="admin-products-input w-full" placeholder={t('filters.pricePlaceholder')} />
        </Form.Item>
        <Form.Item name="product_category" label={<span className="admin-products-filter-label">{t('filters.productCategory')}</span>}>
          <TreeSelect
            className="admin-products-select"
            popupClassName="admin-products-popup"
            dropdownClassName="admin-products-popup"
            treeData={localizedTreeData}
            placeholder={t('filters.selectCategory')}
            allowClear
            treeDefaultExpandAll
            showSearch
            filterTreeNode={(input, treeNode) => String(treeNode.title || '').toLowerCase().includes(input.toLowerCase())}
          />
        </Form.Item>
        <Form.Item name="stock" label={<span className="admin-products-filter-label">{t('filters.stock')}</span>}>
          <InputNumber min={0} className="admin-products-input w-full" placeholder={t('filters.stockPlaceholder')} />
        </Form.Item>
        <Form.Item name="status" label={<span className="admin-products-filter-label">{t('filters.status')}</span>}>
          <Select className="admin-products-select" popupClassName="admin-products-popup">
            <Option value="all">{t('filters.all')}</Option>
            <Option value="active">{t('status.active')}</Option>
            <Option value="inactive">{t('status.inactive')}</Option>
          </Select>
        </Form.Item>
        <Form.Item name="show" label={<span className="admin-products-filter-label">{t('filters.show')}</span>}>
          <Select className="admin-products-select" popupClassName="admin-products-popup">
            <Option value="10">{t('filters.perPage', { count: 10 })}</Option>
            <Option value="20">{t('filters.perPage', { count: 20 })}</Option>
            <Option value="50">{t('filters.perPage', { count: 50 })}</Option>
            <Option value="100">{t('filters.perPage', { count: 100 })}</Option>
          </Select>
        </Form.Item>
        <Form.Item name="position" label={<span className="admin-products-filter-label">{t('filters.position')}</span>}>
          <InputNumber placeholder={t('filters.positionPlaceholder')} className="admin-products-input w-full" />
        </Form.Item>
        <Form.Item name="discountPercentage" label={<span className="admin-products-filter-label">{t('filters.discount')}</span>}>
          <InputNumber className="admin-products-input w-full" min={0} max={100} placeholder={t('filters.discountPlaceholder')} />
        </Form.Item>
        <Form.Item>
          <div className="product-filter">
            <Button type="primary" htmlType="submit" className="admin-products-btn admin-products-btn--apply">
              <SearchOutlined />
              {t('filters.filter')}
            </Button>
            <Button danger onClick={handleClear} className="admin-products-btn admin-products-btn--clear">
              <CloseOutlined />
              {t('filters.clear')}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

export default AdminProductsFilter
