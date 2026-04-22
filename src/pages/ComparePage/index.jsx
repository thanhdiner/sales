import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { syncCartFromServer } from '@/lib/clientCache';
import { ShoppingBag, Star, X, ShoppingCart, Zap, Trash2, BarChart2 } from 'lucide-react';
import { removeCompareLocal, clearCompareLocal } from '@/stores/compare';
import { Link } from 'react-router-dom';
import { message, Rate } from 'antd';
import SEO from '@/components/SEO';
import { addToCart } from '@/services/cartsService';
import { getCartUniqueItemLimitMessage, hasReachedCartUniqueItemLimit } from '@/lib/cartLimits';

export default function ComparePage() {
  const compareItems = useSelector(state => state.compare.items);
  const cartItems = useSelector(state => state.cart.items) || [];
  const dispatch = useDispatch();

  const handleAddToCart = async (item) => {
    if (hasReachedCartUniqueItemLimit(cartItems, item.productId)) {
      message.warning(getCartUniqueItemLimitMessage());
      return;
    }

    try {
      await addToCart({ productId: item.productId, quantity: 1 });
      await syncCartFromServer(dispatch);
      message.success(`Đã thêm ${item.name} vào giỏ hàng!`);
    } catch (err) {
      message.error(err.message || 'Thêm vào giỏ hàng thất bại!');
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  if (!compareItems || compareItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
        <div className="container mx-auto text-center max-w-lg">
          <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
             <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <BarChart2 className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Danh sách trống</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Bạn chưa chọn sản phẩm nào để so sánh. Hãy khám phá cửa hàng và thêm các sản phẩm yêu thích vào danh sách so sánh!
            </p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg active:scale-95">
              <ShoppingBag className="w-5 h-5" />
              Khám phá sản phẩm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <SEO title={`So sánh sản phẩm (${compareItems.length})`} noIndex />
      
      {/* Header Area */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm overflow-hidden">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                 <h1 className="text-2xl font-bold text-gray-800 dark:text-white">So sánh sản phẩm</h1>
                 <p className="text-sm text-gray-500 dark:text-gray-400">Đang so sánh {compareItems.length}/4 sản phẩm</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
               <button 
                onClick={() => dispatch(clearCompareLocal())}
                className="flex items-center gap-2 px-5 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Xóa tất cả
              </button>
              <Link to="/products" className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-bold transition-all shadow-sm">
                 Tiếp tục mua hàng
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-x-auto border border-gray-100 dark:border-gray-700 relative">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="p-6 text-left min-w-[200px] w-1/5 bg-gray-50/50 dark:bg-gray-900/10">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Đặc tính</span>
                </th>
                {compareItems.map(item => (
                  <th key={item.productId} className="p-6 min-w-[260px] max-w-[300px] align-top relative group">
                    <button
                      onClick={() => dispatch(removeCompareLocal(item.productId))}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    <div className="aspect-square rounded-2xl bg-gray-50 dark:bg-gray-900 p-4 mb-4 overflow-hidden shadow-inner border border-gray-100 dark:border-gray-700">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply transition-transform hover:scale-110 duration-500" />
                    </div>
                    
                    <Link to={`/products/${item.slug}`} className="block h-12 mb-3">
                      <h3 className="text-base font-bold text-gray-800 dark:text-white line-clamp-2 hover:text-blue-500 transition-colors leading-snug">
                        {item.name}
                      </h3>
                    </Link>
                    
                    <div className="text-xl font-extrabold text-red-500 mb-4 tracking-tighter">
                       {formatPrice(item.price)}
                    </div>
                    
                    <button 
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.inStock}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${
                        item.inStock 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20' 
                          : 'bg-gray-400 text-white opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {item.inStock ? 'Mua ngay' : 'Hết hàng'}
                    </button>
                  </th>
                ) )}
                {/* Placeholder cells to keep layout consistent if less than 4 items */}
                {[...Array(Math.max(0, 4 - compareItems.length))].map((_, i) => (
                  <th key={`empty-${i}`} className="p-6 min-w-[260px] opacity-10 grayscale select-none">
                     <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center">
                        <BarChart2 className="w-12 h-12 text-gray-300" />
                     </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              <tr>
                <td className="p-5 font-bold text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-900/10">Đánh giá</td>
                {compareItems.map(item => (
                  <td key={item.productId} className="p-5">
                    <div className="flex items-center gap-2 font-bold text-yellow-500">
                       <Rate disabled defaultValue={item.rate || 5} style={{ fontSize: 16 }} className="text-sm" />
                       <span className="text-gray-400 dark:text-gray-500 font-medium">({item.rate || 5})</span>
                    </div>
                  </td>
                ))}
                 {[...Array(Math.max(0, 4 - compareItems.length))].map((_, i) => (
                  <td key={`empty-rate-${i}`} className="p-5">-</td>
                ))}
              </tr>
              
              <tr>
                <td className="p-5 font-bold text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-900/10">Giảm giá</td>
                {compareItems.map(item => (
                   <td key={item.productId} className="p-5 italic text-sm">
                      {item.discountPercentage > 0 ? (
                        <span className="text-green-500 font-bold bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">-{item.discountPercentage}% OFF</span>
                      ) : <span className="text-gray-400">Không có</span>}
                   </td>
                ))}
                {[...Array(Math.max(0, 4 - compareItems.length))].map((_, i) => (
                  <td key={`empty-disc-${i}`} className="p-5">-</td>
                ))}
              </tr>

              <tr>
                <td className="p-5 font-bold text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-900/10">Tiết kiệm</td>
                {compareItems.map(item => {
                  const saved = item.originalPrice - item.price;
                  return (
                    <td key={item.productId} className="p-5 text-sm text-green-600 font-medium">
                       {saved > 0 ? formatPrice(saved) : '0₫'}
                    </td>
                  )
                })}
                {[...Array(Math.max(0, 4 - compareItems.length))].map((_, i) => (
                  <td key={`empty-saved-${i}`} className="p-5">-</td>
                ))}
              </tr>

              <tr>
                <td className="p-5 font-bold text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-900/10">Kho hàng</td>
                {compareItems.map(item => (
                  <td key={item.productId} className="p-5">
                    <div className="flex items-center gap-2">
                       <div className={`w-2.5 h-2.5 rounded-full ${item.inStock ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                       <span className={`text-sm font-bold ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
                          {item.inStock ? `Còn ${item.stock} cái` : 'Hết hàng'}
                       </span>
                    </div>
                  </td>
                ))}
                {[...Array(Math.max(0, 4 - compareItems.length))].map((_, i) => (
                  <td key={`empty-stock-${i}`} className="p-5">-</td>
                ))}
              </tr>

               <tr>
                <td className="p-5 font-bold text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-900/10 align-top">Mô tả sản phẩm</td>
                {compareItems.map(item => (
                  <td key={item.productId} className="p-5 align-top">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-h-40 overflow-y-auto custom-scrollbar">
                      Sản phẩm {item.name} là tài khoản/phần mềm chính hãng được cung cấp bởi SmartMall. Giá cả cạnh tranh nhất thị trường.
                    </p>
                  </td>
                ))}
                {[...Array(Math.max(0, 4 - compareItems.length))].map((_, i) => (
                  <td key={`empty-desc-${i}`} className="p-5">-</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Comparison Tips */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] text-white shadow-xl shadow-blue-500/20">
              <div className="flex items-center gap-3 mb-4">
                 <Zap className="w-8 h-8 text-yellow-300 fill-yellow-300" />
                 <h4 className="text-xl font-bold">Làm sao để chọn đúng?</h4>
              </div>
              <p className="text-blue-50 opacity-90 leading-relaxed">
                Khi so sánh các sản phẩm ảo như tài khoản, hãy chú ý đến thời hạn sử dụng và chế độ bảo hành. SmartMall luôn cam kết bảo hành 1:1 cho mọi sản phẩm!
              </p>
           </div>
           
           <div className="p-8 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                   <Star className="w-6 h-6 text-pink-500 fill-pink-500" />
                 </div>
                 <h4 className="text-xl font-bold text-gray-800 dark:text-white">Gợi ý từ SmartMall</h4>
              </div>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Sản phẩm nào có lượt mua nhiều và đánh giá cao thường là các gói được cộng đồng yêu thích nhất. Hãy cân nhắc các gói <b>Top Deal</b> để có giá tốt nhất!
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
