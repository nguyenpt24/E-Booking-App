import React from 'react';
import { useApp } from '../context/AppContext';

export default function PaymentSimulatorModal({
  isOpen,
  activeInvoice,
  mockPaymentUrl,
  onConfirm,
  onClose
}) {
  const { formatPrice } = useApp();

  if (!isOpen || !activeInvoice) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#e6eef0] w-full max-w-md rounded-3xl shadow-xl overflow-hidden relative animate-scaleIn">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-500" />

        <div className="p-6 text-center">
          <h3 className="text-base font-extrabold text-slate-800">Thanh toán vé du lịch (Cổng giả lập)</h3>
          <p className="text-slate-400 text-[11px] mt-1">
            Chụp hình hoặc quét mã chuyển khoản QR của {activeInvoice.paymentMethod}
          </p>

          {/* QR display simulation */}
          <div className="my-5 flex justify-center">
            <div className="bg-white p-3 rounded-2xl border border-[#e2ece7] shadow-md">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  mockPaymentUrl
                )}`}
                alt="Simulated Pay QR"
                className="w-44 h-44 rounded-lg"
              />
            </div>
          </div>

          {/* Reservation card metadata */}
          <div className="bg-[#f8faf9] border border-[#e2ece7] p-4 rounded-2xl text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-550 text-slate-500">Mã đơn đặt vé:</span>
              <strong className="text-emerald-700">#{activeInvoice.id}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-550 text-slate-500">Người đại diện:</span>
              <strong className="text-slate-800">{activeInvoice.customerName}</strong>
            </div>
            <div className="flex justify-between border-t border-[#eff6f3] pt-2">
              <span className="text-slate-500 font-bold">Tổng số tiền cần quét:</span>
              <strong className="text-rose-500 font-black text-sm">
                {formatPrice(activeInvoice.totalPrice)}
              </strong>
            </div>
            <div className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 p-2.5 rounded-xl text-center leading-relaxed mt-2 animate-pulse">
              ⚠️ Lưu ý: Quá 15 phút không hoàn tất chuyển tiền, hệ thống Scheduler sẽ tự động hủy đơn
              giữ chỗ này!
            </div>
          </div>

          <div className="mt-6 flex flex-col space-y-2">
            <button
              onClick={() => onConfirm(activeInvoice.id)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white py-3 rounded-xl shadow-md transition-all"
            >
              Xác nhận tôi đã chuyển khoản thành công
            </button>
            <button
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 py-3 rounded-xl transition-all"
            >
              Thanh toán sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
