import React from 'react'
import { useTranslation } from 'react-i18next'

function ProductCategoryHeroSection({ category, plainDescription }) {
  const { t } = useTranslation('clientProducts')

  return (
    <section className="relative overflow-hidden rounded-[18px] border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="relative grid gap-3 p-4 md:p-5 xl:grid-cols-[1.45fr_0.55fr] xl:items-stretch">
        <div className="flex flex-col justify-center rounded-[14px] bg-gray-50/70 p-5 dark:bg-gray-950/40 md:p-6">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                {t('categoryPage.hero.eyebrow')}
              </span>
            </div>

            <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.035em] text-gray-950 dark:text-white md:text-[36px]">
              {category.title}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-300 md:text-[15px]">{plainDescription}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[14px] bg-gray-50/70 p-4 dark:bg-gray-950/40">
          <div className="relative flex h-full min-h-[180px] items-center justify-center md:min-h-[210px]">
            {category.thumbnail ? (
              <img
                src={category.thumbnail}
                alt={t('categoryPage.hero.imageAlt', {
                  categoryTitle: category.title
                })}
                className="aspect-square w-full max-w-[135px] object-contain md:max-w-[165px] lg:max-w-[185px]"
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 px-6 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
                {t('categoryPage.hero.noImage')}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductCategoryHeroSection
