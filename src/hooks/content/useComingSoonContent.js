import { useQuery } from '@tanstack/react-query'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { getComingSoonContent } from '@/services/client/content/comingSoon'

export function useComingSoonContent(key) {
  const language = useCurrentLanguage()

  return useQuery({
    queryKey: ['comingSoonContent', key, language],
    queryFn: async () => {
      const response = await getComingSoonContent(key, language)
      return response?.data || null
    },
    enabled: Boolean(key),
    staleTime: 0,
    refetchOnMount: 'always',
    retry: false,
    meta: { persist: false }
  })
}
