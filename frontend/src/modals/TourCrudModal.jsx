import React, { useState, useEffect } from 'react';

export default function TourCrudModal({ isOpen, crudMode, tour, onClose, onSubmit }) {
  const [crudTitle, setCrudTitle] = useState('');
  const [crudDestination, setCrudDestination] = useState('');
  const [crudPrice, setCrudPrice] = useState('');
  const [crudDepartureDate, setCrudDepartureDate] = useState('');
  const [crudItinerary, setCrudItinerary] = useState('');
  const [crudAvailableSlots, setCrudAvailableSlots] = useState(10);
  const [crudImage, setCrudImage] = useState('');

  useEffect(() => {
    if (crudMode === 'EDIT' && tour && isOpen) {
      setCrudTitle(tour.title || '');
      setCrudDestination(tour.destination || '');
      setCrudPrice(tour.price || '');
      setCrudDepartureDate(tour.departureDate || '');
      setCrudItinerary(tour.itinerary || '');
      setCrudAvailableSlots(tour.availableSlots ?? 10);
      setCrudImage(tour.image || '');
    } else if (isOpen) {
      setCrudTitle('');
      setCrudDestination('');
      setCrudPrice('');
      setCrudDepartureDate('');
      setCrudItinerary('');
      setCrudAvailableSlots(10);
      setCrudImage('');
    }
  }, [tour, crudMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title: crudTitle,
      destination: crudDestination,
      price: parseFloat(crudPrice),
      departureDate: crudDepartureDate,
      itinerary: crudItinerary,
      availableSlots: parseInt(crudAvailableSlots),
      image:
        crudImage ||
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#e6eef0] w-full max-w-xl rounded-3xl shadow-xl overflow-hidden relative animate-scaleIn">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-600" />

        <div className="p-6">
          <div className="flex items-center justify-between border-b border-[#f0f6f3] pb-4 mb-4">
            <h3 className="text-base font-extrabold text-slate-800">
              {crudMode === 'ADD' ? '➕ Khai báo thêm Tour mới' : '✏️ Chỉnh sửa hồ sơ Tour'}
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Tiêu đề / Tên Tour
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Tour Du Lịch Đà Lạt - Thành Phố Ngàn Hoa"
                value={crudTitle}
                onChange={(e) => setCrudTitle(e.target.value)}
                className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Điểm đến
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lâm Đồng, Việt Nam"
                  value={crudDestination}
                  onChange={(e) => setCrudDestination(e.target.value)}
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Giá tour (VND)
                </label>
                <input
                  type="number"
                  required
                  placeholder="Ví dụ: 2500000"
                  value={crudPrice}
                  onChange={(e) => setCrudPrice(e.target.value)}
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Ngày khởi hành
                </label>
                <input
                  type="date"
                  required
                  value={crudDepartureDate}
                  onChange={(e) => setCrudDepartureDate(e.target.value)}
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors cursor-pointer text-slate-650"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Tổng số vé trống
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={crudAvailableSlots}
                  onChange={(e) => setCrudAvailableSlots(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Đường dẫn ảnh bao phủ (URL Image)
              </label>
              <input
                type="url"
                placeholder="URL ảnh https://..."
                value={crudImage}
                onChange={(e) => setCrudImage(e.target.value)}
                className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Mô tả lịch trình (Text cụ thể)
              </label>
              <textarea
                rows="4"
                required
                placeholder="Chi tiết chặng đi, các điểm thăm quan, khách sạn ăn uống nghỉ ngơi..."
                value={crudItinerary}
                onChange={(e) => setCrudItinerary(e.target.value)}
                className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors resize-none"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-[#f0f6f3]">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
              >
                Bỏ qua
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all"
              >
                Lưu thông tin Tour
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
