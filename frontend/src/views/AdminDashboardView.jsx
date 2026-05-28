import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import * as bookingService from '../services/bookingService';
import * as adminService from '../services/adminService';
import * as tourService from '../services/tourService';

export default function AdminDashboardView({
  onAddTour,
  onEditTour,
  onAdjustPoints,
  onViewHistory
}) {
  const {
    role,
    triggerNotification,
    formatPrice,
    fetchTours,
    tours,
    systemConfig,
    fetchConfig
  } = useApp();

  const [adminBookings, setAdminBookings] = useState([]);
  const [adminRevenueReports, setAdminRevenueReports] = useState([]);
  const [adminMembers, setAdminMembers] = useState([]);
  const [loadingAdminData, setLoadingAdminData] = useState(false);
  const [adminTab, setAdminTab] = useState('bookings'); // 'bookings' | 'members' | 'config'

  // Config Form States
  const [pointRatio, setPointRatio] = useState(100000);
  const [silverThreshold, setSilverThreshold] = useState(1000);
  const [silverDiscount, setSilverDiscount] = useState(3.0);
  const [goldThreshold, setGoldThreshold] = useState(5000);
  const [goldDiscount, setGoldDiscount] = useState(5.0);
  const [savingConfig, setSavingConfig] = useState(false);

  useEffect(() => {
    if (systemConfig) {
      setPointRatio(systemConfig.pointRatio || 100000);
      setSilverThreshold(systemConfig.silverThreshold || 1000);
      setSilverDiscount(systemConfig.silverDiscount || 3.0);
      setGoldThreshold(systemConfig.goldThreshold || 5000);
      setGoldDiscount(systemConfig.goldDiscount || 5.0);
    }
  }, [systemConfig, adminTab]);

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    if (pointRatio <= 0 || silverThreshold <= 0 || goldThreshold <= 0) {
      triggerNotification('Tất cả ngưỡng điểm và tỷ lệ quy đổi phải lớn hơn 0!', 'error');
      return;
    }
    if (silverThreshold >= goldThreshold) {
      triggerNotification('Ngưỡng điểm thăng hạng SILVER phải nhỏ hơn hạng GOLD!', 'error');
      return;
    }
    if (silverDiscount < 0 || silverDiscount > 100 || goldDiscount < 0 || goldDiscount > 100) {
      triggerNotification('Tỷ lệ giảm giá phải nằm trong khoảng từ 0% đến 100%!', 'error');
      return;
    }
    if (silverDiscount >= goldDiscount) {
      triggerNotification('Tỷ lệ giảm giá hạng SILVER phải nhỏ hơn hạng GOLD!', 'error');
      return;
    }

    setSavingConfig(true);
    try {
      await adminService.updateSystemConfig({
        pointRatio,
        silverThreshold,
        silverDiscount,
        goldThreshold,
        goldDiscount
      });
      triggerNotification('Cập nhật cấu hình hệ thống thành công!');
      await fetchConfig();
    } catch (err) {
      console.error(err);
      triggerNotification(
        err.response?.data?.message || 'Không thể cập nhật cấu hình hệ thống!',
        'error'
      );
    } finally {
      setSavingConfig(false);
    }
  };

  const fetchAdminData = async () => {
    if (role !== 'ROLE_ADMIN') return;
    setLoadingAdminData(true);
    try {
      const bookingsData = await bookingService.getBookings();
      setAdminBookings(bookingsData);

      const reportsData = await bookingService.getRevenueReport();
      setAdminRevenueReports(reportsData);

      const membersData = await adminService.getMembers();
      setAdminMembers(membersData);
    } catch (err) {
      console.error(err);
      triggerNotification(
        err.response?.data?.message || 'Không thể đồng bộ dữ liệu quản trị!',
        'error'
      );
    } finally {
      setLoadingAdminData(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [role]);

  const handleApproveBooking = async (id) => {
    try {
      await bookingService.approveBooking(id);
      triggerNotification('Duyệt đơn thanh toán thành công! Đã gửi hóa đơn qua email.');
      fetchAdminData();
      fetchTours();
    } catch (err) {
      console.error(err);
      triggerNotification(err.response?.data?.message || 'Không thể duyệt đơn hàng!', 'error');
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này? Chỗ trống sẽ được hoàn trả.'))
      return;
    try {
      await bookingService.cancelBooking(id);
      triggerNotification('Đã hủy đơn hàng và hoàn trả chỗ trống thành công!');
      fetchAdminData();
      fetchTours();
    } catch (err) {
      console.error(err);
      triggerNotification(err.response?.data?.message || 'Không thể hủy đơn hàng!', 'error');
    }
  };

  const handleSoftDeleteTour = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tour du lịch này?')) return;
    try {
      await tourService.deleteTour(id);
      triggerNotification('Đã ẩn (xóa mềm) tour du lịch thành công!');
      fetchTours();
      fetchAdminData();
    } catch (err) {
      console.error(err);
      triggerNotification(err.response?.data?.message || 'Lỗi khi xóa tour!', 'error');
    }
  };

  if (role !== 'ROLE_ADMIN') {
    return (
      <div className="bg-rose-50 border border-rose-200 p-8 rounded-2xl text-center text-rose-600 my-10 max-w-lg mx-auto">
        🛑 <strong>Yêu cầu xác thực Quản Trị!</strong> <br />
        Bạn cần đăng ký hoặc đăng nhập với đặc quyền Admin để sử dụng bảng CRM này.
      </div>
    );
  }

  return (
    <div>
      {/* Admin Header Board */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e6eef0] pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Bảng Điều Khiển Quản Trị CRM</h1>
          <p className="text-[11px] text-slate-400 mt-1">
            Tổng hợp doanh thu, quản lý danh mục và xét duyệt hóa đơn email cho khách hàng.
          </p>
        </div>
        <button
          onClick={onAddTour}
          className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white px-5 py-3 rounded-xl shadow-md transition-all self-start flex items-center space-x-2"
        >
          <span>➕ Thêm Tour Mới</span>
        </button>
      </div>

      {/* Admin Sub Tab switcher bar */}
      <div className="flex space-x-3 mb-8 border-b border-[#eff6f3] pb-4">
        <button
          onClick={() => setAdminTab('bookings')}
          className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
            adminTab === 'bookings'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/10'
              : 'bg-slate-100 text-[#555a58] text-slate-500 hover:text-slate-800'
          }`}
        >
          📊 Đơn hàng & Thống kê
        </button>
        <button
          onClick={() => setAdminTab('members')}
          className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
            adminTab === 'members'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/10'
              : 'bg-slate-100 text-[#555a58] text-slate-500 hover:text-slate-800'
          }`}
        >
          👥 Quản lý Thành viên (VIP)
        </button>
        <button
          onClick={() => setAdminTab('config')}
          className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
            adminTab === 'config'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/10'
              : 'bg-slate-100 text-[#555a58] text-slate-500 hover:text-slate-800'
          }`}
        >
          ⚙️ Cấu hình hệ thống
        </button>
      </div>

      {loadingAdminData ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-xs text-slate-400">Đang đồng bộ dữ liệu quản trị...</span>
        </div>
      ) : adminTab === 'bookings' ? (
        <>
          {/* Aggregated indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white border border-[#e6eef0] p-6 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Tổng doanh thu thực nhận
              </span>
              <span className="text-2xl font-black text-emerald-600 mt-2 block">
                {new Intl.NumberFormat('vi-VN').format(
                  adminBookings
                    .filter((b) => b.status === 'PAID')
                    .reduce((sum, b) => sum + b.totalPrice, 0)
                )}{' '}
                <span className="text-xs font-normal text-slate-400">VND</span>
              </span>
              <span className="text-[10px] text-slate-400 block mt-2">
                Dựa trên các đơn đặt trạng thái PAID
              </span>
            </div>

            <div className="bg-white border border-[#e6eef0] p-6 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Hóa đơn đã thanh toán
              </span>
              <span className="text-2xl font-black text-slate-800 mt-2 block">
                {adminBookings.filter((b) => b.status === 'PAID').length}{' '}
                <span className="text-xs font-normal text-slate-400">đơn</span>
              </span>
              <span className="text-[10px] text-slate-400 block mt-2">
                Hệ thống đã tự động gửi vé qua Email
              </span>
            </div>

            <div className="bg-white border border-[#e6eef0] p-6 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Hóa đơn đang chờ duyệt (PENDING)
              </span>
              <span className="text-2xl font-black text-amber-600 mt-2 block">
                {adminBookings.filter((b) => b.status === 'PENDING').length}{' '}
                <span className="text-xs font-normal text-slate-400">đơn</span>
              </span>
              <span className="text-[10px] text-amber-600 block mt-2 font-medium animate-pulse">
                Quét hủy sau 15 phút không thanh toán
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Analytics & Orders */}
            <div className="lg:col-span-2 space-y-8">
              {/* Dynamic Bar Revenue statistics */}
              <div className="bg-white border border-[#e6eef0] p-6 rounded-3xl shadow-sm">
                <h2 className="text-sm font-bold text-slate-800 mb-4">
                  📊 Báo cáo doanh số tour bán chạy nhất
                </h2>

                {adminRevenueReports.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    Chưa có dữ liệu thanh toán để thống kê.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {adminRevenueReports.map((report, idx) => {
                      const maxVal = Math.max(...adminRevenueReports.map((r) => r.revenue), 1);
                      const percent = (report.revenue / maxVal) * 100;
                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-700 truncate max-w-xs">{report.tourTitle}</span>
                            <span className="text-emerald-700 font-extrabold">
                              {new Intl.NumberFormat('vi-VN').format(report.revenue)} đ{' '}
                              <span className="text-slate-400 text-[10px] font-normal">
                                ({report.bookingsCount} lượt mua)
                              </span>
                            </span>
                          </div>
                          <div className="w-full bg-[#f0f6f3] h-4 rounded-full overflow-hidden border border-[#e2ece7]">
                            <div
                              className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-1000"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Admin Bookings Table */}
              <div className="bg-white border border-[#e6eef0] p-6 rounded-3xl shadow-sm overflow-hidden">
                <h2 className="text-sm font-bold text-slate-800 mb-4">
                  📋 Lịch sử và trạng thái các đơn đặt vé
                </h2>

                {adminBookings.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    Không có hóa đơn đăng ký.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#e6eef0] text-slate-400 uppercase tracking-wider font-bold">
                          <th className="py-3 px-3">Đơn</th>
                          <th className="py-3 px-3">Khách hàng</th>
                          <th className="py-3 px-3">Tour du lịch</th>
                          <th className="py-3 px-3">Vé mua</th>
                          <th className="py-3 px-3">Tổng tiền</th>
                          <th className="py-3 px-3">Trạng thái</th>
                          <th className="py-3 px-3 text-right">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminBookings.map((b) => (
                          <tr
                            key={b.id}
                            className="border-b border-[#f0f6f3] hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="py-3.5 px-3 font-mono font-bold text-slate-800">#{b.id}</td>
                            <td className="py-3.5 px-3">
                              <div className="font-bold text-slate-800">{b.customerName}</div>
                              <div className="text-[10px] text-slate-400">
                                {b.customerEmail} | {b.customerPhone}
                              </div>
                            </td>
                            <td className="py-3.5 px-3 max-w-[130px] truncate font-semibold">
                              {b.tourTitle}
                            </td>
                            <td className="py-3.5 px-3 font-bold">{b.ticketsCount} vé</td>
                            <td className="py-3.5 px-3 text-rose-500 font-extrabold">
                              {formatPrice(b.totalPrice)}
                            </td>
                            <td className="py-3.5 px-3">
                              {b.status === 'PAID' && (
                                <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-bold">
                                  Đã thanh toán
                                </span>
                              )}
                              {b.status === 'PENDING' && (
                                <span className="bg-amber-50 border border-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                                  Chờ thanh toán
                                </span>
                              )}
                              {b.status === 'CANCELLED' && (
                                <span className="bg-slate-100 border border-slate-200 text-slate-400 text-[9px] px-2 py-0.5 rounded-full font-bold">
                                  Đã hủy
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-3 text-right">
                              {b.status === 'PENDING' && (
                                <div className="flex space-x-1 justify-end">
                                  <button
                                    onClick={() => handleApproveBooking(b.id)}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg"
                                  >
                                    Duyệt
                                  </button>
                                  <button
                                    onClick={() => handleCancelBooking(b.id)}
                                    className="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-lg"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              )}
                              {b.status === 'PAID' && (
                                <button
                                  onClick={() => handleCancelBooking(b.id)}
                                  className="text-[10px] text-slate-400 hover:text-rose-600 font-bold"
                                >
                                  Hủy đơn
                                </button>
                              )}
                              {b.status === 'CANCELLED' && (
                                <span className="text-[10px] text-slate-400 italic">Đã hủy bỏ</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Tours list for CRUD editing */}
            <div className="space-y-8">
              <div className="bg-white border border-[#e6eef0] p-6 rounded-3xl shadow-sm">
                <h2 className="text-sm font-bold text-slate-800 mb-4">🌍 Kho dữ liệu Tour hiện hoạt</h2>

                <div className="space-y-4">
                  {tours.map((t) => (
                    <div
                      key={t.id}
                      className="bg-[#f8faf9] border border-[#e2ece7] p-4 rounded-2xl space-y-3"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={t.image}
                          alt={t.title}
                          className="w-12 h-12 object-cover rounded-lg border border-[#e2ece7]"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-bold text-slate-800 truncate">{t.title}</h3>
                          <span className="text-[10px] text-slate-400 mt-1 block">📍 {t.destination}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] border-t border-[#eff6f3] pt-2">
                        <span className="text-slate-550 text-slate-500 font-medium">
                          Chỗ trống: <strong className="text-slate-700">{t.availableSlots}</strong>
                        </span>
                        <span className="text-rose-500 font-extrabold">{formatPrice(t.price)}</span>
                      </div>

                      <div className="flex space-x-2 pt-1">
                        <button
                          onClick={() => onEditTour(t)}
                          className="flex-1 bg-white hover:bg-slate-100 text-slate-600 text-[10px] font-bold py-1.5 rounded-lg border border-[#e2ece7] transition-all"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleSoftDeleteTour(t.id)}
                          className="flex-1 bg-[#fff5f5] hover:bg-[#ffebeb] text-rose-600 text-[10px] font-bold py-1.5 rounded-lg border border-[#ffd6d6] transition-all"
                        >
                          🗑️ Xóa mềm
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : adminTab === 'members' ? (
        <div className="bg-white border border-[#e6eef0] p-6 rounded-3xl shadow-sm overflow-hidden animate-scaleIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#f0f6f3]">
            <div>
              <h2 className="text-sm font-bold text-slate-800">👥 Danh sách Thành viên & Thẻ VIP</h2>
              <p className="text-[11px] text-slate-400 mt-1">
                Danh sách thành viên đăng ký ứng dụng, tích lũy điểm và hưởng ưu đãi VIP.
              </p>
            </div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold text-[10px] px-3 py-1.5 rounded-full">
              Tổng số: {adminMembers.length} thành viên
            </span>
          </div>

          {adminMembers.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">Không có thành viên đăng ký.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#e6eef0] text-slate-400 uppercase tracking-wider font-bold">
                    <th className="py-3 px-3">Họ và tên</th>
                    <th className="py-3 px-3">Tên đăng nhập</th>
                    <th className="py-3 px-3">Hạng thẻ</th>
                    <th className="py-3 px-3">Điểm hiện tại</th>
                    <th className="py-3 px-3">Điểm tích lũy</th>
                    <th className="py-3 px-3">Số Tour đi</th>
                    <th className="py-3 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {adminMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-[#f0f6f3] hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-800">{member.fullName || 'Chưa cập nhật'}</div>
                        <div className="text-[10px] text-slate-400">
                          {member.email} | {member.phoneNumber || 'Chưa có SĐT'}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-650">{member.username}</td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            member.membershipType === 'GOLD'
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm'
                              : member.membershipType === 'SILVER'
                              ? 'bg-slate-50 text-slate-700 border-slate-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {member.membershipType}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-extrabold text-slate-800">
                        {member.currentPoints} pts
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-500">
                        {member.totalPointsAccumulated} pts
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-500">
                        {member.totalToursParticipated} tours
                      </td>
                      <td className="py-3.5 px-3 text-right space-x-2">
                        <button
                          onClick={() => onAdjustPoints(member)}
                          className="bg-[#f0f6f3] hover:bg-[#e2ece7] text-emerald-700 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all"
                        >
                          ✏️ Sửa điểm
                        </button>
                        <button
                          onClick={() => onViewHistory(member)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all"
                        >
                          📜 Lịch sử
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-[#e6eef0] p-8 rounded-3xl shadow-sm max-w-2xl mx-auto animate-scaleIn relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-500" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#f0f6f3]">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                ⚙️ Cấu Hình Điểm & Thăng Hạng VIP
              </h2>
              <p className="text-[11px] text-slate-400 mt-1">
                Điều chỉnh tỷ lệ đổi điểm thưởng và điều kiện ưu đãi thăng hạng thành viên.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-6">
            {/* Section 1: Tỷ lệ đổi điểm */}
            <div className="bg-[#f8faf9] border border-[#e2ece7] p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                💰 1. Cơ chế tích lũy điểm
              </h3>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Tỷ lệ quy đổi điểm (VND chi tiêu cho 1 điểm)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    value={pointRatio}
                    onChange={(e) => setPointRatio(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-[#e2ece7] focus:border-emerald-500 rounded-xl pl-4 pr-16 py-2.5 text-xs outline-none transition-colors font-bold text-slate-800"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 font-mono">
                    VND / pt
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1.5 block">
                  Ví dụ: <strong>{new Intl.NumberFormat('vi-VN').format(pointRatio)} đ</strong> chi tiêu = tích lũy <strong>1 điểm (pt)</strong>.
                </span>
              </div>
            </div>

            {/* Section 2: Hạng Bạc (SILVER) */}
            <div className="bg-[#f8faf9] border border-[#e2ece7] p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                🥈 2. Hạng Bạc (SILVER)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Ngưỡng điểm thăng hạng (pts)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={silverThreshold}
                    onChange={(e) => setSilverThreshold(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Tỷ lệ giảm giá trực tiếp (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      step="0.1"
                      value={silverDiscount}
                      onChange={(e) => setSilverDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-[#e2ece7] focus:border-emerald-500 rounded-xl pl-4 pr-10 py-2.5 text-xs outline-none transition-colors font-bold text-slate-800"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 font-mono">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Hạng Vàng (GOLD) */}
            <div className="bg-[#f8faf9] border border-[#e2ece7] p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                🥇 3. Hạng Vàng (GOLD)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Ngưỡng điểm thăng hạng (pts)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={goldThreshold}
                    onChange={(e) => setGoldThreshold(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Tỷ lệ giảm giá trực tiếp (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      step="0.1"
                      value={goldDiscount}
                      onChange={(e) => setGoldDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-[#e2ece7] focus:border-emerald-500 rounded-xl pl-4 pr-10 py-2.5 text-xs outline-none transition-colors font-bold text-slate-800"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 font-mono">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex space-x-3 pt-4 border-t border-[#f0f6f3]">
              <button
                type="button"
                onClick={() => setAdminTab('bookings')}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 py-3.5 rounded-xl transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={savingConfig}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-[#a7d3c0] text-xs font-bold text-white py-3.5 rounded-xl shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all"
              >
                {savingConfig ? 'Đang cập nhật...' : '💾 Lưu cấu hình hệ thống'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
