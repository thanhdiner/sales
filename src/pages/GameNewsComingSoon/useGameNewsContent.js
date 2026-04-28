import { useQuery } from '@tanstack/react-query'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { getGameNewsContent } from '@/services/gameNewsContentService'

export function useGameNewsContent() {
  const language = useCurrentLanguage()

  return useQuery({
    queryKey: ['gameNewsContent', language],
    queryFn: async () => {
      const response = await getGameNewsContent(language)
      return response?.data || null
    },
    staleTime: 0,
    refetchOnMount: 'always',
    retry: false,
    meta: { persist: false }
  })
}
