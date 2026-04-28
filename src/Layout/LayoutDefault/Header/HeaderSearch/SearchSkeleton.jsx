export default function SearchSkeleton() {
  return (
    <div className="header-search-skeleton" aria-label="Dang tai goi y tim kiem">
      {[0, 1, 2].map(item => (
        <div className="header-search-skeleton__item" key={item}>
          <span className="header-search-skeleton__thumb" />
          <span className="header-search-skeleton__lines">
            <span />
            <span />
          </span>
        </div>
      ))}
    </div>
  )
}
