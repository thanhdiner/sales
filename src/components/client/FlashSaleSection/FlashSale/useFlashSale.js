import { useQuery } from '@tanstack/react-query'
import { getClientFlashSales } from '@/services/client/marketing/flashSale'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'

export function useFlashSale() {
  const language = useCurrentLanguage()

  const { data, isLoading: loading } = useQuery({
    queryKey: ['flashSale', language],
    queryFn: async () => {
      const res = await getClientFlashSales({ status: 'active', limit: 1 })
      return res.flashSales && res.flashSales[0] ? res.flashSales[0] : null
    },
    placeholderData: previousData => previousData,
    staleTime: 5 * 60 * 1000 // Cache 5 phút
  })

  return {
    products: data?.products || [],
    endAt: data?.endAt || null,
    discountPercent: data?.discountPercent || null,
    flashSaleId: data?._id || null,
    loading
  }
}
