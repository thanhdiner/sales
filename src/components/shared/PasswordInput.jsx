import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

function PasswordInput({ autoComplete, className = '', inputClassName = '', label, onToggleVisibility, showPassword, toggleLabel, ...inputProps }) {
  const [internalShowPassword, setInternalShowPassword] = useState(false)
  const defaultInputClassName =
    'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-400'
  const isPasswordVisible = showPassword ?? internalShowPassword
  const handleToggleVisibility = onToggleVisibility || (() => setInternalShowPassword(prev => !prev))

  return (
    <div className={className}>
      {label ? <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label> : null}

      <div className="relative">
        <input
          {...inputProps}
          type={isPasswordVisible ? 'text' : 'password'}
          className={inputClassName || defaultInputClassName}
          autoComplete={autoComplete}
        />

        <button
          type="button"
          onClick={handleToggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          tabIndex={-1}
          aria-label={toggleLabel}
        >
          {isPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}

export default PasswordInput
