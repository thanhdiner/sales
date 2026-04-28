import { useQuery } from '@tanstack/react-query'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { getAboutContent } from '@/services/aboutService'

export function useAboutContent() {
  const language = useCurrentLanguage()

  return useQuery({
    queryKey: ['aboutContent', language],
    queryFn: async () => {
      const response = await getAboutContent()
      return response?.data || null
    },
    placeholderData: previousData => previousData,
    retry: false,
    staleTime: 60 * 1000,
    meta: { persist: false }
  })
}
