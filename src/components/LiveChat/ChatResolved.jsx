import React from 'react'
import { MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function ChatResolved({ onStartNewConversation }) {
  const { t } = useTranslation('clientChat')

  return (
    <div className="px-4 py-3 bg-green-50 dark:bg-green-900/20 border-t border-green-100 dark:border-green-800 flex-shrink-0">
      <p className="text-xs text-green-700 dark:text-green-400 text-center mb-2">
        {t('resolved.message')}
      </p>
      <button
        onClick={onStartNewConversation}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        {t('resolved.startNew')}
      </button>
    </div>
  )
}
