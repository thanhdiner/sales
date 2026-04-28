import { useQuery } from '@tanstack/react-query'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { getHomeWhyChooseUsContent } from '@/services/homeWhyChooseUsContentService'

export function useHomeWhyChooseUsContent() {
  const language = useCurrentLanguage()

  return useQuery({
    queryKey: ['homeWhyChooseUsContent', language],
    queryFn: async () => {
      const response = await getHomeWhyChooseUsContent()
      return response?.data || null
    },
    placeholderData: previousData => previousData,
    retry: false,
    staleTime: 60 * 1000,
    meta: { persist: false }
  })
}
