import { useQuery } from '@tanstack/react-query'
import { getActiveBanners } from '@/services/client/marketing/banner'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'

export function useHeroBanners() {
  const language = useCurrentLanguage()

  const { data: banners = [], isFetching, isPending } = useQuery({
    queryKey: ['heroBanners', language],
    queryFn: async () => {
      const res = await getActiveBanners()
      return res.data || []
    },
    placeholderData: previousData => previousData,
    staleTime: 5 * 60 * 1000 // Cache 5 minutes
  })

  const loading = isPending || (isFetching && banners.length === 0)

  return { banners, loading }
}
