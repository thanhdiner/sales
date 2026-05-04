import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

function SimpleSelect({ buttonClassName = '', className = '', label, onChange, options, value }) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)
  const selectedItem = options.find(item => item.value === value) || options[0]

  useEffect(() => {
    const handlePointerDown = event => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  const handleSelect = nextValue => {
    onChange(nextValue)
    setOpen(false)
  }

  return (
    <div ref={wrapperRef} className={`relative min-w-0 ${className}`}>
      {label && <span className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</span>}
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        className={`flex h-10 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 text-left text-sm font-medium text-gray-800 outline-none transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-gray-600 ${buttonClassName}`}
      >
        <span className="truncate">{selectedItem?.label}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-[80] mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {options.map(item => {
            const active = value === item.value

            return (
              <button
                key={item.value}
                type="button"
                aria-selected={active}
                onClick={() => handleSelect(item.value)}
                className={`block w-full px-3 py-2 text-left text-sm transition-colors ${
                  active
                    ? 'bg-blue-50 font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SimpleSelect
