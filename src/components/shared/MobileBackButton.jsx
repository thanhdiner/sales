import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

function MobileBackButton({ className = '', label }) {
  const navigate = useNavigate()
  const { t } = useTranslation('clientHeader')

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`mb-5 flex items-center gap-2 rounded-full text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-200 dark:hover:text-white md:hidden ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label || t('search.back')}
    </button>
  )
}

export default MobileBackButton
