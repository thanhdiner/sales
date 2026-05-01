import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import debounce from 'lodash.debounce'
import { getProductSearchSuggestions } from '@/services/client/commerce/product'

const RECENT_SEARCHES_KEY = 'clientRecentSearches'
const MAX_RECENT_SEARCHES = 6
const DEFAULT_POPULAR_KEYWORDS = ['Netflix', 'Canva', 'Office 365', 'ChatGPT Plus', 'YouTube Premium']

function readRecentSearches() {
  if (typeof window === 'undefined') return []

  try {
    const parsed = JSON.parse(window.localStorage.getItem(RECENT_SEARCHES_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.filter(Boolean).slice(0, MAX_RECENT_SEARCHES) : []
  } catch {
    return []
  }
}

function writeRecentSearches(items) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(items.slice(0, MAX_RECENT_SEARCHES)))
  } catch {
    // Storage can fail in private mode; search should still work.
  }
}

export default function useHeaderSearch() {
  const navigate = useNavigate()
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const requestIdRef = useRef(0)
  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [recentSearches, setRecentSearches] = useState(readRecentSearches)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isMobileOverlayOpen, setIsMobileOverlayOpen] = useState(false)

  const popularKeywords = useMemo(() => DEFAULT_POPULAR_KEYWORDS, [])
  const trimmedKeyword = keyword.trim()

  const commitRecentSearch = useCallback(term => {
    const value = term.trim()
    if (!value) return

    setRecentSearches(prev => {
      const next = [value, ...prev.filter(item => item.toLowerCase() !== value.toLowerCase())].slice(0, MAX_RECENT_SEARCHES)
      writeRecentSearches(next)
      return next
    })
  }, [])

  const removeRecentSearch = useCallback(term => {
    const value = term.trim().toLowerCase()
    if (!value) return

    setRecentSearches(prev => {
      const next = prev.filter(item => item.toLowerCase() !== value)
      writeRecentSearches(next)
      return next
    })
  }, [])

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    writeRecentSearches([])
  }, [])

  const closeSearch = useCallback(() => {
    setIsOpen(false)
    setIsFocused(false)
    setSelectedIndex(-1)
  }, [])

  const closeMobileOverlay = useCallback(() => {
    setIsMobileOverlayOpen(false)
    closeSearch()
  }, [closeSearch])

  const openSearch = useCallback(() => {
    setIsOpen(true)
    setIsFocused(true)
  }, [])

  const openMobileOverlay = useCallback(() => {
    setIsMobileOverlayOpen(true)
    setIsOpen(true)
    setIsFocused(true)
  }, [])

  const navigateToSearch = useCallback(
    term => {
      const value = term.trim()
      if (!value) return

      commitRecentSearch(value)
      setKeyword('')
      setDebouncedKeyword('')
      setProducts([])
      setCategories([])
      setSuggestions([])
      closeSearch()
      setIsMobileOverlayOpen(false)
      navigate(`/products?q=${encodeURIComponent(value)}`)
    },
    [closeSearch, commitRecentSearch, navigate]
  )

  const selectProduct = useCallback(
    product => {
      if (!product?.slug) return

      commitRecentSearch(product.title || trimmedKeyword)
      setKeyword('')
      setDebouncedKeyword('')
      closeSearch()
      setIsMobileOverlayOpen(false)
      navigate(`/products/${product.slug}`)
    },
    [closeSearch, commitRecentSearch, navigate, trimmedKeyword]
  )

  const selectKeyword = useCallback(
    value => {
      navigateToSearch(value)
    },
    [navigateToSearch]
  )

  const selectCategory = useCallback(
    category => {
      if (!category?.slug) return

      closeSearch()
      setIsMobileOverlayOpen(false)
      navigate(`/product-categories/${category.slug}`)
    },
    [closeSearch, navigate]
  )

  const clearKeyword = useCallback(() => {
    setKeyword('')
    setDebouncedKeyword('')
    setProducts([])
    setCategories([])
    setSuggestions([])
    setSelectedIndex(-1)
    setIsOpen(true)
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [])

  const handleInputChange = useCallback(event => {
    setKeyword(event.target.value)
    setIsOpen(true)
    setSelectedIndex(-1)
  }, [])

  const handleInputFocus = useCallback(() => {
    openSearch()
  }, [openSearch])

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()

      if (selectedIndex >= 0 && selectedIndex < products.length) {
        selectProduct(products[selectedIndex])
        return
      }

      navigateToSearch(trimmedKeyword)
    },
    [navigateToSearch, products, selectProduct, selectedIndex, trimmedKeyword]
  )

  const handleKeyDown = useCallback(
    event => {
      if (event.key === 'Escape') {
        closeSearch()
        if (isMobileOverlayOpen) closeMobileOverlay()
        return
      }

      if (!isOpen) return

      if (event.key === 'ArrowDown' && products.length > 0) {
        event.preventDefault()
        setSelectedIndex(index => (index + 1) % products.length)
      }

      if (event.key === 'ArrowUp' && products.length > 0) {
        event.preventDefault()
        setSelectedIndex(index => (index - 1 + products.length) % products.length)
      }
    },
    [closeMobileOverlay, closeSearch, isMobileOverlayOpen, isOpen, products.length]
  )

  const updateDebouncedKeyword = useMemo(
    () =>
      debounce(value => {
        setDebouncedKeyword(value.trim())
      }, 400),
    []
  )

  useEffect(() => {
    updateDebouncedKeyword(keyword)
    return () => updateDebouncedKeyword.cancel()
  }, [keyword, updateDebouncedKeyword])

  useEffect(() => {
    if (!debouncedKeyword) {
      requestIdRef.current += 1
      setIsLoading(false)
      setProducts([])
      setCategories([])
      setSuggestions([])
      return
    }

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    setIsLoading(true)

    getProductSearchSuggestions({ q: debouncedKeyword, limit: 5 })
      .then(res => {
        if (requestIdRef.current !== requestId) return
        setProducts(Array.isArray(res?.products) ? res.products : [])
        setCategories(Array.isArray(res?.categories) ? res.categories : [])
        setSuggestions(Array.isArray(res?.suggestions) ? res.suggestions : [])
      })
      .catch(() => {
        if (requestIdRef.current !== requestId) return
        setProducts([])
        setCategories([])
        setSuggestions([])
      })
      .finally(() => {
        if (requestIdRef.current === requestId) {
          setIsLoading(false)
        }
      })
  }, [debouncedKeyword])

  useEffect(() => {
    const handleClickOutside = event => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        closeSearch()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [closeSearch])

  useEffect(() => {
    if (!isMobileOverlayOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => inputRef.current?.focus())

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileOverlayOpen])

  return {
    rootRef,
    inputRef,
    keyword,
    debouncedKeyword,
    isOpen,
    isFocused,
    isLoading,
    products,
    categories,
    suggestions,
    recentSearches,
    popularKeywords,
    selectedIndex,
    isMobileOverlayOpen,
    trimmedKeyword,
    setSelectedIndex,
    openMobileOverlay,
    closeMobileOverlay,
    clearKeyword,
    removeRecentSearch,
    clearRecentSearches,
    handleInputChange,
    handleInputFocus,
    handleSubmit,
    handleKeyDown,
    navigateToSearch,
    selectKeyword,
    selectCategory,
    selectProduct
  }
}
