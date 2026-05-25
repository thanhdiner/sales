import { ArrowLeft, ArrowRight, Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import SearchDropdown from './SearchDropdown'
import useHeaderSearch from './useHeaderSearch'
import './index.scss'

export default function HeaderSearch({ mode = 'desktop' }) {
  const { t } = useTranslation('clientHeader')
  const search = useHeaderSearch()
  const isMobile = mode === 'mobile'
  const isDark = useSelector(state => !!state.darkMode?.value)

  const dropdown = search.isOpen && (
    <SearchDropdown
      keyword={search.keyword}
      isLoading={search.isLoading}
      products={search.products}
      categories={search.categories}
      suggestions={search.suggestions}
      recentSearches={search.recentSearches}
      popularKeywords={search.popularKeywords}
      selectedIndex={search.selectedIndex}
      setSelectedIndex={search.setSelectedIndex}
      onProductSelect={search.selectProduct}
      onKeywordSelect={search.selectKeyword}
      onCategorySelect={search.selectCategory}
      onRemoveRecentSearch={search.removeRecentSearch}
      onClearRecentSearches={search.clearRecentSearches}
      onViewAll={() => search.navigateToSearch(search.trimmedKeyword)}
      t={t}
    />
  )

  if (isMobile) {
    return (
      <div className="header-search header-search--mobile" ref={search.rootRef}>
        <button
          type="button"
          className="header-search__mobile-trigger"
          aria-label={t('search.openMobile')}
          title={t('search.openMobile')}
          onClick={search.openMobileOverlay}
        >
          <Search size={20} />
        </button>

        {search.isMobileOverlayOpen && (
          <div className="header-search-overlay">
            <div className="header-search-overlay__topbar">
              <button
                type="button"
                className="header-search-overlay__icon-btn"
                aria-label={t('search.back')}
                onClick={search.closeMobileOverlay}
              >
                <ArrowLeft size={21} />
              </button>

              <form className="header-search-form header-search-form--overlay" onSubmit={search.handleSubmit}>
                <Search className="header-search-form__icon" size={18} />
                <input
                  className="header-search-form__input"
                  ref={search.inputRef}
                  value={search.keyword}
                  onChange={search.handleInputChange}
                  onFocus={search.handleInputFocus}
                  onKeyDown={search.handleKeyDown}
                  placeholder={t('search.mobilePlaceholder')}
                  aria-label={t('search.inputLabel')}
                />
                {search.keyword && (
                  <button
                    type="button"
                    className="header-search-form__clear"
                    aria-label={t('search.clear')}
                    onClick={search.clearKeyword}
                  >
                    <X size={16} />
                  </button>
                )}
              </form>
            </div>

            <div className="header-search-overlay__body">{dropdown}</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="header-search" ref={search.rootRef}>
      <form
        className={`header-search-form${search.isFocused ? ' header-search-form--focused' : ''}`}
        onSubmit={search.handleSubmit}
      >
        <svg className="header-search-form__sketch" width="470" height="76" viewBox="0 0 470 76" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M37 10C100 7 168 10 233 8C302 6 368 8 423 10C443 11 456 24 455 38C454 54 442 64 421 66C346 69 275 66 201 67C130 68 79 67 35 64C18 63 9 52 10 37C11 22 19 11 37 10Z" fill={isDark ? "#151719" : "#F8FAFC"} />
          <path d="M37 10C100 7 168 10 233 8C302 6 368 8 423 10C443 11 456 24 455 38C454 54 442 64 421 66C346 69 275 66 201 67C130 68 79 67 35 64C18 63 9 52 10 37C11 22 19 11 37 10Z" stroke={isDark ? "rgba(255, 255, 255, 0.24)" : "#E2E8F0"} strokeWidth="2" strokeLinecap="round" />
          <path d="M39 13C101 10 168 13 233 11C301 9 366 11 421 13C438 14 451 25 450 38C449 51 439 61 419 63C345 66 275 63 202 64C131 65 81 64 37 61C22 60 14 51 14 37C15 23 22 14 39 13Z" stroke={isDark ? "rgba(255, 255, 255, 0.12)" : "#FFFFFF"} strokeWidth="2" strokeLinecap="round" />
          <path className="header-search-form__sketch-magnifier" d="M48 29C53 24 62 25 66 30C70 36 68 44 61 47C55 51 47 47 45 40C43 35 44 32 48 29Z" stroke={isDark ? "#CBD5E1" : "#64748B"} strokeWidth="2.1" strokeLinecap="round" />
          <path className="header-search-form__sketch-magnifier" d="M63 45L70 52" stroke={isDark ? "#CBD5E1" : "#64748B"} strokeWidth="2.1" strokeLinecap="round" />
          <path d="M402 14C413 13 426 15 434 18C442 22 447 29 446 38C445 48 438 56 428 58C418 60 407 58 400 54C392 49 389 42 390 34C391 24 394 16 402 14Z" fill={isDark ? "#1677FF" : "#E8F1FF"} stroke={isDark ? "#4096ff" : "#D8E8FF"} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M410 37H429" stroke={isDark ? "#FFFFFF" : "#1677FF"} strokeWidth="2.3" strokeLinecap="round" />
          <path d="M423 30L430 37L423 44" stroke={isDark ? "#FFFFFF" : "#1677FF"} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M436 12L438 17L443 19L438 21L436 26L434 21L429 19L434 17L436 12Z" fill={isDark ? "#60a5fa" : "#1677FF"} opacity="0.45" />
        </svg>
        <Search className="header-search-form__icon" size={17} />
        <input
          className="header-search-form__input"
          ref={search.inputRef}
          value={search.keyword}
          onChange={search.handleInputChange}
          onFocus={search.handleInputFocus}
          onKeyDown={search.handleKeyDown}
          placeholder={t('search.placeholder')}
          aria-label={t('search.inputLabel')}
        />
        {search.keyword && (
          <button type="button" className="header-search-form__clear" aria-label={t('search.clear')} onClick={search.clearKeyword}>
            <X size={15} />
          </button>
        )}
        <button type="submit" className="header-search-form__submit" aria-label={t('search.submit')} title={t('search.submit')}>
          <ArrowRight size={16} />
        </button>
      </form>

      {dropdown}
    </div>
  )
}
