import { Search, X } from 'lucide-react'

function SearchInput({ className = '', onChange, onClear, placeholder, value }) {
  return (
    <label className={`category-products-toolbar__search group relative flex h-10 min-w-0 items-center rounded-lg border border-gray-200 bg-white pl-9 pr-9 transition-colors focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.12)] dark:border-gray-800 dark:bg-gray-950 dark:focus-within:border-emerald-500 dark:focus-within:bg-gray-950 dark:focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.12)] ${className}`}>
      <Search className="absolute left-3 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500 dark:group-focus-within:text-emerald-400" />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="category-products-toolbar__search-input h-full w-full border-0 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-slate-500"
      />

      {value && onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 text-gray-400 transition-colors hover:text-gray-700 dark:hover:text-gray-200"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </label>
  )
}

export default SearchInput
