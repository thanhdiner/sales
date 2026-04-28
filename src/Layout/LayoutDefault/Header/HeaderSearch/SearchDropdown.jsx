import { Search, Tags } from 'lucide-react'
import SearchEmptyState from './SearchEmptyState'
import SearchProductItem from './SearchProductItem'
import SearchSkeleton from './SearchSkeleton'

function KeywordChip({ children, onClick }) {
  return (
    <button type="button" className="header-search-chip" onMouseDown={event => event.preventDefault()} onClick={onClick}>
      {children}
    </button>
  )
}

export default function SearchDropdown({
  keyword,
  isLoading,
  products,
  categories,
  suggestions,
  recentSearches,
  popularKeywords,
  selectedIndex,
  setSelectedIndex,
  onProductSelect,
  onKeywordSelect,
  onCategorySelect,
  onRemoveRecentSearch,
  onClearRecentSearches,
  onViewAll,
  t
}) {
  const trimmedKeyword = keyword.trim()
  const hasResults = products.length > 0 || suggestions.length > 0 || categories.length > 0

  if (!trimmedKeyword) {
    return (
      <div className="header-search-dropdown" role="dialog" aria-label={t('search.dropdownLabel')}>
        <SearchEmptyState
          recentSearches={recentSearches}
          popularKeywords={popularKeywords}
          onKeywordSelect={onKeywordSelect}
          onCategorySelect={onCategorySelect}
          onRemoveRecentSearch={onRemoveRecentSearch}
          onClearRecentSearches={onClearRecentSearches}
          t={t}
        />
      </div>
    )
  }

  return (
    <div className="header-search-dropdown" role="dialog" aria-label={t('search.dropdownLabel')}>
      <div className="header-search-dropdown__heading">
        <span className="header-search-dropdown__eyebrow">{t('search.title')}</span>
        <strong>{t('search.suggestionFor', { keyword: trimmedKeyword })}</strong>
      </div>

      {isLoading ? (
        <SearchSkeleton />
      ) : !hasResults ? (
        <div className="header-search-no-result">
          <Search size={24} />
          <strong>{t('search.emptyTitle')}</strong>
          <span>{t('search.emptyDescription')}</span>
        </div>
      ) : (
        <>
          {products.length > 0 && (
            <section className="header-search-section">
              <h3 className="header-search-section__title">{t('search.productsTitle')}</h3>
              <div className="header-search-product-list" role="listbox">
                {products.map((product, index) => (
                  <SearchProductItem
                    key={product.id || product.slug}
                    product={product}
                    active={selectedIndex === index}
                    onSelect={onProductSelect}
                    onHover={() => setSelectedIndex(index)}
                  />
                ))}
              </div>
            </section>
          )}

          {suggestions.length > 0 && (
            <section className="header-search-section">
              <h3 className="header-search-section__title">{t('search.relatedTitle')}</h3>
              <div className="header-search-chip-list">
                {suggestions.map(item => (
                  <KeywordChip key={item} onClick={() => onKeywordSelect(item)}>
                    {item}
                  </KeywordChip>
                ))}
              </div>
            </section>
          )}

          {categories.length > 0 && (
            <section className="header-search-section">
              <h3 className="header-search-section__title">
                <Tags size={15} />
                {t('search.categoryTitle')}
              </h3>
              <div className="header-search-chip-list">
                {categories.map(category => (
                  <KeywordChip key={category.id || category.slug} onClick={() => onCategorySelect(category)}>
                    {category.title}
                  </KeywordChip>
                ))}
              </div>
            </section>
          )}

          <button type="button" className="header-search-view-all" onMouseDown={event => event.preventDefault()} onClick={onViewAll}>
            {t('search.viewAll', { keyword: trimmedKeyword })}
          </button>
        </>
      )}
    </div>
  )
}
