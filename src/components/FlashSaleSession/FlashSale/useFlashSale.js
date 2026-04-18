import { useState, useEffect } from 'react'
import { getClientFlashSales } from '@/services/flashSaleService'

export function useFlashSale() {
  const [products, setProducts] = useState([])
  const [endAt, setEndAt] = useState(null)
  const [discountPercent, setDiscountPercent] = useState(null)
  const [flashSaleId, setFlashSaleId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true)
      try {
        const res = await getClientFlashSales({ status: 'active', limit: 1 })
        if (res.flashSales && res.flashSales[0]) {
          setEndAt(res.flashSales[0].endAt)
          setDiscountPercent(res.flashSales[0].discountPercent)
          setProducts(res.flashSales[0].products || [])
          setFlashSaleId(res.flashSales[0]._id)
        }
      } catch (error) {
        console.error('Error fetching flash sale data', error)
      } finally {
        setLoading(false)
      }
    }
    fetchApi()
  }, [])

  return { products, endAt, discountPercent, flashSaleId, loading }
}
