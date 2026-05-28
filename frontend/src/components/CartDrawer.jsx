import React from 'react';
import { useApp } from '../context/AppContext';

export default function CartDrawer({ onCheckout }) {
  const {
    cart,
    showCartDrawer,
    setShowCartDrawer,
    formatPrice,
    getBookingPromoPrice,
    getBookingFinalPrice,
    updateCartCount,
    removeFromCart,
    clearCart,
    getCartTotal,
    userProfile
  } = useApp();

  if (!showCartDrawer) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-xs flex justify-end">
      <div className="bg-white border-l border-[#e6eef0] w-full max-w-md h-full shadow-2xl flex flex-col relative animate-scaleIn">
        <div className="absolute top-0 inset-x-0 h-1 bg-emerald-600" />

        <div className="p-6 border-b border-[#f0f6f3] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🛒</span>
            <h3 className="text-base font-extrabold text-slate-800">Giỏ hàng du lịch của bạn</h3>
          </div>
          <button
            onClick={() => setShowCartDrawer(false)}
            className="text-slate-400 hover:text-slate-700 font-extrabold text-lg"
          >
            ✕
          </button>
        </div>

        {/* List items inside cart */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-3 text-slate-400 text-xs">
              <span className="text-2xl">🛒</span>
              <span>Giỏ hàng của bạn đang trống! Hãy khám phá danh sách tour để thêm vé.</span>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#f8faf9] border border-[#e2ece7] p-4 rounded-2xl space-y-3 flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-800 truncate pr-4 max-w-[200px]">
                    {item.tour.title}
                  </h4>
                  <button
                    onClick={() => removeFromCart(item.tour.id)}
                    className="text-slate-400 hover:text-rose-600 text-xs"
                  >
                    Xóa
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-[#eff6f3] pt-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Đơn giá</span>
                    {item.tour.discountPercent > 0 ? (
                      <span className="font-bold text-slate-700">
                        <span className="line-through text-slate-400 mr-1.5 text-[10px]">
                          {formatPrice(item.tour.price)}
                        </span>
                        {formatPrice(getBookingPromoPrice(item.tour))}
                      </span>
                    ) : (
                      <span className="font-bold text-slate-700">{formatPrice(item.tour.price)}</span>
                    )}
                  </div>

                  {/* Ticket counts adjustments */}
                  <div className="flex items-center space-x-2 bg-white border border-[#e2ece7] rounded-lg p-1">
                    <button
                      onClick={() => updateCartCount(item.tour.id, item.ticketsCount - 1)}
                      className="px-2 py-0.5 hover:bg-slate-100 rounded text-slate-650 font-bold"
                    >
                      -
                    </button>
                    <span className="font-bold px-2">{item.ticketsCount}</span>
                    <button
                      onClick={() => updateCartCount(item.tour.id, item.ticketsCount + 1)}
                      className="px-2 py-0.5 hover:bg-slate-100 rounded text-slate-650 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Thành tiền</span>
                    <span className="font-extrabold text-rose-500">
                      {formatPrice(getBookingFinalPrice(item.tour, item.ticketsCount))}
                    </span>
                    {userProfile &&
                      item.tour.discountPercent > 0 &&
                      (userProfile.membershipType === 'SILVER' ||
                        userProfile.membershipType === 'GOLD') && (
                        <span className="text-[8px] text-emerald-600 font-bold block">
                          (Đã giảm VIP {userProfile.membershipType === 'SILVER' ? '3%' : '5%'})
                        </span>
                      )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart footer and Checkout actions */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-[#f0f6f3] bg-[#f8faf9] space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Tổng tạm tính:</span>
              <strong className="text-lg font-black text-rose-500">{formatPrice(getCartTotal())}</strong>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={clearCart}
                className="flex-1 bg-white border border-[#e2ece7] hover:bg-slate-100 text-xs font-bold py-3.5 rounded-xl text-slate-600 transition-colors"
              >
                Xóa tất cả
              </button>
              <button
                onClick={() => {
                  setShowCartDrawer(false);
                  onCheckout();
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3.5 rounded-xl shadow-md transition-colors"
              >
                Tiến hành Thanh toán
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
