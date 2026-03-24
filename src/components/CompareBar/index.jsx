import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, ArrowRight, BarChart2, ChevronUp, ChevronDown } from 'lucide-react';
import { removeCompareLocal, clearCompareLocal } from '@/stores/compare';
import { useNavigate } from 'react-router-dom';

export default function CompareBar() {
  const compareItems = useSelector(state => state.compare.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!compareItems || compareItems.length === 0) return null;

  // Thu nhỏ (Collapsed)
  if (isCollapsed) {
    return (
      <div 
        onClick={() => setIsCollapsed(false)}
        className="fixed bottom-6 right-24 z-[1001] bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl shadow-2xl cursor-pointer flex items-center gap-3 transition-all active:scale-95 animate-in slide-in-from-bottom-5"
      >
        <BarChart2 className="w-5 h-5" />
        <span className="font-bold text-sm">So sánh ({compareItems.length}/4)</span>
        <ChevronUp className="w-4 h-4" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-24 z-[1001] w-[340px] bg-white dark:bg-gray-900 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-800/50 px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="font-bold text-gray-800 dark:text-white">So sánh ({compareItems.length}/4)</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsCollapsed(true)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            title="Thu gọn"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button 
            onClick={() => dispatch(clearCompareLocal())}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Xóa hết"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body: Items Grid */}
      <div className="p-5">
        <div className="grid grid-cols-4 gap-3 mb-5">
          {compareItems.map(item => (
            <div 
              key={item.productId} 
              className="relative group aspect-square rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800 hover:border-blue-200 transition-all shadow-sm"
            >
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover p-1" 
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(removeCompareLocal(item.productId));
                }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Empty slots placeholders */}
          {[...Array(Math.max(0, 4 - compareItems.length))].map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square rounded-xl border-2 border-dashed border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-300">
               <span className="text-xs">+</span>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <button
          onClick={() => navigate('/compare')}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          So sánh ngay
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
