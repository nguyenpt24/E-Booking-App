import React from 'react';
import { useApp } from '../context/AppContext';
import TourCard from '../components/TourCard';
import PromoTourCard from '../components/PromoTourCard';

export default function HomeView({ onViewTourDetails }) {
  const {
    tours,
    loadingTours,
    fetchTours,
    searchDest,
    setSearchDest,
    searchMaxPrice,
    setSearchMaxPrice,
    searchDate,
    setSearchDate,
    setActiveTab
  } = useApp();

  const handleSearchSubmit = () => {
    fetchTours(true);
    setActiveTab('tours-catalog');
  };

  const handleClearFilters = () => {
    setSearchDest('');
    setSearchMaxPrice('');
    setSearchDate('');
    fetchTours(false);
  };

  const featuredTours = tours.slice(0, 3);
  const promoTours = tours.filter((t) => t.discountPercent > 0);

  return (
    <div>
      {/* Elegant Premium Sliding Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 shadow-md mb-6 md:mb-10 h-[380px] sm:h-[420px] flex items-center">
        {/* Infinite Marquee Background Image Slider */}
        <div className="absolute inset-0 flex overflow-hidden pointer-events-none select-none z-0">
          <div className="flex animate-marquee whitespace-nowrap h-full items-center">
            {/* Slide 1 */}
            {[
              'https://images.unsplash.com/photo-1559592481-74f4b16279f7?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
            ].map((url, i) => (
              <div key={i} className="inline-block w-[300px] sm:w-[400px] h-full relative flex-shrink-0">
                <img src={url} alt="Scenic destination" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/30 to-slate-950/50" />
              </div>
            ))}
            {/* Duplicated Slide for seamless loop */}
            {[
              'https://images.unsplash.com/photo-1559592481-74f4b16279f7?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
            ].map((url, i) => (
              <div
                key={`dup-${i}`}
                className="inline-block w-[300px] sm:w-[400px] h-full relative flex-shrink-0"
              >
                <img
                  src={url}
                  alt="Scenic destination duplicated"
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/30 to-slate-950/50" />
              </div>
            ))}
          </div>
        </div>

        {/* Glassmorphic Overlay for Text */}
        <div className="relative z-10 max-w-2xl px-6 sm:px-16 text-left">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 text-[10px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-full backdrop-blur-sm">
            🍃 Hệ thống đặt Tour Trực tuyến Hàng đầu
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-5 leading-normal sm:leading-tight">
            Tận hưởng hành trình <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Trọn vẹn & Đẳng cấp nhất
            </span>
          </h1>
          <p className="mt-4 text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg">
            E-Tour mang đến những trải nghiệm du lịch cao cấp hàng đầu Việt Nam. Tích hợp thanh toán QR
            VNPay/MoMo an toàn, phản hồi xác thực tự động và chăm sóc tận tâm.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => {
                fetchTours(true); // maintain current search parameters
                setActiveTab('tours-catalog');
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 text-center"
            >
              Xem tất cả Tour
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('featured-tours');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 text-center flex items-center justify-center space-x-2 border border-white/10 backdrop-blur-sm"
            >
              <span>Khám phá ngay</span>
              <span>↓</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Search Widget */}
      <div className="bg-white border border-[#e6eef0] p-6 rounded-3xl shadow-sm mb-12 max-w-5xl mx-auto mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Điểm đến
            </label>
            <select
              value={searchDest}
              onChange={(e) => setSearchDest(e.target.value)}
              className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-3 text-xs outline-none transition-colors cursor-pointer font-semibold text-slate-700"
            >
              <option value="">-- Tất cả địa điểm --</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Sa Pa">Sa Pa (Lào Cai)</option>
              <option value="Hà Giang">Hà Giang</option>
              <option value="Hạ Long">Vịnh Hạ Long</option>
              <option value="Ninh Bình">Ninh Bình</option>
              <option value="Quảng Bình">Quảng Bình (Phong Nha)</option>
              <option value="Huế">Huế</option>
              <option value="Đà Nẵng - Hội An">Đà Nẵng - Hội An</option>
              <option value="Quy Nhơn">Quy Nhơn (Bình Định)</option>
              <option value="Nha Trang">Nha Trang (Khánh Hòa)</option>
              <option value="Đà Lạt">Đà Lạt (Lâm Đồng)</option>
              <option value="Mũi Né">Mũi Né (Phan Thiết)</option>
              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh (Sài Gòn)</option>
              <option value="Cần Thơ">Cần Thơ (Miền Tây)</option>
              <option value="Phú Quốc">Phú Quốc (Đảo Ngọc)</option>
              <option value="Singapore & Malaysia">Singapore & Malaysia (Quốc Tế)</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Mức giá tối đa (VND)
            </label>
            <input
              type="number"
              placeholder="Ví dụ: 10000000"
              value={searchMaxPrice}
              onChange={(e) => setSearchMaxPrice(e.target.value)}
              className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-3 text-xs outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Ngày đi
            </label>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-3 text-xs outline-none transition-colors cursor-pointer text-slate-600"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end space-x-3 border-t border-[#f0f6f3] pt-4">
          <button
            onClick={handleClearFilters}
            className="bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-600 px-4 py-2.5 rounded-xl font-bold transition-all"
          >
            Xóa lọc
          </button>
          <button
            onClick={handleSearchSubmit}
            className="bg-emerald-600 hover:bg-emerald-500 text-[10px] text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-emerald-600/10 transition-all"
          >
            Tìm kiếm chuyến đi
          </button>
        </div>
      </div>

      {/* Featured Section Roster */}
      <div id="featured-tours" className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">📍 Hành trình đặc sắc nhất</h2>
            <p className="text-[11px] text-slate-400 mt-1">
              Các tour du lịch được đánh giá cao và lựa chọn nhiều nhất trong tuần.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('tours-catalog')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
          >
            <span>Xem thêm tour</span>
            <span>→</span>
          </button>
        </div>

        {/* Small grid of 3 featured items */}
        {loadingTours ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs text-slate-400">Đang đồng bộ dữ liệu...</span>
          </div>
        ) : featuredTours.length === 0 ? (
          <div className="bg-white border border-[#e6eef0] p-12 rounded-3xl text-center text-slate-400 text-xs">
            Không tìm thấy tour du lịch nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} onViewDetails={onViewTourDetails} />
            ))}
          </div>
        )}
      </div>

      {/* Tour đang ưu đãi hấp dẫn */}
      <div className="my-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">🔥 Tour Đang Ưu Đãi Hấp Dẫn</h2>
            <p className="text-[11px] text-slate-400 mt-1">
              Các tour du lịch đang giảm giá kịch sàn. Đặt ngay kẻo lỡ!
            </p>
          </div>
        </div>

        {promoTours.length === 0 ? (
          <div className="bg-white border border-[#e6eef0] p-12 rounded-3xl text-center text-slate-400 text-xs">
            Hiện chưa có chương trình ưu đãi nào diễn ra. Quý khách vui lòng quay lại sau!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promoTours.map((tour) => (
              <PromoTourCard key={tour.id} tour={tour} onViewDetails={onViewTourDetails} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
