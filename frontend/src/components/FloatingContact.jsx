import React, { useState } from 'react';

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      id: 'hotline',
      name: 'Hotline',
      icon: '📞',
      color: 'bg-rose-500 hover:bg-rose-400',
      tooltip: '1900-ETOUR',
      link: 'tel:19003868'
    },
    {
      id: 'zalo',
      name: 'Zalo Chat',
      icon: '💬',
      color: 'bg-sky-500 hover:bg-sky-400',
      tooltip: 'Zalo: 0999.999.999',
      link: 'https://zalo.me/0999999999'
    },
    {
      id: 'messenger',
      name: 'Messenger',
      icon: '⚡',
      color: 'bg-blue-600 hover:bg-blue-500',
      tooltip: 'Facebook Messenger',
      link: 'https://m.me/etourbooking'
    },
    {
      id: 'email',
      name: 'Email Support',
      icon: '✉️',
      color: 'bg-amber-500 hover:bg-amber-400',
      tooltip: 'admin@etour.com',
      link: 'mailto:admin@etour.com'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-3 select-none">
      {/* Expanded contact options sliding leftwards */}
      <div
        className={`flex items-center space-x-3 transition-all duration-500 ease-out origin-right ${
          isOpen ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-90 pointer-events-none'
        }`}
      >
        {contactOptions.map((opt) => (
          <a
            key={opt.id}
            href={opt.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative w-11 h-11 ${opt.color} text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95`}
          >
            <span className="text-lg">{opt.icon}</span>

            {/* Premium Tooltip */}
            <span className="absolute bottom-14 bg-slate-900/95 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md border border-slate-800">
              {opt.tooltip}
              {/* Tooltip Arrow */}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
            </span>
          </a>
        ))}
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 flex items-center justify-center shadow-lg hover:shadow-emerald-600/25 transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 border-white/20`}
      >
        {/* Toggle Icon with Rotation */}
        <span
          className={`text-xl transition-transform duration-500 ${
            isOpen ? 'rotate-135' : 'rotate-0'
          }`}
        >
          {isOpen ? '✕' : '💬'}
        </span>

        {/* Pulsing glow ring when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full border border-emerald-500 animate-ping opacity-70 pointer-events-none" />
        )}

        {/* Tooltip */}
        <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900/95 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md border border-slate-800">
          {isOpen ? 'Đóng liên hệ' : 'Liên hệ hỗ trợ'}
          {/* Tooltip Arrow pointing right */}
          <span className="absolute top-1/2 -translate-y-1/2 left-full border-4 border-transparent border-l-slate-900" />
        </span>
      </button>
    </div>
  );
}
