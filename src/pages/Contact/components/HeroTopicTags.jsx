import React from 'react'

const SPOTLIGHT_DURATION = '5.2s'

const HERO_TOPICS = [
  {
    label: 'Tư vấn sản phẩm',
    spotlight:
      'conic-gradient(from 0deg, transparent 0deg, transparent 248deg, rgba(59,130,246,0.05) 270deg, rgba(96,165,250,0.95) 300deg, rgba(191,219,254,0.9) 325deg, transparent 348deg, transparent 360deg)',
    glow: 'radial-gradient(circle, rgba(96,165,250,0.34) 0%, rgba(96,165,250,0) 70%)',
  },
  {
    label: 'Hỗ trợ đơn hàng',
    spotlight:
      'conic-gradient(from 0deg, transparent 0deg, transparent 245deg, rgba(251,146,60,0.06) 268deg, rgba(251,146,60,0.95) 298deg, rgba(253,186,116,0.92) 324deg, transparent 347deg, transparent 360deg)',
    glow: 'radial-gradient(circle, rgba(251,146,60,0.3) 0%, rgba(251,146,60,0) 70%)',
  },
  {
    label: 'Phản hồi nhanh',
    spotlight:
      'conic-gradient(from 0deg, transparent 0deg, transparent 250deg, rgba(168,85,247,0.05) 272deg, rgba(192,132,252,0.96) 302deg, rgba(244,114,182,0.88) 327deg, transparent 349deg, transparent 360deg)',
    glow: 'radial-gradient(circle, rgba(216,180,254,0.32) 0%, rgba(216,180,254,0) 70%)',
  },
]

const HeroTopicTags = () => {
  return (
    <div className="mt-6 flex flex-wrap gap-2 text-[13px] font-medium text-gray-500 dark:text-gray-400">
      {HERO_TOPICS.map(topic => (
        <span
          key={topic.label}
          className="group relative inline-flex overflow-hidden rounded-full p-[1px] transition-transform duration-300 hover:-translate-y-0.5"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-175%] rounded-full motion-safe:animate-spin"
            style={{
              backgroundImage: topic.spotlight,
              animationDuration: SPOTLIGHT_DURATION,
              animationTimingFunction: 'linear',
            }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full opacity-70 blur-md transition-opacity duration-300 group-hover:opacity-100"
            style={{ backgroundImage: topic.glow }}
          />
          <span className="contact-topic-tag relative rounded-full bg-white px-3 py-1 text-gray-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:bg-gray-800 dark:text-gray-300">
            {topic.label}
          </span>
        </span>
      ))}
    </div>
  )
}

export default HeroTopicTags
