import { extractFileName } from '@/utils/extractFileName'

function ProductCategoryThumbnail({ thumbnail, title }) {
  return (
    <div className="text-center border border-[#f0f0f0] rounded-[12px] p-4 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.05)] max-w-[300px] mx-auto">
      <div className="p-2 rounded-[8px] flex justify-center items-center max-h-[200px]">
        <img className="max-w-full max-h-[200px] object-contain rounded-[4px]" src={thumbnail} alt={title} />
      </div>
      <p className="mt-3 font-semibold text-[#0b2c53] text-[14px]">{extractFileName(thumbnail)}</p>
    </div>
  )
}

export default ProductCategoryThumbnail
