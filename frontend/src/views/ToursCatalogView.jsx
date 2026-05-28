import React from 'react';
import { useApp } from '../context/AppContext';
import TourCard from '../components/TourCard';

export default function ToursCatalogView({ onViewTourDetails }) {
  const { tours, loadingTours, activeCategory, setActiveCategory } = useApp();

  const getFilteredTours = () => {
    if (activeCategory === 'all') return tours;
    if (activeCategory === 'domestic') {
      return tours.filter(
        (t) =>
          !t.destination.toLowerCase().includes('singapore') &&
          !t.destination.toLowerCase().includes('thái lan') &&
          !t.destination.toLowerCase().includes('nhật bản') &&
          !t.destination.toLowerCase().includes('korea')
      );
    }
    if (activeCategory === 'international') {
      return tours.filter(
        (t) =>
          t.destination.toLowerCase().includes('singapore') ||
          t.destination.toLowerCase().includes('thái lan') ||
          t.destination.toLowerCase().includes('nhật bản') ||
          t.destination.toLowerCase().includes('korea') ||
          t.destination.toLowerCase().includes('quốc tế')
      );
    }
    return tours;
  };

  const filteredToursList = getFilteredTours();

  return (
    <div>
      <div className="border-b border-[#e6eef0] pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">📂 Tất cả các chuyến đi du lịch</h1>
          <p className="text-[11px] text-slate-400 mt-1">
            Đầy đủ thông tin, hành trình minh bạch, dịch vụ chuẩn 5 sao.
          </p>
        </div>

        {/* Categorization tabs with smooth sliding pill transition */}
        <div className="flex bg-slate-100 border border-[#e6eef0] p-1 rounded-xl shadow-sm self-start relative overflow-hidden h-[38px] items-center">
          <div
            className="absolute bg-emerald-600 rounded-lg transition-all duration-300 ease-out shadow-sm shadow-emerald-600/10 h-[30px]"
            style={{
              width: '85px',
              left:
                activeCategory === 'all'
                  ? '4px'
                  : activeCategory === 'domestic'
                  ? '89px'
                  : '174px'
            }}
          />
          <button
            onClick={() => setActiveCategory('all')}
            className={`relative z-10 text-[11px] font-bold px-4 py-2 rounded-lg transition-all duration-300 text-center ${
              activeCategory === 'all' ? 'text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
            style={{ width: '85px' }}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveCategory('domestic')}
            className={`relative z-10 text-[11px] font-bold px-4 py-2 rounded-lg transition-all duration-300 text-center ${
              activeCategory === 'domestic' ? 'text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
            style={{ width: '85px' }}
          >
            Trong nước
          </button>
          <button
            onClick={() => setActiveCategory('international')}
            className={`relative z-10 text-[11px] font-bold px-4 py-2 rounded-lg transition-all duration-300 text-center ${
              activeCategory === 'international' ? 'text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
            style={{ width: '85px' }}
          >
            Quốc tế
          </button>
        </div>
      </div>

      {loadingTours ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-xs text-slate-400">Đang đồng bộ dữ liệu...</span>
        </div>
      ) : filteredToursList.length === 0 ? (
        <div className="bg-white border border-[#e6eef0] p-16 rounded-3xl text-center text-slate-400 text-xs">
          🔍 Không tìm thấy tour du lịch nào. Hãy đổi danh mục hoặc bộ lọc khác.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scaleIn">
          {filteredToursList.map((tour) => (
            <TourCard key={tour.id} tour={tour} onViewDetails={onViewTourDetails} />
          ))}
        </div>
      )}
    </div>
  );
}
