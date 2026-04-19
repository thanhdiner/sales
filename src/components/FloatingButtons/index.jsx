import React, { useState, useEffect } from 'react'
import { FaFacebookMessenger, FaPhoneAlt, FaComments, FaTimes, FaArrowUp } from 'react-icons/fa'
import { SiZalo } from 'react-icons/si'

const FloatingButtons = () => {
  const [showScroll, setShowScroll] = useState(false)
  const [openContact, setOpenContact] = useState(false)
  const [progress, setProgress] = useState(0)

  // useEffect(() => {
  //   const onScroll = () => setShowScroll(window.scrollY > 200)
  //   window.addEventListener('scroll', onScroll)
  //   return () => window.removeEventListener('scroll', onScroll)
  // }, [])
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
    {
      href: 'tel:0823387108',
      icon: <FaPhoneAlt size={16} />,
      label: 'Gọi ngay',
      bgColor: 'bg-[#EA6A41]',
      borderColor: 'border-[#EA6A41]',
      shadowColor: 'shadow-[#EA6A41]/40'
    },
    {
      href: 'https://zalo.me/0823387108',
      icon: <SiZalo size={16} />,
      label: 'Chat Zalo',
      bgColor: 'bg-[#0068FF]',
      borderColor: 'border-[#0068FF]',
      shadowColor: 'shadow-[#0068FF]/40',
      target: '_blank'
    },
    {
      href: 'https://m.me/lunashop.business.official',
      icon: <FaFacebookMessenger size={16} />,
      label: 'Messenger',
      bgColor: 'bg-[#0084FF]',
      borderColor: 'border-[#0084FF]',
      shadowColor: 'shadow-[#0084FF]/40',
      target: '_blank'
    }
  ]

  return (
    <>
      <div className="fixed bottom-4 right-4 flex flex-col items-end gap-3 z-50 pointer-events-none scale-90 origin-bottom-right md:scale-100 md:bottom-6 md:right-6">
        {/* Contact buttons */}
        <div className="flex flex-col items-end gap-3">
          {contactButtons.map((button, index) => (
            <div
              key={index}
              className={`transform transition-all duration-700 ease-out ${
                openContact ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto' : 'translate-y-12 opacity-0 scale-0 pointer-events-none'
              }`}
              style={{
                transitionDelay: openContact ? `${index * 100}ms` : `${(contactButtons.length - index - 1) * 80}ms`
              }}
            >
              <div className="group relative flex items-center">
                <div
                  className={`mr-4 px-4 py-2 rounded-full bg-white/95 text-gray-800 text-sm font-medium whitespace-nowrap shadow-lg border border-white/20 transform transition-all duration-300 ${
                    openContact ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-75'
                  }`}
                  style={{
                    transitionDelay: openContact ? `${index * 100 + 200}ms` : '0ms'
                  }}
                >
                  {button.label}
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/95 rotate-45 border-r border-b border-white/20"></div>
                </div>

                <a
                  href={button.href}
                  target={button.target}
                  rel={button.target ? 'noopener noreferrer' : undefined}
                  className={`relative w-11 h-11 flex items-center justify-center rounded-full ${button.bgColor} text-white shadow-xl ${button.shadowColor} transform transition-all duration-300 hover:scale-110 active:scale-95 group pointer-events-auto`}
                >
                  <div className={`absolute inset-0 rounded-full border ${button.borderColor} opacity-60 animate-ping pointer-events-none`} style={{ animationDuration: '2s' }}></div>
                  <div className="relative z-10 transform transition-transform duration-200">{button.icon}</div>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="relative group">
          <button
            onClick={() => setOpenContact(!openContact)}
            className={`relative w-12 h-12 flex items-center justify-center rounded-full pointer-events-auto
              text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95
              ${openContact ? 'bg-gray-800 shadow-gray-500/30' : 'bg-[#EA6A41] shadow-[#EA6A41]/40'}`}
            aria-label={openContact ? 'Đóng liên hệ' : 'Mở liên hệ'}
          >
            <div className={`relative z-10 transform transition-transform duration-300 ${openContact ? 'rotate-90' : 'rotate-0'}`}>
              {openContact ? <FaTimes size={18} /> : <FaComments size={18} />}
            </div>

            {!openContact && (
              <div className="absolute inset-0 rounded-full border border-[#EA6A41] opacity-60 animate-ping pointer-events-none" style={{ animationDuration: '2s' }}></div>
            )}
          </button>
        </div>

        {/* Scroll to top button */}
        <div
          className={`transform transition-all duration-500 ${
            showScroll ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto' : 'translate-y-8 opacity-0 scale-0 pointer-events-none'
          }`}
        >
          <div className="group relative">
            <button
              onClick={scrollToTop}
              className={`relative w-12 h-12 rounded-full flex items-center justify-center pointer-events-auto
                    transition-all duration-300 ${showScroll ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
              aria-label="Cuộn lên đầu trang"
            >
              {/* Vòng ngoài: tiến độ bằng conic-gradient */}
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(#274690 ${progress}%, #E5E7EB 0%)`
                }}
              />
              {/* Nền trong để tạo viền (độ dày viền = inset) */}
              <span className="absolute inset-[3px] rounded-full bg-white shadow-lg" />
              <FaArrowUp className="relative z-10 text-[#EA6A41]" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FloatingButtons
