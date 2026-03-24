import React from 'react'

const defaultCards = [
  {
    title: 'Card one',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    gradientFrom: '#ffbc00',
    gradientTo: '#ff0058'
  },
  {
    title: 'Card two',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    gradientFrom: '#03a9f4',
    gradientTo: '#ff0058'
  },
  {
    title: 'Card three',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    gradientFrom: '#4dff03',
    gradientTo: '#00d0ff'
  }
]

export default function SkewCards({ cards = defaultCards, className = '' }) {
  return (
    <>
      <div className={`flex justify-center items-center flex-wrap py-6 ${className}`}>
        {cards.map(({ title, desc, gradientFrom, gradientTo, icon: Icon, ctaLabel = 'Read More', href = '#' }, idx) => (
          <div key={idx} className="group relative w-[320px] h-[400px] m-[28px_20px] transition-all duration-500">
            {/* Skewed gradient panels */}
            <span
              className="absolute top-0 left-[50px] w-1/2 h-full rounded-lg transform skew-x-[15deg] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[20px] group-hover:w-[calc(100%-90px)]"
              style={{
                background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`
              }}
            />
            <span
              className="absolute top-0 left-[50px] w-1/2 h-full rounded-lg transform skew-x-[15deg] blur-[30px] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[20px] group-hover:w-[calc(100%-90px)]"
              style={{
                background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`
              }}
            />

            {/* Animated blurs */}
            <span className="pointer-events-none absolute inset-0 z-10">
              <span className="absolute top-0 left-0 w-0 h-0 rounded-lg opacity-0 bg-[rgba(255,255,255,0.1)] backdrop-blur-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] transition-all duration-100 animate-blob group-hover:top-[-50px] group-hover:left-[50px] group-hover:w-[100px] group-hover:h-[100px] group-hover:opacity-100" />
              <span
                className="absolute bottom-0 right-0 w-0 h-0 rounded-lg opacity-0 bg-[rgba(255,255,255,0.1)] backdrop-blur-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] transition-all duration-500 animate-blob group-hover:bottom-[-50px] group-hover:right-[50px] group-hover:w-[100px] group-hover:h-[100px] group-hover:opacity-100"
                style={{ animationDelay: '-1s' }}
              />
            </span>

            {/* Content */}
            <div className="relative z-20 left-0 p-[20px_40px] bg-[rgba(255,255,255,0.08)] backdrop-blur-[10px] shadow-lg rounded-lg text-white transition-all duration-500 group-hover:left-[-25px] group-hover:p-[52px_40px]">
              {Icon ? (
                <div className="mb-3 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/20">
                  <Icon className="w-5 h-5" />
                </div>
              ) : null}

              <h3 className="text-2xl mb-2 font-semibold">{title}</h3>
              <p className="text-base leading-relaxed mb-4 text-white/90">{desc}</p>
              <a
                href={href}
                className="inline-block text-sm font-bold text-black bg-white px-3 py-2 rounded hover:bg-[#ffcf4d] hover:border hover:border-[rgba(255,0,88,0.4)] hover:shadow-md transition-all"
              >
                {ctaLabel}
              </a>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translateY(10px); }
          50% { transform: translate(-10px); }
        }
        .animate-blob { animation: blob 2s ease-in-out infinite; }
      `}</style>
    </>
  )
}
