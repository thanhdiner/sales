import { useQuery } from '@tanstack/react-query'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { getGameNewsContent } from '@/services/client/content/gameNews'

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
