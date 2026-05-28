import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import * as authService from '../services/authService';

export default function LoginView() {
  const { setToken, setUsername, setRole, triggerNotification, setActiveTab } = useApp();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usernameInput = e.target.username.value;
    const passwordInput = e.target.password.value;

    setLoading(true);
    try {
      const data = await authService.login(usernameInput, passwordInput);
      const { token, username, role } = data;

      localStorage.setItem('jwtToken', token);
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);

      setToken(token);
      setUsername(username);
      setRole(role);

      triggerNotification(`Chào mừng trở lại, ${username}!`);

      if (role === 'ROLE_ADMIN') {
        setActiveTab('admin-dashboard');
      } else {
        setActiveTab('home');
      }
    } catch (err) {
      console.error(err);
      triggerNotification(err.response?.data?.message || 'Lỗi xác thực thông tin!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white border border-[#e6eef0] p-8 rounded-3xl shadow-sm relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-500" />
      <h2 className="text-xl font-extrabold text-slate-800 text-center">Đăng nhập tài khoản</h2>
      <p className="text-slate-400 text-[11px] text-center mt-2">
        Đăng nhập để cập nhật giỏ hàng và xem lịch trình các chuyến đi
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Tên đăng nhập
          </label>
          <input
            type="text"
            name="username"
            required
            placeholder="Nhập tên đăng nhập"
            className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-3 text-xs outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Mật khẩu
          </label>
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-3 text-xs outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-xs font-bold text-white py-3.5 rounded-xl shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all mt-4"
        >
          {loading ? 'Đang xác thực...' : 'Xác nhận Đăng nhập'}
        </button>
      </form>

      <div className="text-center text-[11px] text-slate-400 mt-6">
        Bạn chưa có tài khoản thành viên?{' '}
        <button
          onClick={() => setActiveTab('register')}
          className="text-emerald-600 font-bold hover:underline"
        >
          Đăng ký tài khoản mới
        </button>
      </div>
    </div>
  );
}
