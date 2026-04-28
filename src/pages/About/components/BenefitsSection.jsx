import React from 'react'
import { ShieldCheck, Truck, MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getArrayValue, getTextValue } from '../utils'

const itemIcons = [ShieldCheck, Truck, MessageCircle]

const BenefitsSection = ({ content }) => {
  const { t } = useTranslation('clientAbout')
  const items = getArrayValue(content?.items, t('benefitsSection.items', { returnObjects: true }))

  return (
    <section className="px-4 py-8 md:py-12">
      <div className="about-page__surface mx-auto max-w-6xl rounded-[28px] border border-gray-200 bg-[#fcfcfc] px-6 py-10 shadow-sm md:px-10 md:py-14">
        <h2 className="about-page__section-title text-center text-3xl font-bold uppercase tracking-tight text-[#111] md:text-5xl">
          {getTextValue(content?.title, t('benefitsSection.title'))}
        </h2>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-8">
          {Array.isArray(items) &&
            items.map((item, index) => {
              const Icon = itemIcons[index] || ShieldCheck

              return (
                <div key={`${item.title}-${index}`} className="flex flex-col items-center text-center">
                  <div className="about-page__icon-pill flex h-14 w-14 items-center justify-center rounded-full bg-[#2672CD] text-white">
                    <Icon className="h-7 w-7" strokeWidth={2.2} />
                  </div>

                  <h3 className="about-page__item-title mt-5 max-w-[220px] text-2xl font-bold uppercase leading-none text-[#111] md:text-[22px]">
                    {item.title}
                  </h3>

                  <p className="about-page__muted mt-4 max-w-[280px] text-base leading-8 text-gray-500 md:text-[15px] md:leading-7">
                    {item.description}
                  </p>
                </div>
              )
            })}
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection
