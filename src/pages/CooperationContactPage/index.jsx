import SEO from '@/components/SEO'
import { useSelector } from 'react-redux'
import '../Contact/Contact.scss'

const CooperationContactPage = () => {
  const websiteConfig = useSelector(state => state.websiteConfig.data)

  const email = websiteConfig?.contactInfo?.email || 'smartmall.business.official@gmail.com'
  const phone = websiteConfig?.contactInfo?.phone || '0823387108'

  return (
    <div className="contact-themed min-h-[70vh] bg-white px-4 py-12 dark:bg-gray-900">
      <SEO
        title="Hợp tác kinh doanh"
        description="Liên hệ SmartMall để hợp tác kinh doanh và phân phối sản phẩm."
      />

      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <p className="contact-section-eyebrow mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            Hợp tác
          </p>

          <h1 className="contact-title text-3xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white">
            Liên hệ hợp tác
          </h1>

          <p className="contact-description mx-auto mt-4 max-w-xl text-base leading-7 text-gray-600 dark:text-gray-300">
            Bạn muốn hợp tác kinh doanh, quảng cáo, phân phối sản phẩm hoặc trở thành đại lý?
            Chúng tôi luôn sẵn sàng lắng nghe đề xuất và cùng phát triển.
          </p>
        </div>

        <div className="contact-card rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8">
          <div className="space-y-4">
            <div className="contact-muted-box rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
              <p className="contact-card-title text-sm font-semibold text-gray-900 dark:text-gray-100">
                Email
              </p>

              <a
                href={`mailto:${email}`}
                className="contact-muted-text mt-2 block break-all text-sm leading-6 text-gray-600 underline underline-offset-4 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                {email}
              </a>
            </div>

            <div className="contact-muted-box rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
              <p className="contact-card-title text-sm font-semibold text-gray-900 dark:text-gray-100">
                Hotline / Zalo
              </p>

              <a
                href={`tel:${phone}`}
                className="contact-muted-text mt-2 block text-sm leading-6 text-gray-600 underline underline-offset-4 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                {phone}
              </a>
            </div>
          </div>

          <div className="contact-card-row mt-6 rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="contact-muted-text mb-0 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Hoặc gửi đề xuất hợp tác qua email để được phản hồi trong vòng 24-48 giờ.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CooperationContactPage
