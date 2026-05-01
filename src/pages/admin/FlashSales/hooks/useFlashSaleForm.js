import { useEffect, useMemo, useState } from 'react'
import debounce from 'lodash.debounce'
import { useTranslation } from 'react-i18next'
import { getProducts } from '@/services/admin/commerce/product'
import {
  EMPTY_FLASH_SALE_FORM,
  mapFlashSaleToFormData,
  mergeProductOptions
} from '../utils/flashSaleHelpers'

const INITIAL_PRODUCT_LIMIT = 20

export function useFlashSaleForm() {
  const { t } = useTranslation('adminFlashSales')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FLASH_SALE_FORM)
  const [productList, setProductList] = useState([])
  const [productLoading, setProductLoading] = useState(false)

  const resetFormState = () => {
    setEditingItem(null)
    setFormData(EMPTY_FLASH_SALE_FORM)
    setProductList([])
  }

  const closeModal = () => {
    setShowModal(false)
    resetFormState()
  }

  const fetchProducts = async params => {
    setProductLoading(true)

    try {
      const res = await getProducts(params)
      return res.products || []
    } catch {
      return []
    } finally {
      setProductLoading(false)
    }
  }

  const openCreate = async () => {
    const products = await fetchProducts({ page: 1, limit: INITIAL_PRODUCT_LIMIT })
    setProductList(products)
    setEditingItem(null)
    setFormData(EMPTY_FLASH_SALE_FORM)
    setShowModal(true)
  }

  const openEdit = async item => {
    const selectedIds = (item.products || []).map(product => (typeof product === 'object' ? product._id : product))
    const products = await fetchProducts({ page: 1, limit: INITIAL_PRODUCT_LIMIT })
    setProductList(mergeProductOptions(products, selectedIds, item.products || [], t('form.fields.products.loading')))
    setEditingItem(item)
    setFormData(mapFlashSaleToFormData(item))
    setShowModal(true)
  }

  const handleChange = (field, value) => {
    if (Array.isArray(field)) {
      setFormData(prev => {
        const next = { ...prev }
        let cursor = next

        field.forEach((key, index) => {
          if (index === field.length - 1) {
            cursor[key] = value
            return
          }

          cursor[key] = { ...(cursor[key] || {}) }
          cursor = cursor[key]
        })

        return next
      })
      return
    }

    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const debouncedSearchProduct = useMemo(
    () =>
      debounce(async (value, selectedIds, existingProducts) => {
        setProductLoading(true)

        try {
          const res = await getProducts({
            page: 1,
            limit: INITIAL_PRODUCT_LIMIT,
            productName: value
          })

          setProductList(mergeProductOptions(res.products || [], selectedIds, existingProducts, t('form.fields.products.loading')))
        } catch {
          setProductList(mergeProductOptions([], selectedIds, existingProducts, t('form.fields.products.loading')))
        } finally {
          setProductLoading(false)
        }
      }, 400),
    [t]
  )

  useEffect(() => {
    return () => {
      debouncedSearchProduct.cancel()
    }
  }, [debouncedSearchProduct])

  const handleSearchProduct = value => {
    debouncedSearchProduct(value, formData.products, productList)
  }

  return {
    showModal,
    editingItem,
    formData,
    productList,
    productLoading,
    openCreate,
    openEdit,
    closeModal,
    handleChange,
    handleSearchProduct,
    resetFormState
  }
}
