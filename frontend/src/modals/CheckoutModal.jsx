import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function CheckoutModal({ isOpen, onClose, onSubmitCheckout }) {
  const { cart, formatPrice, getBookingFinalPrice, userProfile } = useApp();

  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState('VNPAY');

  useEffect(() => {
    if (userProfile && isOpen) {
      setCheckoutName(userProfile.fullName || '');
      setCheckoutEmail(userProfile.email || '');
      setCheckoutPhone(userProfile.phoneNumber || '');
    }
  }, [userProfile, isOpen]);

  if (!isOpen || cart.length === 0) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitCheckout({
      checkoutName,
      checkoutEmail,
      checkoutPhone,
      checkoutPaymentMethod
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#e6eef0] w-full max-w-lg rounded-3xl shadow-xl overflow-hidden relative animate-scaleIn">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-600" />

        <div className="p-6">
          <div className="flex items-center justify-between border-b border-[#f0f6f3] pb-4 mb-4">
            <h3 className="text-base font-extrabold text-slate-800">Thông tin liên hệ nhận Vé Tour</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold">
              ✕
            </button>
          </div>

          {/* Checkout details summary preview */}
          <div className="bg-[#f8faf9] border border-[#e2ece7] p-4 rounded-2xl mb-4 space-y-2 text-xs">
            <div className="font-bold text-slate-700">🛒 Tour đang đăng ký thanh toán:</div>
            <div className="flex justify-between">
              <span className="text-slate-500 truncate max-w-[250px]">{cart[0].tour.title}</span>
              <strong className="text-slate-800">{cart[0].ticketsCount} vé</strong>
            </div>
            <div className="flex justify-between border-t border-[#eff6f3] pt-2 font-bold text-rose-500">
              <span>Tổng tiền thanh toán:</span>
              <span>{formatPrice(getBookingFinalPrice(cart[0].tour, cart[0].ticketsCount))}</span>
            </div>
            {userProfile &&
              cart[0].tour.discountPercent > 0 &&
              (userProfile.membershipType === 'SILVER' || userProfile.membershipType === 'GOLD') && (
                <div className="flex justify-between text-[10px] text-emerald-600 font-bold">
                  <span>Quyền lợi giảm VIP {userProfile.membershipType}:</span>
                  <span>-{userProfile.membershipType === 'SILVER' ? '3%' : '5%'}</span>
                </div>
              )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Họ và tên của bạn
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={checkoutName}
                  onChange={(e) => setCheckoutName(e.target.value)}
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Số điện thoại liên hệ
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0987654321"
                  value={checkoutPhone}
                  onChange={(e) => setCheckoutPhone(e.target.value)}
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Địa chỉ Email (Để hệ thống tự động gửi vé/hóa đơn)
              </label>
              <input
                type="email"
                required
                placeholder="yourname@gmail.com"
                value={checkoutEmail}
                onChange={(e) => setCheckoutEmail(e.target.value)}
                className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Kênh thanh toán muốn dùng
              </label>
              <select
                value={checkoutPaymentMethod}
                onChange={(e) => setCheckoutPaymentMethod(e.target.value)}
                className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors cursor-pointer text-slate-600 font-semibold"
              >
                <option value="VNPAY">Quét cổng VNPay QR giả lập</option>
                <option value="MOMO">Quét ví điện tử MoMo giả lập</option>
                <option value="CASH">Thanh toán tiền mặt tại văn phòng</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-[#f0f6f3]">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
              >
                Bỏ qua
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors"
              >
                Xác nhận và đặt vé
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
