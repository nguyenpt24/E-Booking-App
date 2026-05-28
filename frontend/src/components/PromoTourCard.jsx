import React from 'react';
import { useApp } from '../context/AppContext';

export default function PromoTourCard({ tour, onViewDetails }) {
  const { formatPrice } = useApp();

  const promoPrice = (tour.price * (100 - tour.discountPercent)) / 100;

  return (
    <div className="group bg-white border border-[#e6eef0] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col relative">
      {/* Sale Tag */}
      <div className="absolute top-3 left-3 z-10 bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md animate-pulse">
        -{tour.discountPercent}% OFF
      </div>

      <div className="relative h-44 bg-slate-100 overflow-hidden">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 shadow-sm">
          📍 {tour.destination}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {tour.title}
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
            {tour.itinerary}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#f0f6f3] flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 block font-semibold line-through">
              Giá gốc: {formatPrice(tour.price)}
            </span>
            <span className="text-sm font-black text-rose-600 block">
              Ưu đãi: {formatPrice(promoPrice)}
            </span>
          </div>

          <button
            onClick={() => onViewDetails(tour)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
