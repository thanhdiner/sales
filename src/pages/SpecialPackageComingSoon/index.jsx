import SEO from '@/components/SEO'

export default function SpecialPackageComingSoon() {
  return (
    <div className="min-h-[60vh] bg-white px-4 py-12 dark:bg-gray-900">
      <SEO title="Gói đặc biệt – Sắp ra mắt" noIndex />

      <div className="mx-auto flex min-h-[48vh] max-w-xl items-center justify-center">
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            Sắp ra mắt
          </p>

          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white">
            Gói dịch vụ đặc biệt
          </h1>

          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-gray-600 dark:text-gray-300">
            Hiện tại chúng tôi chưa cung cấp các gói dịch vụ đặc biệt. Hãy quay lại sau hoặc liên hệ nếu bạn có nhu cầu riêng.
          </p>

          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
            <p className="mb-0 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Dịch vụ này sẽ được cập nhật trong thời gian tới.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}