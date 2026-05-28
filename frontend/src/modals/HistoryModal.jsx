import React from 'react';

export default function HistoryModal({ isOpen, history, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#e6eef0] w-full max-w-md rounded-3xl shadow-xl overflow-hidden relative animate-scaleIn">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-600" />

        <div className="p-6">
          <div className="flex items-center justify-between border-b border-[#f0f6f3] pb-4 mb-4">
            <h3 className="text-base font-extrabold text-slate-800">📜 Lịch sử thay đổi điểm (Audit Log)</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold">
              ✕
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3">
            {history.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Thành viên chưa có lịch sử biến động điểm.
              </div>
            ) : (
              history.map((log) => (
                <div
                  key={log.id}
                  className="bg-[#f8faf9] border border-[#e2ece7] p-3.5 rounded-2xl flex justify-between items-start text-xs animate-scaleIn"
                >
                  <div className="space-y-1 pr-4 text-left">
                    <div className="font-bold text-slate-700">{log.reason}</div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(log.createdAt).toLocaleString('vi-VN')}
                    </div>
                  </div>
                  <span
                    className={`font-black text-sm px-2 py-0.5 rounded-lg flex-shrink-0 ${
                      log.pointsChange > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {log.pointsChange > 0 ? `+${log.pointsChange}` : log.pointsChange} pts
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-[#f0f6f3] mt-4">
            <button
              onClick={onClose}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-md"
            >
              Đóng lịch sử
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
