import { useQuery } from '@tanstack/react-query'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { getGameAccountContent } from '@/services/gameAccountContentService'

export function useGameAccountContent() {
  const language = useCurrentLanguage()

  return useQuery({
    queryKey: ['gameAccountContent', language],
    queryFn: async () => {
      const response = await getGameAccountContent(language)
      return response?.data || null
    },
    staleTime: 0,
    refetchOnMount: 'always',
    retry: false,
    meta: { persist: false }
  })
}
