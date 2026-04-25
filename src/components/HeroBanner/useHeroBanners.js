import { useQuery } from '@tanstack/react-query'
import { getActiveBanners } from '@/services/bannersService'

export function useHeroBanners() {
  const { data: banners = [], isFetching, isPending } = useQuery({
    queryKey: ['heroBanners'],
    queryFn: async () => {
      const res = await getActiveBanners()
      return res.data || []
    },
    staleTime: 5 * 60 * 1000 // Cache 5 minutes
  })

  const loading = isPending || (isFetching && banners.length === 0)

  return { banners, loading }
}
