import React from 'react'
import { motion } from 'framer-motion'
import { Landmark, Gift, Newspaper, Users, Tag, ClipboardList } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getArrayValue } from '../utils'

const timelineMeta = [
  {
    icon: Landmark,
    color: '#f15a24'
  },
  {
    icon: Gift,
    color: '#ff1f6d'
  },
  {
    icon: Newspaper,
    color: '#be35c8'
  },
  {
    icon: Users,
    color: '#41c7a0'
  },
  {
    icon: Tag,
    color: '#2fa7df'
  },
  {
    icon: ClipboardList,
    color: '#a547f4'
  }
]

const timelineViewport = { once: false, amount: 0.35, margin: '-8% 0px -8% 0px' }

const getCardMotion = isLeft => ({
  hidden: {
    opacity: 0.24,
    x: isLeft ? -28 : 28,
    y: 10,
    scale: 0.985
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.36, ease: 'easeOut' }
  }
})

const mobileCardMotion = {
  hidden: { opacity: 0.24, x: 22, y: 10, scale: 0.985 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.32, ease: 'easeOut' }
  }
}

const dotMotion = {
  hidden: { opacity: 0.35, scale: 0.68 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.28, ease: 'easeOut' }
  }
}

const DesktopTimelineCard = ({ item, index, isLeft }) => {
  const Icon = item.icon

  return (
    <motion.div
      className={`relative ${isLeft ? 'col-start-1 pr-12' : 'col-start-2 pl-12'}`}
      initial="hidden"
      whileInView="visible"
      variants={getCardMotion(isLeft)}
      transition={{ delay: index * 0.035 }}
      viewport={timelineViewport}
    >
      <div className={`flex ${isLeft ? 'justify-end' : 'justify-start'}`}>
        <div className="about-page__timeline-card relative w-full max-w-[540px] border border-[#dddddd] bg-white shadow-sm">
          <div className={`grid min-h-[120px] ${isLeft ? 'grid-cols-[72px_1fr_28px]' : 'grid-cols-[28px_1fr_72px]'}`}>
            {isLeft ? (
              <>
                <div className="about-page__timeline-icon-cell flex items-center justify-center">
                  <Icon size={28} style={{ color: item.color }} strokeWidth={1.8} />
                </div>

                <div className="about-page__timeline-inner flex items-center border-l border-r border-[#e8e8e8] px-6 py-5">
                  <div>
                    <h3 className="mb-2 text-[18px] font-bold" style={{ color: item.color }}>
                      {item.title}
                    </h3>
                    <p className="about-page__timeline-copy text-[15px] leading-8 text-[#666]">{item.description}</p>
                  </div>
                </div>

                <div className="relative" style={{ backgroundColor: item.color }}>
                  <div
                    className="absolute left-full top-1/2 -translate-y-1/2"
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: '12px solid transparent',
                      borderBottom: '12px solid transparent',
                      borderLeft: `16px solid ${item.color}`
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="relative" style={{ backgroundColor: item.color }}>
                  <div
                    className="absolute right-full top-1/2 -translate-y-1/2"
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: '12px solid transparent',
                      borderBottom: '12px solid transparent',
                      borderRight: `16px solid ${item.color}`
                    }}
                  />
                </div>

                <div className="about-page__timeline-inner flex items-center border-l border-r border-[#e8e8e8] px-6 py-5">
                  <div>
                    <h3 className="mb-2 text-[18px] font-bold" style={{ color: item.color }}>
                      {item.title}
                    </h3>
                    <p className="about-page__timeline-copy text-[15px] leading-8 text-[#666]">{item.description}</p>
                  </div>
                </div>

                <div className="about-page__timeline-icon-cell flex items-center justify-center">
                  <Icon size={28} style={{ color: item.color }} strokeWidth={1.8} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const MobileTimelineCard = ({ item, index }) => {
  const Icon = item.icon

  return (
    <motion.div
      className="relative pl-10"
      initial="hidden"
      whileInView="visible"
      variants={mobileCardMotion}
      transition={{ delay: index * 0.035 }}
      viewport={timelineViewport}
    >
      <motion.div
        className="about-page__timeline-dot absolute left-[7px] top-8 z-10 h-5 w-5 rounded-full border-[3px] border-white shadow"
        style={{ backgroundColor: item.color }}
        variants={dotMotion}
      />

      <div className="about-page__timeline-card overflow-hidden border border-[#d9d9d9] bg-white shadow-sm">
        <div className="grid grid-cols-[14px_1fr_56px]">
          <div style={{ backgroundColor: item.color }} />

          <div className="px-4 py-4">
            <h3 className="mb-1 text-[15px] font-bold" style={{ color: item.color }}>
              {item.title}
            </h3>
            <p className="about-page__timeline-copy text-[13px] leading-5 text-[#666]">{item.description}</p>
          </div>

          <div className="about-page__timeline-icon-cell flex items-center justify-center border-l border-[#e8e8e8]">
            <Icon size={22} style={{ color: item.color }} strokeWidth={1.8} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const Timeline = ({ content }) => {
  const { t } = useTranslation('clientAbout')
  const timelineItems = getArrayValue(content?.items, t('timelineSection.items', { returnObjects: true }))

  const timeline = Array.isArray(timelineItems)
    ? timelineItems.map((_, index) => ({
        ...(timelineMeta[index] || timelineMeta[index % timelineMeta.length]),
        title: timelineItems[index]?.title || '',
        description: timelineItems[index]?.description || ''
      }))
    : timelineMeta

  return (
    <section className="px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="relative hidden md:block">
          <div className="about-page__timeline-line absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#cfcfcf]" />

          <div className="space-y-10">
            {timeline.map((item, index) => {
              const isLeft = index % 2 === 0

              return (
                <div key={`${item.title}-${index}`} className="relative grid grid-cols-2 items-center">
                  <DesktopTimelineCard item={item} index={index} isLeft={isLeft} />

                  <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      className="about-page__timeline-dot h-7 w-7 rounded-full border-4 border-white shadow-sm"
                      style={{ backgroundColor: item.color }}
                      initial="hidden"
                      whileInView="visible"
                      variants={dotMotion}
                      viewport={timelineViewport}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative space-y-5 md:hidden">
          <div className="about-page__timeline-line absolute left-4 top-0 h-full w-px bg-[#cfcfcf]" />

          {timeline.map((item, index) => (
            <MobileTimelineCard key={`${item.title}-${index}`} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Timeline
