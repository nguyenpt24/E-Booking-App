import React, { useState, useEffect } from 'react';

export default function PointsAdjustModal({ isOpen, member, onClose, onSubmit }) {
  const [adjustPointsChange, setAdjustPointsChange] = useState('');
  const [adjustReason, setAdjustReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAdjustPointsChange('');
      setAdjustReason('');
    }
  }, [isOpen]);

  if (!isOpen || !member) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      pointsChange: parseInt(adjustPointsChange),
      reason: adjustReason
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#e6eef0] w-full max-w-md rounded-3xl shadow-xl overflow-hidden relative animate-scaleIn">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-600" />

        <div className="p-6">
          <div className="flex items-center justify-between border-b border-[#f0f6f3] pb-4 mb-4">
            <h3 className="text-base font-extrabold text-slate-800">✏️ Điều chỉnh điểm thành viên</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold">
              ✕
            </button>
          </div>

          <div className="bg-[#f8faf9] border border-[#e2ece7] p-4 rounded-2xl mb-4 text-xs">
            <div>
              Thành viên: <strong>{member.fullName}</strong> (Username:{' '}
              <span className="font-mono">{member.username}</span>)
            </div>
            <div className="mt-1">
              Hạng thẻ hiện tại: <strong className="text-emerald-700">{member.membershipType}</strong>
            </div>
            <div className="mt-1">
              Số điểm khả dụng: <strong className="text-emerald-700">{member.currentPoints} pts</strong>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Số điểm thay đổi (Có thể nhập số âm hoặc dương)
              </label>
              <input
                type="number"
                required
                placeholder="Ví dụ: 500 hoặc -200"
                value={adjustPointsChange}
                onChange={(e) => setAdjustPointsChange(e.target.value)}
                className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
              />
              <p className="text-[9px] text-slate-400 mt-1">
                Lưu ý: Điểm khả dụng sau khi trừ không bao giờ âm (nhỏ nhất là 0). Tự động cập nhật
                hạng VIP.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Lý do điều chỉnh
              </label>
              <textarea
                rows="3"
                required
                placeholder="Nhập lý do điều chỉnh điểm..."
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors resize-none"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-[#f0f6f3]">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all"
              >
                Xác nhận thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
