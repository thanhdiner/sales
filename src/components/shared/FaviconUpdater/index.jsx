import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWebsiteConfig } from '@/stores/app/websiteConfigSlice'

function FaviconUpdater() {
  const dispatch = useDispatch()
  const faviconUrl = useSelector(state => state.websiteConfig.data?.faviconUrl)
  const status = useSelector(state => state.websiteConfig.status)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchWebsiteConfig())
    }
  }, [dispatch, status])

  useEffect(() => {
    if (faviconUrl) {
      let link = document.querySelector("link[rel~='icon']")
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = faviconUrl
    }
  }, [faviconUrl])

  return null
}

export default FaviconUpdater
