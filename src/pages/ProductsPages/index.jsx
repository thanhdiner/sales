import Products from '@/components/Products'
import SEO from '@/components/SEO'

function ProductsPages() {
  return (
    <div className="bg-white pt-5 rounded-tl-[8px] rounded-tr-[8px] shadow dark:bg-gray-800">
      <SEO title="Tất cả sản phẩm"
        description="Khám phá hàng trăm sản phẩm tại SmartMall – tài khoản game, phần mềm bản quyền chính hãng, giá tốt, giao hàng nhanh." />
      <div className="dark:bg-gray-800 pb-10">
        <Products />
      </div>
    </div>
  )
}

export default ProductsPages
