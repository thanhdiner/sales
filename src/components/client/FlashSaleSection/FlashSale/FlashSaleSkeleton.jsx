import { useTranslation } from 'react-i18next'
import SliderSkeleton from '../../../shared/LazyLoad/SliderSkeleton'

export default function FlashSaleSkeleton() {
  const { t } = useTranslation('clientHome')

  return (
    <>
      <div className="home__flash-sale__countdown">
        <span>{t('flashSaleSection.countdownLabel')}</span>
        <span className="countdown-timer skeleton-timer"></span>
      </div>

      <SliderSkeleton />
    </>
  )
}