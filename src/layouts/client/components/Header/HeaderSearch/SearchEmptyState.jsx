import { Clock3, Tags, TrendingUp, X } from 'lucide-react'

function KeywordChip({ children, onClick }) {
  return (
    <button type="button" className="header-search-chip" onMouseDown={event => event.preventDefault()} onClick={onClick}>
      {children}
    </button>
  )
}

export default function SearchEmptyState({
  recentSearches,
  popularKeywords,
  suggestedCategories = [],
  onKeywordSelect,
  onCategorySelect,
  onRemoveRecentSearch = () => {},
  onClearRecentSearches = () => {},
  t
}) {
  return (
    <div className="header-search-empty">
      {recentSearches.length > 0 && (
        <section className="header-search-section">
          <div className="header-search-section__header">
            <h3 className="header-search-section__title">
              <Clock3 size={15} />
              {t('search.recentTitle')}
            </h3>
            <button
              type="button"
              className="header-search-recent-clear"
              onMouseDown={event => event.preventDefault()}
              onClick={onClearRecentSearches}
            >
              {t('search.clearRecentAll')}
            </button>
          </div>
          <div className="header-search-list">
            {recentSearches.map(item => (
              <div className="header-search-recent-row" key={item}>
                <button
                  type="button"
                  className="header-search-recent"
                  onMouseDown={event => event.preventDefault()}
                  onClick={() => onKeywordSelect(item)}
                >
                  <Clock3 size={14} />
                  <span>{item}</span>
                </button>
                <button
                  type="button"
                  className="header-search-recent-remove"
                  aria-label={t('search.removeRecent', { keyword: item })}
                  title={t('search.removeRecent', { keyword: item })}
                  onMouseDown={event => event.preventDefault()}
                  onClick={event => {
                    event.stopPropagation()
                    onRemoveRecentSearch(item)
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="header-search-section">
        <h3 className="header-search-section__title">
          <TrendingUp size={15} />
          {t('search.popularTitle')}
        </h3>
        <div className="header-search-chip-list">
          {popularKeywords.map(item => (
            <KeywordChip key={item} onClick={() => onKeywordSelect(item)}>
              {item}
            </KeywordChip>
          ))}
        </div>
      </section>

      {suggestedCategories.length > 0 && (
        <section className="header-search-section">
          <h3 className="header-search-section__title">
            <Tags size={15} />
            {t('search.categoryTitle')}
          </h3>
          <div className="header-search-chip-list">
            {suggestedCategories.map(category => (
              <KeywordChip key={category.id || category.slug} onClick={() => onCategorySelect(category)}>
                {category.title}
              </KeywordChip>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
