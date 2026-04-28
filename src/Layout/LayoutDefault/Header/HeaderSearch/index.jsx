import { ArrowLeft, ArrowRight, Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SearchDropdown from './SearchDropdown'
import useHeaderSearch from './useHeaderSearch'
import './HeaderSearch.scss'

export default function HeaderSearch({ mode = 'desktop' }) {
  const { t } = useTranslation('clientHeader')
  const search = useHeaderSearch()
  const isMobile = mode === 'mobile'

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
        <Search className="header-search-form__icon" size={17} />
        <input
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
