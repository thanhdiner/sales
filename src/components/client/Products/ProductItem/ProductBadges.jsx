import { useTranslation } from 'react-i18next'

export default function ProductBadges({ product }) {
  const { t } = useTranslation('clientProducts')

  const badges = [
    product.isTopDeal && {
      key: 'hotdeal',
      text: t('productItem.hotDeal'),
      sketch: true,
      className: 'pointer-events-none h-[34px] w-[104px] select-none'
    },
    product.isFeatured && {
      key: 'featured',
      text: t('productItem.featured'),
      sketchFeatured: true,
      className: 'pointer-events-none h-[34px] w-[106px] select-none'
    }
  ].filter(Boolean)

  if (!badges.length) return null

  return (
    <div className="absolute inset-x-2 bottom-5 z-20 flex flex-nowrap items-center gap-0.5 sm:inset-x-3 sm:bottom-6">
      {badges.map(({ key, text, className, sketch, sketchFeatured }) => (
        <div key={key} className={className}>
          {sketch ? (
            <>
              <svg className="h-full w-full" viewBox="0 0 138 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  d="M17 11C37 8.5 65 10.5 99 10C112 9.8 121 16 120 26C119 36 110 43 96 43.5C64 45 37 43 17 41.5C8 40.8 4 34.5 5 25C6 15.8 9 12 17 11Z"
                  fill="#FFF7ED"
                  stroke="#FDBA74"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M19 13C38 11.5 65 13 96 12.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.9"
                />
                <path
                  d="M23 15C18.5 19.5 18 24.5 21 28.8C23.7 32.5 29.5 33 33 29.5C36.5 26 35.2 20.8 31 17C31.5 20.2 30.4 22.4 28.4 23.7C28.7 19.7 26.6 17 23 15Z"
                  fill="#F97316"
                />
                <path
                  d="M26.7 25.2C25.2 26.5 25.2 28.5 26.5 29.5C28 30.7 30.4 30.1 31 28.4C31.6 26.7 30.2 25.2 28.8 24.2C28.9 25.5 28.2 26.5 26.7 25.2Z"
                  fill="#FFE7C2"
                />
                <text
                  x="42"
                  y="31"
                  fontFamily="Comic Sans MS, Segoe Print, cursive"
                  fontSize="15"
                  fontWeight="800"
                  fill="#EA580C"
                  transform="rotate(-0.5 42 31)"
                >
                  {text}
                </text>
              </svg>
              <span className="sr-only">{text}</span>
            </>
          ) : sketchFeatured ? (
            <>
              <svg className="h-full w-full" viewBox="0 0 140 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  d="M17 11C38 8.5 66 10.5 101 10C114 9.8 123 16 122 26C121 36 112 43 98 43.5C65 45 38 43 17 41.5C8 40.8 4 34.5 5 25C6 15.8 9 12 17 11Z"
                  fill="#F8FAFC"
                  stroke="#CBD5E1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M19 13C39 11.5 66 13 98 12.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.9"
                />
                <path
                  d="M28 15L30.8 21.2L37.5 22L32.4 26.4L34 33L28 29.5L22 33L23.6 26.4L18.5 22L25.2 21.2L28 15Z"
                  fill="#94A3B8"
                />
                <path
                  d="M28 19L29.3 23L33.3 23.5L30.1 26.1L31.1 30L28 27.8L24.9 30L25.9 26.1L22.7 23.5L26.7 23L28 19Z"
                  fill="#CBD5E1"
                />
                <text
                  x="44"
                  y="31"
                  fontFamily="Comic Sans MS, Segoe Print, cursive"
                  fontSize="15"
                  fontWeight="800"
                  fill="#475569"
                  transform="rotate(-0.5 44 31)"
                >
                  {text}
                </text>
              </svg>
              <span className="sr-only">{text}</span>
            </>
          ) : null}
        </div>
      ))}
    </div>
  )
}
