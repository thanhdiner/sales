import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useTranslation } from 'react-i18next'

export default function Launcher({ onClick, unread }) {
  const { t } = useTranslation('clientChat')

  return (
    <button
      onClick={onClick}
      aria-label={t('floating.support')}
      title={t('floating.support')}
      className="fixed bottom-4 left-4 z-[1050] flex h-32 w-32 items-center justify-center transition-transform active:scale-95 hover:scale-110 md:bottom-5 md:left-5 lg:bottom-6 lg:left-6"
    >
      <DotLottieReact
        src="https://lottie.host/4f1d90a4-3284-4e6d-91c3-0a57489bf727/xTh9PrgXQy.lottie"
        loop
        autoplay
        className="w-full h-full drop-shadow-2xl"
      />
      {unread > 0 && (
        <span className="absolute top-1 right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md z-10">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </button>
  )
}
