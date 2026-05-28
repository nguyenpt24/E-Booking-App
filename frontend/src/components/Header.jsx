import React from 'react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const {
    token,
    username,
    role,
    activeTab,
    setActiveTab,
    currency,
    cart,
    setShowCartDrawer,
    userProfile,
    handleCurrencyChange,
    handleLogout,
    handleViewAllTours
  } = useApp();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 border-b border-[#e6eef0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo Brand */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => setActiveTab('home')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-white text-lg shadow-md shadow-emerald-600/10">
            🍀
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-800">
            E-Tour <span className="text-emerald-600 font-medium">Booking</span>
          </span>
        </div>

        {/* Navigation Options */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => setActiveTab('home')}
            className={`font-semibold text-sm transition-colors ${
              activeTab === 'home' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Trang chủ
          </button>
          <button
            onClick={handleViewAllTours}
            className={`font-semibold text-sm transition-colors ${
              activeTab === 'tours-catalog' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Danh sách Tour
          </button>
          {token && role === 'ROLE_ADMIN' && (
            <button
              onClick={() => setActiveTab('admin-dashboard')}
              className={`font-semibold text-sm transition-colors ${
                activeTab === 'admin-dashboard'
                  ? 'text-emerald-700 animate-pulse'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Dashboard Quản Trị
            </button>
          )}
        </nav>

        {/* Action Blocks (Cart & Profile Accounts) */}
        <div className="flex items-center space-x-4">
          {/* Currency conversion button */}
          <div className="flex bg-[#f0f6f3] border border-[#e2ece7] p-0.5 rounded-lg shadow-xs items-center h-[34px]">
            <button
              onClick={() => handleCurrencyChange('VND')}
              className={`text-[9px] font-extrabold px-2.5 py-1.5 rounded-md transition-all ${
                currency === 'VND'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              VND
            </button>
            <button
              onClick={() => handleCurrencyChange('USD')}
              className={`text-[9px] font-extrabold px-2.5 py-1.5 rounded-md transition-all ${
                currency === 'USD'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              USD
            </button>
          </div>

          {/* Cart Trigger Button */}
          <button
            onClick={() => setShowCartDrawer(true)}
            className="relative p-2 bg-[#eff7f4] border border-[#d6eae1] rounded-xl hover:bg-[#e3f2ec] text-slate-700 hover:text-emerald-700 transition-all h-[36px] w-[36px] flex items-center justify-center"
          >
            <span className="text-sm">🛒</span>
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white font-extrabold text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                {cart.reduce((sum, item) => sum + item.ticketsCount, 0)}
              </span>
            )}
          </button>

          {token ? (
            <div className="flex items-center space-x-3">
              <div
                onClick={() => setActiveTab('user-profile')}
                className="text-right hidden sm:block cursor-pointer group"
                title="Thông tin tài khoản"
              >
                <span className="block text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors flex items-center justify-end space-x-1">
                  <span>{username}</span>
                  <span className="text-[10px] opacity-60 group-hover:opacity-100 transition-opacity">
                    ⚙️
                  </span>
                </span>
                <span className="block text-[10px] text-emerald-600 font-semibold">
                  {role === 'ROLE_ADMIN'
                    ? 'Admin Hệ Thống'
                    : userProfile?.membershipType
                    ? `${userProfile.membershipType} Member`
                    : 'Khách Hàng'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-slate-100 hover:bg-[#fde8e8] hover:text-rose-600 border border-slate-200 hover:border-[#fbcfe8]/40 text-xs px-3 py-2 rounded-xl transition-all font-bold text-slate-650"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('login')}
                className="text-slate-600 hover:text-slate-900 text-sm px-3 py-2 font-bold transition-colors"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-xl font-bold shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all"
              >
                Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
