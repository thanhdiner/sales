function SelectAllBar({ allAvailableSelected, availableCount, onSelectAll, selectedCount, t }) {
  return (
    <div className="mb-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={allAvailableSelected}
          onChange={onSelectAll}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />

        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{t('page.selectAll')}</span>

        <span className="text-sm text-gray-400">
          {t('page.availableCount', {
            selected: selectedCount,
            total: availableCount
          })}
        </span>
      </label>
    </div>
  )
}

export default SelectAllBar
