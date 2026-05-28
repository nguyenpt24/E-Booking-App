import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[#e6eef0] pt-12 text-center text-xs text-slate-400 space-y-2">
      <div>
        © 2026 E-Tour Booking System. Cung cấp giải pháp Thương mại Điện tử cao cấp chuẩn quốc tế.
      </div>
      <div className="flex justify-center space-x-5">
        <a href="#" className="hover:text-emerald-700 transition-colors">
          Quy định chung
        </a>
        <a href="#" className="hover:text-emerald-700 transition-colors">
          Bảo mật thông tin
        </a>
        <a href="#" className="hover:text-emerald-700 transition-colors">
          Hotline 1900-ETOUR
        </a>
      </div>
    </footer>
  );
}
