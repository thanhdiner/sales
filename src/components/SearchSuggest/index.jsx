import React, { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from 'antd'
import { SearchOutlined, FireFilled, StockOutlined } from '@ant-design/icons'
import { getProductSuggestions } from '@/services/productService'
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
  const fetchSuggestions = useCallback(
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
    setInput('')
    setShowDropdown(false)
    setHoveredIdx(-1)
    navigate(`/products?search=${encodeURIComponent(keyword)}`)
  }

  // Highlight match
  const highlightMatch = (text, query) => {
    if (!query) return text
    const regex = new RegExp(`(${query})`, 'gi')
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
    <div ref={ref} style={{ position: 'relative', width: 320, maxWidth: '95vw', margin: '0 auto' }}>
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
        prefix={<SearchOutlined style={{ color: isFocused ? '#1890ff' : '#bfbfbf' }} />}
        allowClear
        size="large"
        style={{
          borderRadius: 26,
          background: isFocused ? '#fff' : '#f8f9fa',
          border: isFocused ? '2px solid #1890ff' : '2px solid transparent',
          boxShadow: isFocused ? '0 4px 16px rgba(24, 144, 255, 0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fontSize: '15px',
          height: '48px'
        }}
      />

      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: 56,
            left: 0,
            right: 0,
            background: '#fff',
            border: 'none',
            borderRadius: 20,
            zIndex: 1000,
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
            animation: 'slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <style>
            {`
              @keyframes slideUp {
                from { opacity: 0; transform: translateY(8px) scale(0.96); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
            `}
          </style>
          {input && suggestions.length === 0 ? (
            <div style={{ padding: '32px 24px', textAlign: 'center', color: '#8c8c8c', fontSize: '14px' }}>
              <SearchOutlined style={{ fontSize: '32px', marginBottom: 12, opacity: 0.4, display: 'block' }} />
              <div style={{ fontWeight: '500' }}>Không tìm thấy kết quả</div>
              <div style={{ fontSize: '12px', marginTop: 4 }}>Thử tìm với từ khóa khác</div>
            </div>
          ) : (
            suggestions.map((kw, i) => (
              <div
                key={i}
                style={{
                  padding: '16px 24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  background: hoveredIdx === i ? 'linear-gradient(90deg, #e6f7ff 0%, #f0f9ff 100%)' : 'transparent',
                  borderLeft: hoveredIdx === i ? '4px solid #1890ff' : '4px solid transparent',
                  fontWeight: hoveredIdx === i ? '600' : '400',
                  color: hoveredIdx === i ? '#1890ff' : '#262626',
                  fontSize: '15px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredIdx === i ? 'translateX(4px)' : 'translateX(0)',
                  position: 'relative'
                }}
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
