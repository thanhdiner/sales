import { useSelector } from 'react-redux'

export default function useCurrentLanguage() {
  return useSelector(state => (state.language?.value === 'en' ? 'en' : 'vi'))
}
