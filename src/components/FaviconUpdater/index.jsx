import { useSelector } from 'react-redux'
import { useEffect } from 'react'

function FaviconUpdater() {
  const faviconUrl = useSelector(state => state.websiteConfig.data?.faviconUrl)

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
