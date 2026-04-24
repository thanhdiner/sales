import { FileImageOutlined, PictureOutlined } from '@ant-design/icons'
import { extractFileName } from '@/utils/extractFileName'

function ProductCategoryThumbnail({ thumbnail, title }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 bg-gradient-to-br from-slate-100 via-white to-sky-50 px-5 py-4 dark:border-gray-700 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg text-slate-700 shadow-sm dark:bg-gray-800 dark:text-gray-200">
            <PictureOutlined />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Ảnh đại diện danh mục</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Xem nhanh ảnh đang dùng cho danh mục này.</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {thumbnail ? (
          <>
            <div className="flex min-h-[260px] items-center justify-center rounded-[24px] border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-slate-100 p-4 dark:border-gray-700 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
              <img className="max-h-[240px] w-full rounded-2xl object-contain" src={thumbnail} alt={title} />
            </div>

            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/60">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-gray-400 dark:text-gray-500">
                  <FileImageOutlined />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500">Tên file</p>
                  <p className="mt-1 break-all text-sm font-medium text-gray-700 dark:text-gray-200">{extractFileName(thumbnail)}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-[24px] border border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center dark:border-gray-700 dark:bg-gray-900/50">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Danh mục này chưa có ảnh đại diện.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductCategoryThumbnail
