import React from 'react';
import { useApp } from '../context/AppContext';

export default function TourDetailModal({ tour, onClose }) {
  const { formatPrice, addToCart } = useApp();

  if (!tour) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#e6eef0] w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden relative animate-scaleIn">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-600" />

        <div className="relative h-56 bg-slate-100">
          <img
            src={tour.image}
            alt={tour.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/95 text-slate-700 font-extrabold w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-slate-100"
          >
            ✕
          </button>
          <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 shadow-sm">
            📍 {tour.destination}
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{tour.title}</h3>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pb-2.5 border-b border-[#f0f6f3]">
              <span>
                Ngày khởi hành: <strong className="text-slate-700">{tour.departureDate}</strong>
              </span>
              <span>
                Mức giá:{' '}
                {tour.discountPercent > 0 ? (
                  <strong className="text-rose-500">
                    <span className="line-through text-slate-400 mr-2 text-[10px]">
                      {formatPrice(tour.price)}
                    </span>
                    {formatPrice((tour.price * (100 - tour.discountPercent)) / 100)}
                    <span className="ml-2 text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-black">
                      -{tour.discountPercent}%
                    </span>
                  </strong>
                ) : (
                  <strong className="text-rose-500">{formatPrice(tour.price)}</strong>
                )}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              🗺️ Hành trình chuyến đi chi tiết:
            </h4>
            <div className="bg-[#f8faf9] border border-[#e2ece7] p-4 rounded-xl max-h-48 overflow-y-auto text-xs text-slate-500 leading-relaxed whitespace-pre-line">
              {tour.itinerary}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#f0f6f3]">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">
                Tình trạng giữ chỗ
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                Còn trống {tour.availableSlots} chỗ
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-5 py-3 rounded-xl transition-all"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  addToCart(tour, 1);
                  onClose();
                }}
                disabled={tour.availableSlots === 0}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all"
              >
                Thêm vào giỏ hàng 🛒
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
