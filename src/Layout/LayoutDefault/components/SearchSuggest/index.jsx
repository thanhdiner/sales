import React, { useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from 'antd'
import { SearchOutlined, FireFilled, StockOutlined } from '@ant-design/icons'
import { getProductSuggestions } from '@/services/clientProductService'
import debounce from 'lodash.debounce'
import { removeVietnameseTones } from '@/utils/removeVietnameseTones'

export default function SearchSuggest() {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)
  const navigate = useNavigate()
  const ref = useRef()

  // Debounce fetch API
  const fetchSuggestions = useMemo(
    () =>
      debounce(async q => {
        if (!q) {
          setSuggestions([])
          return
        }
        try {
          const res = await getProductSuggestions({ query: q, limit: 10 })
          setSuggestions(res.suggestions || [])
        } catch {
          setSuggestions([])
        }
      }, 250),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // Khi input thay đổi
  const handleChange = e => {
    const val = e.target.value
    setInput(val)
    setShowDropdown(true)
    setHoveredIdx(-1)
    fetchSuggestions(removeVietnameseTones(val))
  }

  const handleSelect = keyword => {
    const trimmedKeyword = keyword.trim()
    if (!trimmedKeyword) return

    setInput('')
    setShowDropdown(false)
    setHoveredIdx(-1)
    navigate(`/products?search=${encodeURIComponent(trimmedKeyword)}`)
  }

  const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Highlight match
  const highlightMatch = (text, query) => {
    if (!query) return text
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          style={{
            backgroundColor: '#fff2e8',
            color: '#d46b08',
            fontWeight: '600',
            padding: '1px 2px',
            borderRadius: '3px'
          }}
        >
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  // Out click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowDropdown(false)
        setHoveredIdx(-1)
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Key down UX
  const handleKeyDown = e => {
    if (!showDropdown || suggestions.length === 0) return
    if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) {
      e.preventDefault()
      if (e.key === 'ArrowDown') setHoveredIdx(idx => (idx + 1) % suggestions.length)
      else if (e.key === 'ArrowUp') setHoveredIdx(idx => (idx - 1 + suggestions.length) % suggestions.length)
      else if (e.key === 'Enter') {
        if (hoveredIdx >= 0 && hoveredIdx < suggestions.length) handleSelect(suggestions[hoveredIdx])
        else if (input.trim()) handleSelect(input.trim())
      } else if (e.key === 'Escape') {
        setShowDropdown(false)
        setHoveredIdx(-1)
      }
    }
  }

  const getIconForIndex = index => {
    if (index === 0) return <FireFilled style={{ color: '#ff4d4f', fontSize: 16 }} />
    if (index === 1) return <FireFilled style={{ color: '#ff7a45', fontSize: 16 }} />
    if (index === 2) return <FireFilled style={{ color: '#ffa940', fontSize: 16 }} />
    return <StockOutlined style={{ color: '#52c41a', fontSize: 16 }} />
  }

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', maxWidth: 480, margin: '0 auto' }}>
      <Input
        value={input}
        onChange={handleChange}
        onFocus={() => {
          setShowDropdown(true)
          setIsFocused(true)
        }}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder="Tìm kiếm sản phẩm..."
        prefix={<SearchOutlined />}
        allowClear
        size="middle"
        variant="filled"
        className={`header-search-input ${isFocused ? 'header-search-input--focused' : ''}`}
      />

      {showDropdown && (
        <div
          className={`search-suggest-dropdown absolute top-[56px] left-0 right-0 bg-white border-none rounded-[20px] z-[1000] shadow-[0_8px_40px_rgba(0,0,0,0.12)] overflow-hidden backdrop-blur-[10px] animate-[slideUp_0.25s_cubic-bezier(0.4,0,0.2,1)] dark:bg-gray-800 dark:shadow-[0_8px_40px_rgba(0,0,0,0.2)]`}
        >
          <style>
            {`
              @keyframes slideUp {
                from { opacity: 0; transform: translateY(8px) scale(0.96); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }

              .search-suggest-dropdown {
                max-height: min(62vh, 420px);
                overflow-y: auto;
                overscroll-behavior: contain;
              }

              @media (max-width: 768px) {
                .search-suggest-dropdown {
                  max-height: min(52vh, 360px);
                }
              }

              .search-suggest-dropdown::-webkit-scrollbar {
                width: 6px;
              }

              .search-suggest-dropdown::-webkit-scrollbar-track {
                background: transparent;
              }

              .search-suggest-dropdown::-webkit-scrollbar-thumb {
                background: rgba(148, 163, 184, 0.45);
                border-radius: 9999px;
              }

              .search-suggest-dropdown:hover::-webkit-scrollbar-thumb {
                background: rgba(148, 163, 184, 0.75);
              }
            `}
          </style>
          {input && suggestions.length === 0 ? (
            <div style={{ padding: '32px 24px', textAlign: 'center', color: '#8c8c8c', fontSize: '14px' }}>
              <div style={{ fontSize: '32px', marginBottom: 12, opacity: 0.4, lineHeight: 1 }}>⌕</div>
              <div style={{ fontWeight: '500' }}>Không tìm thấy kết quả</div>
              <div style={{ fontSize: '12px', marginTop: 4 }}>Thử tìm với từ khóa khác</div>
            </div>
          ) : (
            suggestions.map((kw, i) => (
              <div
                key={i}
                className={`dark:text-white px-6 py-4 cursor-pointer flex items-center gap-4 relative text-[15px] transition-all duration-200 ${
                  hoveredIdx === i
                    ? 'bg-gradient-to-r dark:text-[#1890ff] dark:from-gray-600 dark:to-gray-600 from-[#e6f7ff] to-[#f0f9ff] border-l-4 border-[#1890ff] font-semibold text-[#1890ff] translate-x-1'
                    : 'bg-transparent border-l-4 border-transparent font-normal text-[#262626] translate-x-0'
                }
  `}
                onMouseDown={() => handleSelect(kw)}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(-1)}
              >
                {getIconForIndex(i)}
                <span style={{ flex: 1 }}>{highlightMatch(kw, input)}</span>
                {!input && i < 3 && (
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#ff4d4f',
                      fontWeight: '700',
                      backgroundColor: '#fff2f0',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      border: '1px solid #ffccc7'
                    }}
                  >
                    HOT {i + 1}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
