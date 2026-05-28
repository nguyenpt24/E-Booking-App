import React from 'react';
import { useApp } from '../context/AppContext';

export default function TourCard({ tour, onViewDetails }) {
  const { formatPrice, addToCart } = useApp();

  const isPromo = tour.discountPercent > 0;
  const promoPrice = isPromo ? (tour.price * (100 - tour.discountPercent)) / 100 : tour.price;

  return (
    <div className="group bg-white border border-[#e6eef0] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col relative">
      <div className="relative h-44 sm:h-48 bg-slate-100 overflow-hidden">
        {isPromo && (
          <div className="absolute top-3 left-3 z-10 bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm animate-pulse">
            -{tour.discountPercent}%
          </div>
        )}
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 shadow-sm">
          📍 {tour.destination}
        </div>
        <div className="absolute top-3 right-3">
          {tour.availableSlots === 0 ? (
            <span className="bg-rose-100 text-rose-700 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              Hết chỗ
            </span>
          ) : tour.availableSlots <= 3 ? (
            <span className="bg-rose-500 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase animate-pulse">
              Chỉ còn {tour.availableSlots} chỗ
            </span>
          ) : (
            <span className="bg-[#eff7f4] text-emerald-700 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              Còn {tour.availableSlots} chỗ
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {tour.title}
          </h3>
          <div className="text-[10px] text-slate-400 mt-2 pb-2.5 border-b border-[#f0f6f3]">
            Khởi hành: <strong>{tour.departureDate}</strong>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3 mt-3">
            {tour.itinerary}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#f0f6f3] flex items-center justify-between">
          <div>
            {isPromo ? (
              <div>
                <span className="text-[9px] text-slate-400 block font-semibold line-through">
                  Gốc: {formatPrice(tour.price)}
                </span>
                <span className="text-sm font-black text-rose-500 block">
                  Ưu đãi: {formatPrice(promoPrice)}
                </span>
              </div>
            ) : (
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Giá từ</span>
                <span className="text-sm font-black text-rose-500 block">{formatPrice(tour.price)}</span>
              </div>
            )}
          </div>

          <div className="flex space-x-1.5">
            <button
              onClick={() => onViewDetails(tour)}
              className="bg-[#f0f6f3] hover:bg-[#e2ece7] text-emerald-700 text-[10px] font-bold px-3.5 py-2.5 rounded-xl transition-colors"
            >
              Chi tiết
            </button>
            <button
              onClick={() => addToCart(tour, 1)}
              disabled={tour.availableSlots === 0}
              className={`text-[10px] font-bold px-4 py-2.5 rounded-xl transition-all ${
                tour.availableSlots === 0
                  ? 'bg-slate-100 text-slate-350 cursor-not-allowed border border-slate-200'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
              }`}
            >
              Đặt Tour 🛒
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
