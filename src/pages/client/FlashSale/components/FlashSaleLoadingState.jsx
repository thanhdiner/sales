import SaleHeaderSkeleton from './SaleHeaderSkeleton'

export default function FlashSaleLoadingState() {
  return (
    <section className="mt-6 space-y-8 animate-pulse">
      <SaleHeaderSkeleton />
      <SaleHeaderSkeleton upcoming />
    </section>
  )
}
