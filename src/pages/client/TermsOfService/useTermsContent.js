import { useQuery } from '@tanstack/react-query'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { getTermsContent } from '@/services/client/content/terms'

export function useTermsContent() {
  const language = useCurrentLanguage()

  return useQuery({
    queryKey: ['termsContent', language],
    queryFn: async () => {
      const response = await getTermsContent()
      return response?.data || null
    },
    placeholderData: previousData => previousData,
    retry: false,
    staleTime: 60 * 1000,
    meta: { persist: false }
  })
}
