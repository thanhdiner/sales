import { useQuery } from '@tanstack/react-query'
import { getActiveBanners } from '@/services/bannersService'

export function useHeroBanners() {
  const { data: banners = [], isLoading: loading } = useQuery({
    queryKey: ['heroBanners'],
    queryFn: async () => {
      const res = await getActiveBanners()
      return res.data || []
    },
    staleTime: 5 * 60 * 1000 // Cache 5 minutes
  })

  return { banners, loading }
}
