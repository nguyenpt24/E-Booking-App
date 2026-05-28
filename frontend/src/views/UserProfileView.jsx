import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import * as userService from '../services/userService';

export default function UserProfileView() {
  const {
    username,
    userProfile,
    profileLoading,
    fetchUserProfile,
    triggerNotification,
    setActiveTab
  } = useApp();

  const [profileEmail, setProfileEmail] = useState('');
  const [profileFullName, setProfileFullName] = useState('');
  const [profilePhoneNumber, setProfilePhoneNumber] = useState('');
  const [profileGender, setProfileGender] = useState('Nam');
  const [profileBirthDate, setProfileBirthDate] = useState('');
  const [profileCccd, setProfileCccd] = useState('');
  const [profileCccdIssueDate, setProfileCccdIssueDate] = useState('');
  const [profileCccdIssuePlace, setProfileCccdIssuePlace] = useState('');
  const [profilePassport, setProfilePassport] = useState('');
  const [profilePassportIssueDate, setProfilePassportIssueDate] = useState('');
  const [profilePassportExpiryDate, setProfilePassportExpiryDate] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileNationality, setProfileNationality] = useState('Việt Nam');

  const [profileOldPassword, setProfileOldPassword] = useState('');
  const [profileNewPassword, setProfileNewPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setProfileEmail(userProfile.email || '');
      setProfileFullName(userProfile.fullName || '');
      setProfilePhoneNumber(userProfile.phoneNumber || '');
      setProfileGender(userProfile.gender || 'Nam');
      setProfileBirthDate(userProfile.birthDate || '');
      setProfileCccd(userProfile.cccd || '');
      setProfileCccdIssueDate(userProfile.cccdIssueDate || '');
      setProfileCccdIssuePlace(userProfile.cccdIssuePlace || '');
      setProfilePassport(userProfile.passport || '');
      setProfilePassportIssueDate(userProfile.passportIssueDate || '');
      setProfilePassportExpiryDate(userProfile.passportExpiryDate || '');
      setProfileAddress(userProfile.address || '');
      setProfileNationality(userProfile.nationality || 'Việt Nam');
    }
  }, [userProfile]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileOldPassword) {
      triggerNotification('Vui lòng nhập mật khẩu hiện tại để xác thực!', 'error');
      return;
    }
    setUpdating(true);
    try {
      const payload = {
        email: profileEmail,
        fullName: profileFullName,
        phoneNumber: profilePhoneNumber,
        gender: profileGender,
        birthDate: profileBirthDate || null,
        cccd: profileCccd || null,
        cccdIssueDate: profileCccdIssueDate || null,
        cccdIssuePlace: profileCccdIssuePlace || null,
        passport: profilePassport || null,
        passportIssueDate: profilePassportIssueDate || null,
        passportExpiryDate: profilePassportExpiryDate || null,
        address: profileAddress || null,
        nationality: profileNationality || null,
        oldPassword: profileOldPassword,
        newPassword: profileNewPassword
      };
      const res = await userService.updateUserProfile(payload);
      triggerNotification(res.message || 'Cập nhật tài khoản thành công!');
      setProfileOldPassword('');
      setProfileNewPassword('');
      fetchUserProfile();
      setActiveTab('home');
    } catch (err) {
      console.error(err);
      triggerNotification(err.response?.data?.message || 'Cập nhật tài khoản thất bại!', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 bg-white border border-[#e6eef0] p-8 rounded-3xl shadow-sm relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-500" />

      {/* VIP Membership Card Display */}
      {userProfile && (
        <div
          className={`relative rounded-3xl overflow-hidden shadow-xl p-6 text-white mb-8 border border-white/10 ${
            userProfile.membershipType === 'GOLD'
              ? 'bg-gradient-to-br from-yellow-600 via-amber-500 to-yellow-500 shadow-yellow-600/20'
              : userProfile.membershipType === 'SILVER'
              ? 'bg-gradient-to-br from-slate-600 via-slate-500 to-slate-400 shadow-slate-500/15'
              : 'bg-gradient-to-br from-amber-900 to-amber-700 shadow-amber-950/10'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-xs">
                🍀 E-TOUR VIP MEMBER CARD
              </span>
              <h3 className="text-xl font-black tracking-wide mt-3">{userProfile.fullName}</h3>
              <p className="text-[11px] opacity-75 mt-0.5">Mã thành viên: #{username}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black block tracking-widest">{userProfile.membershipType}</span>
              <span className="text-[9px] uppercase tracking-wider opacity-85 block mt-1">Hạng thành viên</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-5 mt-6 text-center">
            <div>
              <span className="text-[9px] uppercase tracking-wider block opacity-75">Tour đã đi</span>
              <strong className="text-base font-black block mt-1">
                {userProfile.totalToursParticipated} chuyến
              </strong>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider block opacity-75">Tích lũy lịch sử</span>
              <strong className="text-base font-black block mt-1">
                {userProfile.totalPointsAccumulated} pts
              </strong>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider block opacity-75">Điểm khả dụng</span>
              <strong className="text-base font-black block mt-1">{userProfile.currentPoints} pts</strong>
            </div>
          </div>

          {/* Progress bar to next level */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-[10px] font-bold">
              <span>
                Hạng tiếp theo:{' '}
                {userProfile.membershipType === 'GOLD'
                  ? 'CẤP ĐỘ CAO NHẤT'
                  : userProfile.membershipType === 'SILVER'
                  ? 'GOLD (5,000 pts)'
                  : 'SILVER (1,000 pts)'}
              </span>
              <span>
                {userProfile.membershipType === 'GOLD'
                  ? 'Đã đạt VIP tối đa'
                  : `Cần thêm ${userProfile.pointsNeededToNextLevel} pts`}
              </span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-1000"
                style={{
                  width:
                    userProfile.membershipType === 'GOLD'
                      ? '100%'
                      : userProfile.membershipType === 'SILVER'
                      ? `${Math.min(100, (userProfile.currentPoints / 5000) * 100)}%`
                      : `${Math.min(100, (userProfile.currentPoints / 1000) * 100)}%`
                }}
              />
            </div>
            <p className="text-[9px] opacity-85 leading-normal mt-2">
              🌟 Quyền lợi:{' '}
              {userProfile.membershipType === 'GOLD'
                ? 'Giảm trực tiếp 5% cho tất cả các tour đang ưu đãi kịch sàn + Ưu tiên hỗ trợ VIP.'
                : userProfile.membershipType === 'SILVER'
                ? 'Giảm trực tiếp 3% cho tất cả các tour đang ưu đãi kịch sàn.'
                : 'Quyền lợi cơ bản, tích lũy 1 điểm cho mỗi 100.000 đ chi tiêu thực nhận.'}
            </p>
          </div>
        </div>
      )}

      <h2 className="text-lg font-extrabold text-slate-800 text-center">Thông tin chi tiết tài khoản</h2>
      <p className="text-slate-400 text-[11px] text-center mt-1">
        Cập nhật hồ sơ cá nhân, số chứng minh, hộ chiếu của bạn
      </p>

      {profileLoading && !profileEmail ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-xs text-slate-400">Đang tải thông tin...</span>
        </div>
      ) : (
        <form className="mt-6 space-y-6" onSubmit={handleUpdateProfile}>
          {/* Section 1: Thông tin chung */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-[#eff6f3] pb-2">
              📂 1. Thông tin cá nhân cơ bản
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Tên đăng nhập (Username)
                </label>
                <input
                  type="text"
                  value={username}
                  disabled
                  className="w-full bg-slate-50 border border-[#e2ece7] text-slate-400 rounded-xl px-4 py-2.5 text-xs outline-none cursor-not-allowed font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Họ và tên bắt buộc
                </label>
                <input
                  type="text"
                  required
                  value={profileFullName}
                  onChange={(e) => setProfileFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Số điện thoại bắt buộc
                </label>
                <input
                  type="text"
                  required
                  value={profilePhoneNumber}
                  onChange={(e) => setProfilePhoneNumber(e.target.value)}
                  placeholder="Ví dụ: 0987654321"
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Địa chỉ Email bắt buộc
                </label>
                <input
                  type="email"
                  required
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Giới tính bắt buộc
                </label>
                <select
                  required
                  value={profileGender}
                  onChange={(e) => setProfileGender(e.target.value)}
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors cursor-pointer"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Ngày sinh bắt buộc
                </label>
                <input
                  type="date"
                  required
                  value={profileBirthDate}
                  onChange={(e) => setProfileBirthDate(e.target.value)}
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Quốc tịch
                </label>
                <input
                  type="text"
                  value={profileNationality}
                  onChange={(e) => setProfileNationality(e.target.value)}
                  placeholder="Việt Nam"
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Địa chỉ liên hệ
                </label>
                <input
                  type="text"
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  placeholder="Địa chỉ cụ thể của bạn"
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Identity Documents */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-[#eff6f3] pb-2">
              💳 2. Căn cước công dân & Hộ chiếu
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Số CCCD / CMND
                </label>
                <input
                  type="text"
                  value={profileCccd}
                  onChange={(e) => setProfileCccd(e.target.value)}
                  placeholder="Số CCCD 12 số"
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Ngày cấp CCCD
                </label>
                <input
                  type="date"
                  value={profileCccdIssueDate}
                  onChange={(e) => setProfileCccdIssueDate(e.target.value)}
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Nơi cấp CCCD
                </label>
                <input
                  type="text"
                  value={profileCccdIssuePlace}
                  onChange={(e) => setProfileCccdIssuePlace(e.target.value)}
                  placeholder="Cục Cảnh Sát..."
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Số Hộ chiếu (Passport)
                </label>
                <input
                  type="text"
                  value={profilePassport}
                  onChange={(e) => setProfilePassport(e.target.value)}
                  placeholder="Mã số Hộ chiếu"
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Ngày cấp Hộ chiếu
                </label>
                <input
                  type="date"
                  value={profilePassportIssueDate}
                  onChange={(e) => setProfilePassportIssueDate(e.target.value)}
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Ngày hết hạn Hộ chiếu
                </label>
                <input
                  type="date"
                  value={profilePassportExpiryDate}
                  onChange={(e) => setProfilePassportExpiryDate(e.target.value)}
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Password confirmation */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-[#eff6f3] pb-2">
              🔑 3. Thay đổi mật khẩu & Xác thực
            </h3>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Mật khẩu mới (Bỏ trống nếu không muốn thay đổi)
              </label>
              <input
                type="password"
                value={profileNewPassword}
                onChange={(e) => setProfileNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
              />
            </div>

            <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-2xl">
              <label className="block text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-2">
                Nhập Mật khẩu hiện tại bắt buộc (Để lưu thay đổi)
              </label>
              <input
                type="password"
                required
                value={profileOldPassword}
                onChange={(e) => setProfileOldPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại của bạn"
                className="w-full bg-white border border-rose-200 focus:border-rose-400 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-[#f0f6f3]">
            <button
              type="button"
              onClick={() => {
                setProfileOldPassword('');
                setProfileNewPassword('');
                setActiveTab('home');
              }}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 py-3.5 rounded-xl transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={updating}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-xs font-bold text-white py-3.5 rounded-xl shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all"
            >
              {updating ? 'Đang lưu...' : 'Lưu tất cả thông tin'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
