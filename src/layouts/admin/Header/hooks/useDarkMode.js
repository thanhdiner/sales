import { useDispatch, useSelector } from 'react-redux'
import { setDarkMode } from '@/stores/app/darkModeSlice'

export default function useDarkMode() {
  const dispatch = useDispatch()
  const isDarkMode = useSelector(state => !!state.darkMode?.value)

  const toggleDarkMode = () => {
    dispatch(setDarkMode(!isDarkMode))
  }

  return { isDarkMode, toggleDarkMode }
}
