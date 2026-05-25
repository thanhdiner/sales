import React from 'react'
import { ClipboardCheck, ShoppingBag, Zap } from 'lucide-react'

const SPOTLIGHT_DURATION = '5.2s'
const HERO_TOPIC_ICONS = [ShoppingBag, ClipboardCheck, Zap]

const HERO_TOPIC_STYLES = [
  {
    spotlight:
      'conic-gradient(from 0deg, transparent 0deg, transparent 248deg, rgba(59,130,246,0.05) 270deg, rgba(96,165,250,0.95) 300deg, rgba(191,219,254,0.9) 325deg, transparent 348deg, transparent 360deg)',
    glow: 'radial-gradient(circle, rgba(96,165,250,0.34) 0%, rgba(96,165,250,0) 70%)'
  },
  {
    spotlight:
      'conic-gradient(from 0deg, transparent 0deg, transparent 245deg, rgba(251,146,60,0.06) 268deg, rgba(251,146,60,0.95) 298deg, rgba(253,186,116,0.92) 324deg, transparent 347deg, transparent 360deg)',
    glow: 'radial-gradient(circle, rgba(251,146,60,0.3) 0%, rgba(251,146,60,0) 70%)'
  },
  {
    spotlight:
      'conic-gradient(from 0deg, transparent 0deg, transparent 250deg, rgba(168,85,247,0.05) 272deg, rgba(192,132,252,0.96) 302deg, rgba(244,114,182,0.88) 327deg, transparent 349deg, transparent 360deg)',
    glow: 'radial-gradient(circle, rgba(216,180,254,0.32) 0%, rgba(216,180,254,0) 70%)'
  }
]

const HeroTopicTags = ({ topics = [] }) => {
  return (
    <div className="mt-6 flex flex-wrap gap-2 text-[12px] font-bold text-[#3d4350] dark:text-gray-400">
      {topics.map((label, index) => {
        const topic = HERO_TOPIC_STYLES[index % HERO_TOPIC_STYLES.length]
        const Icon = HERO_TOPIC_ICONS[index % HERO_TOPIC_ICONS.length]

        return (
        <span
          key={`${label}-${index}`}
          className="group relative inline-flex overflow-hidden rounded-[12px] p-[1px] transition-transform duration-300 hover:-translate-y-0.5"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-175%] rounded-[12px] motion-safe:animate-spin"
            style={{
              backgroundImage: topic.spotlight,
              animationDuration: SPOTLIGHT_DURATION,
              animationTimingFunction: 'linear'
            }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[12px] opacity-70 blur-md transition-opacity duration-300 group-hover:opacity-100"
            style={{ backgroundImage: topic.glow }}
          />
          <span className="contact-topic-tag relative inline-flex items-center gap-1.5 rounded-[11px] border border-[#ffe0cf] bg-white px-3 py-2 text-[#3f4654] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:bg-gray-800 dark:text-gray-300">
            <Icon className="h-3.5 w-3.5 text-[#ff641f]" />
            {label}
          </span>
        </span>
        )
      })}
    </div>
  )
}

export default HeroTopicTags
