import Products from '@/components/Products'
import titles from '@/utils/titles'

function ProductsPages() {
  titles('Products')

  return (
    <div className="bg-white pt-5 rounded-tl-[8px] rounded-tr-[8px] shadow">
      <div className="products-scrollbar h-[800px] overflow-y-auto">
        <Products />
      </div>
    </div>
  )
}

export default ProductsPages
