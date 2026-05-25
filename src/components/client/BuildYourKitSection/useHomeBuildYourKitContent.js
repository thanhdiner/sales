import { useQuery } from '@tanstack/react-query'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { getHomeBuildYourKitContent } from '@/services/client/content/homeBuildYourKit'

export function useHomeBuildYourKitContent() {
  const language = useCurrentLanguage()
  const query = useQuery({
    queryKey: ['homeBuildYourKitContent', language],
    queryFn: async () => {
      const response = await getHomeBuildYourKitContent()
      return response?.data || null
    },
    placeholderData: previousData => previousData,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    meta: { persist: false }
  })

  return {
    ...query,
    isLoading: query.isLoading,
    isError: query.isError
  }
}
