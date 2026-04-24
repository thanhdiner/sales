import React, { useState, useEffect } from 'react'
import { FaFacebookMessenger, FaPhoneAlt, FaComments, FaTimes, FaArrowUp } from 'react-icons/fa'
import { SiZalo } from 'react-icons/si'

const FloatingButtons = ({ onOpenSupport, supportUnread = 0 }) => {
  const [showScroll, setShowScroll] = useState(false)
  const [openContact, setOpenContact] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      const pct = max > 0 ? Math.min(100, Math.round((scrolled / max) * 100)) : 0

      setShowScroll(scrolled > 200)
      setProgress(pct)
    }

    onScroll()
    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const contactButtons = [
    ...(onOpenSupport
      ? [{
          onClick: onOpenSupport,
          icon: <FaComments className="text-lg" />,
          label: 'SmartMall Support',
          bgColor: 'bg-violet-600',
          shadowColor: 'shadow-violet-500/30',
          badge: supportUnread
        }]
      : []),
    {
      href: 'tel:0823387108',
      icon: <FaPhoneAlt className="text-lg" />,
      label: 'Gọi ngay',
      bgColor: 'bg-emerald-500',
      shadowColor: 'shadow-emerald-500/30'
    },
    {
      href: 'https://zalo.me/0823387108',
      icon: <SiZalo size={18} />,
      label: 'Chat Zalo',
      bgColor: 'bg-[#0b74e5]',
      shadowColor: 'shadow-blue-500/30',
      target: '_blank'
    },
    {
      href: 'https://m.me/lunashop.business.official',
      icon: <FaFacebookMessenger className="text-lg" />,
      label: 'Messenger',
      bgColor: 'bg-[#1877f2]',
      shadowColor: 'shadow-blue-500/30',
      target: '_blank'
    }
  ]

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end pointer-events-none">
        <div className="flex flex-col items-end gap-3">
          {contactButtons.map((button, index) => (
            <div
              key={index}
              className={`transform transition-all duration-500 ease-out ${
                openContact
                  ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
                  : 'translate-y-10 opacity-0 scale-0 pointer-events-none'
              }`}
              style={{
                transitionDelay: openContact
                  ? `${index * 80}ms`
                  : `${(contactButtons.length - index - 1) * 60}ms`
              }}
            >
              <div className="group relative flex items-center">
                <div
                  className={`mr-3 px-4 py-2 rounded-full bg-white text-gray-700 text-sm font-medium whitespace-nowrap shadow-md border border-gray-100 transform transition-all duration-300 ${
                    openContact
                      ? 'opacity-100 translate-x-0 scale-100'
                      : 'opacity-0 translate-x-6 scale-75'
                  }`}
                  style={{
                    transitionDelay: openContact ? `${index * 80 + 120}ms` : '0ms'
                  }}
                >
                  {button.label}
                  <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100"></div>
                </div>

                {button.href ? (
                  <a
                    href={button.href}
                    target={button.target}
                    rel={button.target ? 'noopener noreferrer' : undefined}
                    className={`relative w-12 h-12 flex items-center justify-center rounded-full ${button.bgColor} text-white shadow-xl ${button.shadowColor} transform transition-all duration-300 hover:scale-110 active:scale-95 group pointer-events-auto`}
                  >
                    <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-200">
                      {button.icon}
                    </div>
                    {button.badge > 0 && (
                      <span className="absolute -right-1 -top-1 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-md">
                        {button.badge > 9 ? '9+' : button.badge}
                      </span>
                    )}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setOpenContact(false)
                      button.onClick?.()
                    }}
                    className={`relative w-12 h-12 flex items-center justify-center rounded-full ${button.bgColor} text-white shadow-xl ${button.shadowColor} transform transition-all duration-300 hover:scale-110 active:scale-95 group pointer-events-auto`}
                  >
                    <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-200">
                      {button.icon}
                    </div>
                    {button.badge > 0 && (
                      <span className="absolute -right-1 -top-1 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-md">
                        {button.badge > 9 ? '9+' : button.badge}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="relative mt-3 group">
            <button
              onClick={() => setOpenContact(!openContact)}
              className={`relative w-12 h-12 flex items-center justify-center rounded-full pointer-events-auto text-white shadow-xl transform transition-all duration-300 hover:scale-110 active:scale-95 ${
                openContact
                  ? 'bg-[#ff424e] shadow-red-500/30'
                  : 'bg-[#0b74e5] shadow-blue-500/30'
              }`}
              aria-label={openContact ? 'Đóng liên hệ' : 'Mở liên hệ'}
            >
              <div className="relative z-10">
                {openContact ? <FaTimes size={18} /> : <FaComments size={18} />}
              </div>

              {!openContact && (
                <span className="absolute -inset-1 rounded-full border border-[#0b74e5]/30 animate-ping pointer-events-none" />
              )}
              {!openContact && supportUnread > 0 && (
                <span className="absolute -right-1 -top-1 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-md">
                  {supportUnread > 9 ? '9+' : supportUnread}
                </span>
              )}
            </button>
          </div>
        </div>

        <div
          className={`transition-all duration-500 ${
            showScroll
              ? 'mt-4 max-h-16 opacity-100 overflow-visible'
              : 'mt-0 max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div
            className={`group relative transform transition-all duration-500 ${
              showScroll
                ? 'translate-y-0 scale-100 pointer-events-auto'
                : 'translate-y-8 scale-0 pointer-events-none'
            }`}
          >
            <button
              onClick={scrollToTop}
              className={`relative w-12 h-12 rounded-full flex items-center justify-center pointer-events-auto transition-all duration-300 ${
                showScroll ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}
              aria-label="Cuộn lên đầu trang"
            >
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(#0b74e5 ${progress}%, #e5e7eb 0%)`
                }}
              />

              <span className="absolute inset-[3px] rounded-full bg-white shadow-lg" />

              <FaArrowUp className="relative z-10 text-[#0b74e5]" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FloatingButtons
