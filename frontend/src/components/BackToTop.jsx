import React, { useState, useEffect } from 'react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down 300px
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top scroll
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed right-6 z-40 w-11 h-11 rounded-full bg-white hover:bg-emerald-50 border border-slate-250 border-slate-200 hover:border-emerald-300/40 text-emerald-700 flex items-center justify-center shadow-lg transition-all duration-500 transform hover:scale-105 active:scale-95 group ${
        isVisible
          ? 'opacity-100 translate-y-0 bottom-24 scale-100'
          : 'opacity-0 translate-y-6 bottom-20 scale-90 pointer-events-none'
      }`}
    >
      {/* Upward Arrow Icon */}
      <span className="text-base font-extrabold transform group-hover:-translate-y-1 transition-transform duration-300">
        ↑
      </span>

      {/* Tooltip */}
      <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-slate-900/95 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md border border-slate-800">
        Cuộn lên đầu trang
        {/* Tooltip Arrow pointing right */}
        <span className="absolute top-1/2 -translate-y-1/2 left-full border-4 border-transparent border-l-slate-900" />
      </span>
    </button>
  );
}
