import { useQuery } from '@tanstack/react-query'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { getCooperationContactContent } from '@/services/cooperationContactContentService'

export function useCooperationContactContent() {
  const language = useCurrentLanguage()

  return useQuery({
    queryKey: ['cooperationContactContent', language],
    queryFn: async () => {
      const response = await getCooperationContactContent()
      return response?.data || null
    },
    placeholderData: previousData => previousData,
    retry: false,
    staleTime: 60 * 1000,
    meta: { persist: false }
  })
}
