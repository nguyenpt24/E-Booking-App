import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Configure Axios Defaults to point to the Backend Port
const API_BASE = 'http://localhost:8081/api';
axios.defaults.baseURL = API_BASE;

// Inject JWT Token from LocalStorage if it exists
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default function App() {
  // Authentication & Session States
  const [token, setToken] = useState(localStorage.getItem('jwtToken') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  
  // Navigation State: 'home' | 'tours-catalog' | 'login' | 'register' | 'admin-dashboard'
  const [activeTab, setActiveTab] = useState('home');

  // Profile Update States
  const [profileEmail, setProfileEmail] = useState('');
  const [profileOldPassword, setProfileOldPassword] = useState('');
  const [profileNewPassword, setProfileNewPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Customer Catalog States
  const [tours, setTours] = useState([]);
  const [loadingTours, setLoadingTours] = useState(false);
  const [searchDest, setSearchDest] = useState('');
  const [searchMaxPrice, setSearchMaxPrice] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Shopping Cart States
  const [cart, setCart] = useState([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  // Tour Detail States
  const [selectedTourDetail, setSelectedTourDetail] = useState(null);
  
  // Checkout Process States
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState('VNPAY');
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [mockPaymentUrl, setMockPaymentUrl] = useState('');
  const [showPaymentSimulator, setShowPaymentSimulator] = useState(false);

  // Admin Dashboard States
  const [adminBookings, setAdminBookings] = useState([]);
  const [adminRevenueReports, setAdminRevenueReports] = useState([]);
  const [loadingAdminData, setLoadingAdminData] = useState(false);

  // Tour CRUD Modal States
  const [showTourCrudModal, setShowTourCrudModal] = useState(false);
  const [crudMode, setCrudMode] = useState('ADD'); // 'ADD' | 'EDIT'
  const [crudTourId, setCrudTourId] = useState(null);
  const [crudTitle, setCrudTitle] = useState('');
  const [crudDestination, setCrudDestination] = useState('');
  const [crudPrice, setCrudPrice] = useState('');
  const [crudDepartureDate, setCrudDepartureDate] = useState('');
  const [crudItinerary, setCrudItinerary] = useState('');
  const [crudAvailableSlots, setCrudAvailableSlots] = useState(10);
  const [crudImage, setCrudImage] = useState('');

  // Notification Toast State
  const [notification, setNotification] = useState(null);

  // Auto-dismiss Alerts Utility
  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Fetch Public/Filtered Tours
  const fetchTours = async (isSearch = false) => {
    setLoadingTours(true);
    try {
      let url = '/tours';
      if (isSearch) {
        url = '/tours/search?';
        const params = [];
        if (searchDest) params.push(`destination=${encodeURIComponent(searchDest)}`);
        if (searchMaxPrice) params.push(`maxPrice=${searchMaxPrice}`);
        if (searchDate) params.push(`departureDate=${searchDate}`);
        url += params.join('&');
      }
      const res = await axios.get(url);
      setTours(res.data);
    } catch (err) {
      console.error(err);
      triggerNotification(err.response?.data?.message || 'Không thể tải danh sách tour du lịch!', 'error');
    } finally {
      setLoadingTours(false);
    }
  };

  // Fetch Administrative Records (For Admin Only)
  const fetchAdminData = async () => {
    if (role !== 'ROLE_ADMIN') return;
    setLoadingAdminData(true);
    try {
      const bookingsRes = await axios.get('/bookings');
      setAdminBookings(bookingsRes.data);

      const reportRes = await axios.get('/admin/reports/revenue');
      setAdminRevenueReports(reportRes.data);
    } catch (err) {
      console.error(err);
      triggerNotification(err.response?.data?.message || 'Không thể đồng bộ dữ liệu quản trị!', 'error');
    } finally {
      setLoadingAdminData(false);
    }
  };

  useEffect(() => {
    fetchTours();
    // Load Cart from localStorage if exists
    const storedCart = localStorage.getItem('tourCart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        localStorage.removeItem('tourCart');
      }
    }
  }, []);

  const fetchUserProfile = async () => {
    if (!token) return;
    setProfileLoading(true);
    try {
      const res = await axios.get('/users/profile');
      setProfileEmail(res.data.email);
    } catch (err) {
      console.error(err);
      triggerNotification(err.response?.data?.message || 'Không thể lấy thông tin tài khoản!', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileOldPassword) {
      triggerNotification('Vui lòng nhập mật khẩu hiện tại để xác thực!', 'error');
      return;
    }
    setProfileLoading(true);
    try {
      const payload = {
        email: profileEmail,
        oldPassword: profileOldPassword,
        newPassword: profileNewPassword
      };
      const res = await axios.put('/users/profile', payload);
      triggerNotification(res.data.message || 'Cập nhật tài khoản thành công!');
      setProfileOldPassword('');
      setProfileNewPassword('');
      setActiveTab('home');
    } catch (err) {
      console.error(err);
      triggerNotification(err.response?.data?.message || 'Cập nhật tài khoản thất bại!', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'admin-dashboard') {
      fetchAdminData();
    } else if (activeTab === 'user-profile') {
      fetchUserProfile();
    }
  }, [activeTab]);

  // Persist Cart
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('tourCart', JSON.stringify(newCart));
  };

  // Cart Operations
  const addToCart = (tour, count = 1) => {
    const existingItemIdx = cart.findIndex((item) => item.tour.id === tour.id);
    const currentCart = [...cart];

    if (existingItemIdx > -1) {
      const newCount = currentCart[existingItemIdx].ticketsCount + count;
      if (newCount > tour.availableSlots) {
        triggerNotification(`Rất tiếc, Tour này chỉ còn ${tour.availableSlots} chỗ trống!`, 'error');
        return;
      }
      currentCart[existingItemIdx].ticketsCount = newCount;
    } else {
      if (count > tour.availableSlots) {
        triggerNotification(`Rất tiếc, Tour này chỉ còn ${tour.availableSlots} chỗ trống!`, 'error');
        return;
      }
      currentCart.push({ tour, ticketsCount: count });
    }

    saveCart(currentCart);
    triggerNotification(`Đã thêm "${tour.title}" vào giỏ hàng!`);
  };

  const updateCartCount = (tourId, count) => {
    const item = cart.find((i) => i.tour.id === tourId);
    if (!item) return;

    if (count <= 0) {
      removeFromCart(tourId);
      return;
    }

    if (count > item.tour.availableSlots) {
      triggerNotification(`Rất tiếc, Tour này chỉ còn ${item.tour.availableSlots} chỗ trống!`, 'error');
      return;
    }

    const newCart = cart.map((i) => 
      i.tour.id === tourId ? { ...i, ticketsCount: count } : i
    );
    saveCart(newCart);
  };

  const removeFromCart = (tourId) => {
    const newCart = cart.filter((i) => i.tour.id !== tourId);
    saveCart(newCart);
    triggerNotification('Đã xóa tour khỏi giỏ hàng.');
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.tour.price * item.ticketsCount), 0);
  };

  // Auth Operations
  const handleAuth = async (mode, e, authData) => {
    e.preventDefault();
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const res = await axios.post(endpoint, authData);
      
      const { token, username, role } = res.data;
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);

      setToken(token);
      setUsername(username);
      setRole(role);
      
      triggerNotification(mode === 'login' ? `Chào mừng trở lại, ${username}!` : 'Đăng ký tài khoản thành công!');
      
      if (role === 'ROLE_ADMIN') {
        setActiveTab('admin-dashboard');
      } else {
        setActiveTab('home');
      }
    } catch (err) {
      console.error(err);
      triggerNotification(err.response?.data?.message || 'Lỗi xác thực thông tin!', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setToken('');
    setUsername('');
    setRole('');
    setActiveTab('home');
    triggerNotification('Đã đăng xuất tài khoản an toàn!');
  };

  // Cart Checkout Flow
  const handleCartCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      // Check out items. Since the API checks out one by one, we will process the first item in cart
      // or check out them one by one. For standard visual flow, we take the primary item (or checkout sequentially)
      const primaryItem = cart[0]; 
      
      const payload = {
        tourId: primaryItem.tour.id,
        customerName: checkoutName,
        customerEmail: checkoutEmail,
        customerPhone: checkoutPhone,
        ticketsCount: primaryItem.ticketsCount,
        paymentMethod: checkoutPaymentMethod
      };

      const res = await axios.post('/bookings', payload);
      const bookingResult = res.data;

      // Call payment gateway URL generator
      const payRes = await axios.post(`/bookings/${bookingResult.id}/pay`);
      
      // Update states
      setActiveInvoice(bookingResult);
      setMockPaymentUrl(payRes.data.paymentUrl);
      setShowCheckoutModal(false);
      setShowPaymentSimulator(true);

      // Remove the checked out item from cart
      const remainingCart = cart.slice(1);
      saveCart(remainingCart);

      fetchTours();
      triggerNotification(`Đơn đặt tour #${bookingResult.id} đã được giữ chỗ thành công!`);
    } catch (err) {
      console.error(err);
      triggerNotification(err.response?.data?.message || 'Quá trình thanh toán gặp lỗi!', 'error');
    }
  };

  const confirmMockPayment = async (bookingId) => {
    try {
      await axios.put(`/bookings/${bookingId}/approve`);
      triggerNotification('Thanh toán thành công! Hệ thống đã gửi email hóa đơn chi tiết.');
      setShowPaymentSimulator(false);
      setActiveInvoice(null);
      fetchTours();
    } catch (err) {
      console.error(err);
      triggerNotification(err.response?.data?.message || 'Xác nhận thanh toán thất bại!', 'error');
    }
  };

  // Admin Actions: Tour CRUD
  const handleCrudSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: crudTitle,
        destination: crudDestination,
        price: parseFloat(crudPrice),
        departureDate: crudDepartureDate,
        itinerary: crudItinerary,
        availableSlots: parseInt(crudAvailableSlots),
        image: crudImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
      };

      if (crudMode === 'ADD') {
        await axios.post('/tours', payload);
        triggerNotification('Đã thêm tour mới thành công!');
      } else {
        await axios.put(`/tours/${crudTourId}`, payload);
        triggerNotification('Đã cập nhật thông tin tour thành công!');
      }

      setShowTourCrudModal(false);
      fetchTours();
      fetchAdminData();
    } catch (err) {
      console.error(err);
      triggerNotification(err.response?.data?.message || 'Không thể lưu thông tin tour!', 'error');
    }
  };

  const openEditTour = (tour) => {
    setCrudMode('EDIT');
    setCrudTourId(tour.id);
    setCrudTitle(tour.title);
    setCrudDestination(tour.destination);
    setCrudPrice(tour.price);
    setCrudDepartureDate(tour.departureDate);
    setCrudItinerary(tour.itinerary);
    setCrudAvailableSlots(tour.availableSlots);
    setCrudImage(tour.image);
    setShowTourCrudModal(true);
  };

  const openAddTour = () => {
    setCrudMode('ADD');
    setCrudTourId(null);
    setCrudTitle('');
    setCrudDestination('');
    setCrudPrice('');
    setCrudDepartureDate('');
    setCrudItinerary('');
    setCrudAvailableSlots(10);
    setCrudImage('');
    setShowTourCrudModal(true);
  };

  const softDeleteTour = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tour du lịch này?')) return;
    try {
      await axios.delete(`/tours/${id}`);
      triggerNotification('Đã ẩn (xóa mềm) tour du lịch thành công!');
      fetchTours();
      fetchAdminData();
    } catch (err) {
      console.error(err);
      triggerNotification(err.response?.data?.message || 'Lỗi khi xóa tour!', 'error');
    }
  };

  // Admin Actions: Booking Board (Approve/Cancel)
  const adminApproveBooking = async (id) => {
    try {
      await axios.put(`/bookings/${id}/approve`);
      triggerNotification('Duyệt đơn thanh toán thành công! Đã gửi hóa đơn qua email.');
      fetchAdminData();
      fetchTours();
    } catch (err) {
      console.error(err);
      triggerNotification(err.response?.data?.message || 'Không thể duyệt đơn hàng!', 'error');
    }
  };

  const adminCancelBooking = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này? Chỗ trống sẽ được hoàn trả.')) return;
    try {
      await axios.put(`/bookings/${id}/cancel`);
      triggerNotification('Đã hủy đơn hàng và hoàn trả chỗ trống thành công!');
      fetchAdminData();
      fetchTours();
    } catch (err) {
      console.error(err);
      triggerNotification(err.response?.data?.message || 'Không thể hủy đơn hàng!', 'error');
    }
  };

  // Filtered tours by local Category tabs (optional aesthetic touch)
  const getFilteredTours = () => {
    if (activeCategory === 'all') return tours;
    if (activeCategory === 'domestic') {
      return tours.filter(t => !t.destination.toLowerCase().includes('singapore') && 
                                !t.destination.toLowerCase().includes('thái lan') && 
                                !t.destination.toLowerCase().includes('nhật bản') && 
                                !t.destination.toLowerCase().includes('korea'));
    }
    if (activeCategory === 'international') {
      return tours.filter(t => t.destination.toLowerCase().includes('singapore') || 
                               t.destination.toLowerCase().includes('thái lan') || 
                               t.destination.toLowerCase().includes('nhật bản') || 
                               t.destination.toLowerCase().includes('korea') || 
                               t.destination.toLowerCase().includes('quốc tế'));
    }
    return tours;
  };

  const filteredToursList = getFilteredTours();

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#1e293b] font-sans antialiased pb-20 selection:bg-emerald-500 selection:text-white">
      
      {/* Dynamic Toast Alert Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 flex items-center p-4 rounded-xl shadow-xl transition-all duration-300 transform scale-100 ${
          notification.type === 'error' ? 'bg-rose-550 bg-rose-600 border border-rose-500 text-white' : 'bg-emerald-700 text-white border border-emerald-600'
        }`}>
          <div className="text-xs font-bold tracking-wide flex items-center space-x-2">
            <span>{notification.type === 'error' ? '⚠️' : '✨'}</span>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Premium Minimalist Green-White Header Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 border-b border-[#e6eef0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
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
              className={`font-semibold text-sm transition-colors ${activeTab === 'home' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Trang chủ
            </button>
            <button 
              onClick={() => setActiveTab('tours-catalog')} 
              className={`font-semibold text-sm transition-colors ${activeTab === 'tours-catalog' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Danh sách Tour
            </button>
            {token && role === 'ROLE_ADMIN' && (
              <button 
                onClick={() => setActiveTab('admin-dashboard')} 
                className={`font-semibold text-sm transition-colors ${activeTab === 'admin-dashboard' ? 'text-emerald-700 animate-pulse' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Dashboard Quản Trị
              </button>
            )}
          </nav>

          {/* Action Blocks (Cart & Profile Accounts) */}
          <div className="flex items-center space-x-5">
            {/* Cart Trigger Button */}
            <button 
              onClick={() => setShowCartDrawer(true)}
              className="relative p-2.5 bg-[#eff7f4] border border-[#d6eae1] rounded-xl hover:bg-[#e3f2ec] text-slate-700 hover:text-emerald-700 transition-all"
            >
              🛒
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
                    <span className="text-[10px] opacity-60 group-hover:opacity-100 transition-opacity">⚙️</span>
                  </span>
                  <span className="block text-[10px] text-emerald-600 font-semibold">{role === 'ROLE_ADMIN' ? 'Admin Hệ Thống' : 'Khách Hàng'}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-slate-100 hover:bg-[#fde8e8] hover:text-rose-600 border border-slate-200 hover:border-[#fbcfe8]/40 text-xs px-3.5 py-2 rounded-xl transition-all font-bold text-slate-650"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setActiveTab('login')} 
                  className="text-slate-600 hover:text-slate-900 text-sm px-4 py-2.5 font-bold transition-colors"
                >
                  Đăng nhập
                </button>
                <button 
                  onClick={() => setActiveTab('register')} 
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2.5 rounded-xl font-bold shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all"
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* TAB 1: Minimalist Elegant Home Page */}
        {activeTab === 'home' && (
          <div>
            {/* Elegant Green-White Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-white border border-[#e6eef0] shadow-sm p-8 sm:p-16 mb-6 md:mb-10">
              {/* Subtle background decorative green circles */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/40 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-50/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100/50 text-[10px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-full">
                  🍃 Hệ thống đặt Tour Trực tuyến Hàng đầu
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1e293b] mt-5 leading-normal sm:leading-tight">
                  Tận hưởng hành trình <br/>
                  <span className="bg-gradient-to-r from-emerald-700 to-teal-500 bg-clip-text text-transparent">Trọn vẹn & Đẳng cấp nhất</span>
                </h1>
                <p className="mt-4 text-slate-500 text-xs sm:text-sm leading-relaxed max-w-lg">
                  E-Tour mang đến những trải nghiệm du lịch cao cấp hàng đầu Việt Nam. Tích hợp thanh toán QR VNPay/MoMo an toàn, phản hồi xác thực tự động và chăm sóc tận tâm.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button 
                    onClick={() => setActiveTab('tours-catalog')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-md shadow-emerald-600/10 transition-all text-center"
                  >
                    Xem tất cả Tour
                  </button>
                  <a 
                    href="#featured-tours"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-6 py-3.5 rounded-xl transition-all text-center flex items-center justify-center space-x-2"
                  >
                    <span>Khám phá ngay</span>
                    <span>↓</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Search Widget */}
            <div className="bg-white border border-[#e6eef0] p-6 rounded-3xl shadow-sm mb-12 max-w-5xl mx-auto mt-6 md:-mt-16 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Điểm đến</label>
                    <select 
                      value={searchDest}
                      onChange={(e) => setSearchDest(e.target.value)}
                      className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-3 text-xs outline-none transition-colors cursor-pointer font-semibold text-slate-700"
                    >
                      <option value="">-- Tất cả địa điểm --</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Sa Pa">Sa Pa (Lào Cai)</option>
                      <option value="Hà Giang">Hà Giang</option>
                      <option value="Hạ Long">Vịnh Hạ Long</option>
                      <option value="Ninh Bình">Ninh Bình</option>
                      <option value="Quảng Bình">Quảng Bình (Phong Nha)</option>
                      <option value="Huế">Huế</option>
                      <option value="Đà Nẵng - Hội An">Đà Nẵng - Hội An</option>
                      <option value="Quy Nhơn">Quy Nhơn (Bình Định)</option>
                      <option value="Nha Trang">Nha Trang (Khánh Hòa)</option>
                      <option value="Đà Lạt">Đà Lạt (Lâm Đồng)</option>
                      <option value="Mũi Né">Mũi Né (Phan Thiết)</option>
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh (Sài Gòn)</option>
                      <option value="Cần Thơ">Cần Thơ (Miền Tây)</option>
                      <option value="Phú Quốc">Phú Quốc (Đảo Ngọc)</option>
                      <option value="Singapore & Malaysia">Singapore & Malaysia (Quốc Tế)</option>
                    </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Mức giá tối đa (VND)</label>
                  <input 
                    type="number" 
                    placeholder="Ví dụ: 10000000"
                    value={searchMaxPrice}
                    onChange={(e) => setSearchMaxPrice(e.target.value)}
                    className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-3 text-xs outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Ngày đi</label>
                  <input 
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-3 text-xs outline-none transition-colors cursor-pointer text-slate-650"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end space-x-3 border-t border-[#f0f6f3] pt-4">
                <button 
                  onClick={() => {
                    setSearchDest('');
                    setSearchMaxPrice('');
                    setSearchDate('');
                    fetchTours();
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-600 px-4 py-2.5 rounded-xl font-bold transition-all"
                >
                  Xóa lọc
                </button>
                <button 
                  onClick={() => {
                    fetchTours(true);
                    setActiveTab('tours-catalog');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-[10px] text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-emerald-600/10 transition-all"
                >
                  Tìm kiếm chuyến đi
                </button>
              </div>
            </div>

            {/* Featured Section Roster */}
            <div id="featured-tours" className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800">📍 Hành trình đặc sắc nhất</h2>
                  <p className="text-[11px] text-slate-400 mt-1">Các tour du lịch được đánh giá cao và lựa chọn nhiều nhất trong tuần.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('tours-catalog')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
                >
                  <span>Xem thêm tour</span>
                  <span>→</span>
                </button>
              </div>

              {/* Small grid of 3 featured items */}
              {loadingTours ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
                  <span className="text-xs text-slate-400">Đang đồng bộ dữ liệu...</span>
                </div>
              ) : tours.length === 0 ? (
                <div className="bg-white border border-[#e6eef0] p-12 rounded-3xl text-center text-slate-400 text-xs">
                  Không tìm thấy tour du lịch nào.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {tours.slice(0, 3).map((tour) => (
                    <div key={tour.id} className="group bg-white border border-[#e6eef0] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                      <div className="relative h-44 bg-slate-100 overflow-hidden">
                        <img 
                          src={tour.image} 
                          alt={tour.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80";
                          }}
                        />
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 shadow-sm">
                          📍 {tour.destination}
                        </div>
                        <div className="absolute top-3 right-3">
                          {tour.availableSlots === 0 ? (
                            <span className="bg-rose-100 text-rose-700 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">Hết chỗ</span>
                          ) : (
                            <span className="bg-emerald-550 bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">Còn {tour.availableSlots} chỗ</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {tour.title}
                        </h3>
                        <div className="text-[10px] text-slate-450 text-slate-400 mt-2 pb-2.5 border-b border-[#f0f6f3]">
                          Khởi hành: <strong>{tour.departureDate}</strong>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mt-3 flex-1">
                          {tour.itinerary}
                        </p>

                        <div className="mt-4 pt-3 border-t border-[#f0f6f3] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">Giá từ</span>
                            <span className="text-sm font-black text-rose-500">
                              {new Intl.NumberFormat('vi-VN').format(tour.price)} <span className="text-[10px] font-normal text-slate-500">đ</span>
                            </span>
                          </div>

                          <div className="flex space-x-1.5">
                            <button 
                              onClick={() => setSelectedTourDetail(tour)}
                              className="bg-[#f0f6f3] hover:bg-[#e2ece7] text-emerald-700 text-[10px] font-bold px-3 py-2 rounded-lg transition-colors"
                            >
                              Chi tiết
                            </button>
                            <button 
                              onClick={() => addToCart(tour, 1)}
                              disabled={tour.availableSlots === 0}
                              className={`text-[10px] font-bold px-3 py-2 rounded-lg transition-colors ${
                                tour.availableSlots === 0 
                                  ? 'bg-slate-100 text-slate-350 cursor-not-allowed'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                              }`}
                            >
                              Thêm 🛒
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Why Choose E-Tour Highlights */}
            <div className="bg-white border border-[#e6eef0] rounded-3xl p-8 sm:p-12 shadow-sm my-16">
              <h2 className="text-center text-xl font-extrabold text-slate-800 mb-8">✨ Điểm cộng vượt trội từ E-Tour</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mx-auto font-bold shadow-sm">
                    🔒
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Đặt chỗ & Bảo mật 100%</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed px-4">Thông tin vé, tài khoản và lịch trình giao dịch được mã hóa hoàn toàn bằng chuẩn Spring Security & JWT.</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mx-auto font-bold shadow-sm">
                    ⚡
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Thanh toán VNPay / MoMo</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed px-4">Tích hợp tạo cổng sandbox chuyển tiền QR thông minh, không cần khai báo thẻ rườm rà.</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mx-auto font-bold shadow-sm">
                    📨
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Hóa đơn Email tự động</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed px-4">Hệ thống Spring Mail tự động kết xuất hóa đơn HTML sang trọng gửi về email khách hàng ngay khi hoàn tất.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Full Tours Catalog with Category filters */}
        {activeTab === 'tours-catalog' && (
          <div>
            <div className="border-b border-[#e6eef0] pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-800">📂 Tất cả các chuyến đi du lịch</h1>
                <p className="text-[11px] text-slate-400 mt-1">Đầy đủ thông tin, hành trình minh bạch, dịch vụ chuẩn 5 sao.</p>
              </div>

              {/* Categorization tabs */}
              <div className="flex bg-white border border-[#e6eef0] p-1 rounded-xl shadow-sm self-start">
                <button 
                  onClick={() => setActiveCategory('all')}
                  className={`text-[11px] font-bold px-4 py-2 rounded-lg transition-colors ${activeCategory === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Tất cả
                </button>
                <button 
                  onClick={() => setActiveCategory('domestic')}
                  className={`text-[11px] font-bold px-4 py-2 rounded-lg transition-colors ${activeCategory === 'domestic' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Trong nước
                </button>
                <button 
                  onClick={() => setActiveCategory('international')}
                  className={`text-[11px] font-bold px-4 py-2 rounded-lg transition-colors ${activeCategory === 'international' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Quốc tế
                </button>
              </div>
            </div>

            {loadingTours ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
                <span className="text-xs text-slate-400">Đang đồng bộ dữ liệu...</span>
              </div>
            ) : filteredToursList.length === 0 ? (
              <div className="bg-white border border-[#e6eef0] p-16 rounded-3xl text-center text-slate-400 text-xs">
                🔍 Không tìm thấy tour du lịch nào. Hãy đổi danh mục hoặc bộ lọc khác.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredToursList.map((tour) => (
                  <div key={tour.id} className="group bg-white border border-[#e6eef0] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img 
                        src={tour.image} 
                        alt={tour.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 shadow-sm">
                        📍 {tour.destination}
                      </div>
                      <div className="absolute top-3 right-3">
                        {tour.availableSlots === 0 ? (
                          <span className="bg-rose-100 text-rose-700 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">Hết chỗ</span>
                        ) : tour.availableSlots <= 3 ? (
                          <span className="bg-rose-550 bg-rose-500 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase animate-pulse">Chỉ còn {tour.availableSlots} chỗ</span>
                        ) : (
                          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">Còn {tour.availableSlots} chỗ</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {tour.title}
                      </h3>
                      <div className="text-[10px] text-slate-400 mt-2 pb-2.5 border-b border-[#f0f6f3]">
                        Khởi hành: <strong>{tour.departureDate}</strong>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3 mt-3 flex-1">
                        {tour.itinerary}
                      </p>

                      <div className="mt-4 pt-3 border-t border-[#f0f6f3] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold">Giá từ</span>
                          <span className="text-base font-black text-rose-500">
                            {new Intl.NumberFormat('vi-VN').format(tour.price)} <span className="text-[10px] font-normal text-slate-500">đ</span>
                          </span>
                        </div>

                        <div className="flex space-x-1.5">
                          <button 
                            onClick={() => setSelectedTourDetail(tour)}
                            className="bg-[#f0f6f3] hover:bg-[#e2ece7] text-emerald-700 text-[10px] font-bold px-3.5 py-2.5 rounded-xl transition-colors"
                          >
                            Chi tiết
                          </button>
                          <button 
                            onClick={() => addToCart(tour, 1)}
                            disabled={tour.availableSlots === 0}
                            className={`text-[10px] font-bold px-4 py-2.5 rounded-xl transition-all ${
                              tour.availableSlots === 0 
                                ? 'bg-slate-100 text-slate-350 cursor-not-allowed border border-slate-200'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                            }`}
                          >
                            Đặt Tour 🛒
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Login panel */}
        {activeTab === 'login' && (
          <div className="max-w-md mx-auto my-12 bg-white border border-[#e6eef0] p-8 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-500" />
            <h2 className="text-xl font-extrabold text-slate-800 text-center">Đăng nhập tài khoản</h2>
            <p className="text-slate-400 text-[11px] text-center mt-2">Đăng nhập để cập nhật giỏ hàng và xem lịch trình các chuyến đi</p>

            <form className="mt-6 space-y-4" onSubmit={(e) => {
              const usernameInput = e.target.username.value;
              const passwordInput = e.target.password.value;
              handleAuth('login', e, { username: usernameInput, password: passwordInput });
            }}>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tên đăng nhập</label>
                <input 
                  type="text" 
                  name="username"
                  required
                  placeholder="Nhập tên đăng nhập"
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-3 text-xs outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Mật khẩu</label>
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
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white py-3.5 rounded-xl shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all mt-4"
              >
                Xác nhận Đăng nhập
              </button>
            </form>

            <div className="text-center text-[11px] text-slate-400 mt-6">
              Bạn chưa có tài khoản thành viên?{' '}
              <button onClick={() => setActiveTab('register')} className="text-emerald-600 font-bold hover:underline">
                Đăng ký tài khoản mới
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: Register Panel */}
        {activeTab === 'register' && (
          <div className="max-w-md mx-auto my-12 bg-white border border-[#e6eef0] p-8 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-500" />
            <h2 className="text-xl font-extrabold text-slate-800 text-center">Đăng ký thành viên</h2>
            <p className="text-slate-400 text-[11px] text-center mt-2">Bắt đầu trải nghiệm những tiện ích đặt tour số 1</p>

            <form className="mt-6 space-y-4" onSubmit={(e) => {
              const usernameInput = e.target.username.value;
              const passwordInput = e.target.password.value;
              const emailInput = e.target.email.value;
              handleAuth('register', e, { 
                username: usernameInput, 
                password: passwordInput, 
                email: emailInput
              });
            }}>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tên đăng nhập</label>
                <input 
                  type="text" 
                  name="username"
                  required
                  placeholder="Nhập tên đăng nhập"
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-3 text-xs outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Địa chỉ Email</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="name@domain.com"
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-3 text-xs outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Mật khẩu</label>
                <input 
                  type="password" 
                  name="password"
                  required
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-3 text-xs outline-none transition-colors"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white py-3.5 rounded-xl shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all mt-4"
              >
                Đăng ký thành viên mới
              </button>
            </form>

            <div className="text-center text-[11px] text-slate-400 mt-6">
              Bạn đã có tài khoản thành viên?{' '}
              <button onClick={() => setActiveTab('login')} className="text-emerald-600 font-bold hover:underline">
                Đăng nhập ngay
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: Admin Protected Dashboard */}
        {activeTab === 'admin-dashboard' && (
          <div>
            {role !== 'ROLE_ADMIN' ? (
              <div className="bg-rose-50 border border-rose-250 border-rose-200 p-8 rounded-2xl text-center text-rose-600 my-10 max-w-lg mx-auto">
                🛑 <strong>Yêu cầu xác thực Quản Trị!</strong> <br/>
                Bạn cần đăng ký hoặc đăng nhập với đặc quyền Admin để sử dụng bảng CRM này.
              </div>
            ) : (
              <div>
                {/* Admin Header Board */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e6eef0] pb-6 mb-8 gap-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-800">Bảng Điều Khiển Quản Trị CRM</h1>
                    <p className="text-[11px] text-slate-400 mt-1">Tổng hợp doanh thu, quản lý danh mục và xét duyệt hóa đơn email cho khách hàng.</p>
                  </div>
                  <button 
                    onClick={openAddTour}
                    className="bg-emerald-650 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white px-5 py-3 rounded-xl shadow-md transition-all self-start flex items-center space-x-2"
                  >
                    <span>➕ Thêm Tour Mới</span>
                  </button>
                </div>

                {/* Aggregated indicators */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-white border border-[#e6eef0] p-6 rounded-2xl">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Tổng doanh thu thực nhận</span>
                    <span className="text-2xl font-black text-emerald-600 mt-2 block">
                      {new Intl.NumberFormat('vi-VN').format(
                        adminBookings
                          .filter(b => b.status === 'PAID')
                          .reduce((sum, b) => sum + b.totalPrice, 0)
                      )} <span className="text-xs font-normal text-slate-450">VND</span>
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-2">Dựa trên các đơn đặt trạng thái PAID</span>
                  </div>

                  <div className="bg-white border border-[#e6eef0] p-6 rounded-2xl">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Hóa đơn đã thanh toán</span>
                    <span className="text-2xl font-black text-slate-800 mt-2 block">
                      {adminBookings.filter(b => b.status === 'PAID').length} <span className="text-xs font-normal text-slate-450">đơn</span>
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-2">Hệ thống đã tự động gửi vé qua Email</span>
                  </div>

                  <div className="bg-white border border-[#e6eef0] p-6 rounded-2xl">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Hóa đơn đang chờ duyệt (PENDING)</span>
                    <span className="text-2xl font-black text-amber-600 mt-2 block">
                      {adminBookings.filter(b => b.status === 'PENDING').length} <span className="text-xs font-normal text-slate-450">đơn</span>
                    </span>
                    <span className="text-[10px] text-amber-650 text-amber-600 block mt-2 font-medium animate-pulse">Quét hủy sau 15 phút không thanh toán</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Analytics & Orders */}
                  <div className="lg:col-span-2 space-y-8">
                    
                    {/* Dynamic Bar Revenue statistics */}
                    <div className="bg-white border border-[#e6eef0] p-6 rounded-3xl shadow-sm">
                      <h2 className="text-sm font-bold text-slate-800 mb-4">📊 Báo cáo doanh số tour bán chạy nhất</h2>
                      
                      {adminRevenueReports.length === 0 ? (
                        <div className="py-12 text-center text-xs text-slate-400">
                          Chưa có dữ liệu thanh toán để thống kê.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {adminRevenueReports.map((report, idx) => {
                            const maxVal = Math.max(...adminRevenueReports.map(r => r.revenue), 1);
                            const percent = (report.revenue / maxVal) * 100;
                            return (
                              <div key={idx} className="space-y-1.5">
                                <div className="flex justify-between text-xs font-semibold">
                                  <span className="text-slate-700 truncate max-w-xs">{report.tourTitle}</span>
                                  <span className="text-emerald-700 font-extrabold">
                                    {new Intl.NumberFormat('vi-VN').format(report.revenue)} đ{' '}
                                    <span className="text-slate-400 text-[10px] font-normal">({report.bookingsCount} lượt mua)</span>
                                  </span>
                                </div>
                                <div className="w-full bg-[#f0f6f3] h-4 rounded-full overflow-hidden border border-[#e2ece7]">
                                  <div 
                                    className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Admin Bookings Table */}
                    <div className="bg-white border border-[#e6eef0] p-6 rounded-3xl shadow-sm overflow-hidden">
                      <h2 className="text-sm font-bold text-slate-800 mb-4">📋 Lịch sử và trạng thái các đơn đặt vé</h2>
                      
                      {adminBookings.length === 0 ? (
                        <div className="py-12 text-center text-xs text-slate-400">Không có hóa đơn đăng ký.</div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-[#e6eef0] text-slate-400 uppercase tracking-wider font-bold">
                                <th className="py-3 px-3">Đơn</th>
                                <th className="py-3 px-3">Khách hàng</th>
                                <th className="py-3 px-3">Tour du lịch</th>
                                <th className="py-3 px-3">Vé mua</th>
                                <th className="py-3 px-3">Tổng tiền</th>
                                <th className="py-3 px-3">Trạng thái</th>
                                <th className="py-3 px-3 text-right">Hành động</th>
                              </tr>
                            </thead>
                            <tbody>
                              {adminBookings.map((b) => (
                                <tr key={b.id} className="border-b border-[#f0f6f3] hover:bg-slate-50/50 transition-colors">
                                  <td className="py-3.5 px-3 font-mono font-bold text-slate-800">#{b.id}</td>
                                  <td className="py-3.5 px-3">
                                    <div className="font-bold text-slate-800">{b.customerName}</div>
                                    <div className="text-[10px] text-slate-400">{b.customerEmail} | {b.customerPhone}</div>
                                  </td>
                                  <td className="py-3.5 px-3 max-w-[130px] truncate font-semibold">{b.tourTitle}</td>
                                  <td className="py-3.5 px-3 font-bold">{b.ticketsCount} vé</td>
                                  <td className="py-3.5 px-3 text-rose-500 font-extrabold">
                                    {new Intl.NumberFormat('vi-VN').format(b.totalPrice)} đ
                                  </td>
                                  <td className="py-3.5 px-3">
                                    {b.status === 'PAID' && (
                                      <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-bold">Đã thanh toán</span>
                                    )}
                                    {b.status === 'PENDING' && (
                                      <span className="bg-amber-50 border border-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded-full font-bold animate-pulse">Chờ thanh toán</span>
                                    )}
                                    {b.status === 'CANCELLED' && (
                                      <span className="bg-slate-100 border border-slate-200 text-slate-400 text-[9px] px-2 py-0.5 rounded-full font-bold">Đã hủy</span>
                                    )}
                                  </td>
                                  <td className="py-3.5 px-3 text-right">
                                    {b.status === 'PENDING' && (
                                      <div className="flex space-x-1 justify-end">
                                        <button 
                                          onClick={() => adminApproveBooking(b.id)}
                                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg"
                                        >
                                          Duyệt
                                        </button>
                                        <button 
                                          onClick={() => adminCancelBooking(b.id)}
                                          className="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-lg"
                                        >
                                          Hủy
                                        </button>
                                      </div>
                                    )}
                                    {b.status === 'PAID' && (
                                      <button 
                                        onClick={() => adminCancelBooking(b.id)}
                                        className="text-[10px] text-slate-400 hover:text-rose-600 font-bold"
                                      >
                                        Hủy đơn
                                      </button>
                                    )}
                                    {b.status === 'CANCELLED' && (
                                      <span className="text-[10px] text-slate-400 italic">Đã hủy bỏ</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Tours list for CRUD editing */}
                  <div className="space-y-8">
                    <div className="bg-white border border-[#e6eef0] p-6 rounded-3xl shadow-sm">
                      <h2 className="text-sm font-bold text-slate-800 mb-4">🌍 Kho dữ liệu Tour hiện hoạt</h2>
                      
                      <div className="space-y-4">
                        {tours.map((t) => (
                          <div key={t.id} className="bg-[#f8faf9] border border-[#e2ece7] p-4 rounded-2xl space-y-3">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={t.image} 
                                alt={t.title} 
                                className="w-12 h-12 object-cover rounded-lg border border-[#e2ece7]"
                                onError={(e) => {
                                  e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80";
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="text-xs font-bold text-slate-800 truncate">{t.title}</h3>
                                <span className="text-[10px] text-slate-400 mt-1 block">📍 {t.destination}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[10px] border-t border-[#eff6f3] pt-2">
                              <span className="text-slate-500">Chỗ trống: <strong className="text-slate-700">{t.availableSlots}</strong></span>
                              <span className="text-rose-500 font-extrabold">{new Intl.NumberFormat('vi-VN').format(t.price)} đ</span>
                            </div>

                            <div className="flex space-x-2 pt-1">
                              <button 
                                onClick={() => openEditTour(t)}
                                className="flex-1 bg-white hover:bg-slate-550 hover:bg-slate-100 text-slate-600 text-[10px] font-bold py-1.5 rounded-lg border border-[#e2ece7] transition-all"
                              >
                                ✏️ Sửa
                              </button>
                              <button 
                                onClick={() => softDeleteTour(t.id)}
                                className="flex-1 bg-[#fff5f5] hover:bg-[#ffebeb] text-rose-600 text-[10px] font-bold py-1.5 rounded-lg border border-[#ffd6d6] transition-all"
                              >
                                🗑️ Xóa mềm
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: User Profile Settings */}
        {activeTab === 'user-profile' && (
          <div className="max-w-md mx-auto my-12 bg-white border border-[#e6eef0] p-8 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-500" />
            <h2 className="text-xl font-extrabold text-slate-800 text-center">Thông tin cá nhân</h2>
            <p className="text-slate-400 text-[11px] text-center mt-2">Cập nhật email và thay đổi mật khẩu tài khoản của bạn</p>

            {profileLoading && !profileEmail ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
                <span className="text-xs text-slate-400">Đang tải thông tin...</span>
              </div>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={handleUpdateProfile}>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tên đăng nhập (Username)</label>
                  <input 
                    type="text" 
                    value={username}
                    disabled
                    className="w-full bg-slate-50 border border-[#e2ece7] text-slate-400 rounded-xl px-4 py-3 text-xs outline-none cursor-not-allowed font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Địa chỉ Email</label>
                  <input 
                    type="email" 
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-3 text-xs outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Mật khẩu mới (Bỏ trống nếu không đổi)</label>
                  <input 
                    type="password" 
                    value={profileNewPassword}
                    onChange={(e) => setProfileNewPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-3 text-xs outline-none transition-colors"
                  />
                </div>

                <div className="border-t border-[#f0f6f3] pt-4 mt-6">
                  <label className="block text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-2">Mật khẩu hiện tại (Xác thực bảo mật)</label>
                  <input 
                    type="password" 
                    required
                    value={profileOldPassword}
                    onChange={(e) => setProfileOldPassword(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại của bạn"
                    className="w-full bg-[#fdf8f8] border border-rose-100 focus:border-rose-400 rounded-xl px-4 py-3 text-xs outline-none transition-colors"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
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
                    disabled={profileLoading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-xs font-bold text-white py-3.5 rounded-xl shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all"
                  >
                    {profileLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </main>

      {/* FULL SCREEN MODAL: Tour Itinerary Details */}
      {selectedTourDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#e6eef0] w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden relative animate-scaleIn">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-600" />
            
            <div className="relative h-56 bg-slate-100">
              <img 
                src={selectedTourDetail.image} 
                alt={selectedTourDetail.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80";
                }}
              />
              <button 
                onClick={() => setSelectedTourDetail(null)}
                className="absolute top-4 right-4 bg-white/95 text-slate-700 font-extrabold w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-slate-100"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 shadow-sm">
                📍 {selectedTourDetail.destination}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{selectedTourDetail.title}</h3>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pb-2.5 border-b border-[#f0f6f3]">
                  <span>Ngày khởi hành: <strong className="text-slate-700">{selectedTourDetail.departureDate}</strong></span>
                  <span>Mức giá gốc: <strong className="text-rose-500">{new Intl.NumberFormat('vi-VN').format(selectedTourDetail.price)} đ</strong></span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">🗺️ Hành trình chuyến đi chi tiết:</h4>
                <div className="bg-[#f8faf9] border border-[#e2ece7] p-4 rounded-xl max-h-48 overflow-y-auto text-xs text-slate-500 leading-relaxed whitespace-pre-line">
                  {selectedTourDetail.itinerary}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#f0f6f3]">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Tình trạng giữ chỗ</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                    Còn trống {selectedTourDetail.availableSlots} chỗ
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => setSelectedTourDetail(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-5 py-3 rounded-xl transition-all"
                  >
                    Đóng
                  </button>
                  <button 
                    onClick={() => {
                      addToCart(selectedTourDetail, 1);
                      setSelectedTourDetail(null);
                    }}
                    disabled={selectedTourDetail.availableSlots === 0}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all"
                  >
                    Thêm vào giỏ hàng 🛒
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-OVER DRAWER: Shopping Cart Sidebar */}
      {showCartDrawer && (
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
                  <span>🛒</span>
                  <span>Giỏ hàng của bạn đang trống! Hãy khám phá danh sách tour để thêm vé.</span>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="bg-[#f8faf9] border border-[#e2ece7] p-4 rounded-2xl space-y-3 flex flex-col">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-slate-800 truncate pr-4 max-w-[200px]">{item.tour.title}</h4>
                      <button 
                        onClick={() => removeFromCart(item.tour.id)}
                        className="text-slate-450 text-slate-400 hover:text-rose-600 text-xs"
                      >
                        Xóa
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#eff6f3] pt-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Đơn giá</span>
                        <span className="font-bold text-slate-700">{new Intl.NumberFormat('vi-VN').format(item.tour.price)} đ</span>
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
                        <span className="font-extrabold text-rose-500">{new Intl.NumberFormat('vi-VN').format(item.tour.price * item.ticketsCount)} đ</span>
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
                  <strong className="text-lg font-black text-rose-500">{new Intl.NumberFormat('vi-VN').format(getCartTotal())} VND</strong>
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
                      setCheckoutName('');
                      setCheckoutEmail('');
                      setCheckoutPhone('');
                      setShowCheckoutModal(true);
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
      )}

      {/* POPUP MODAL: Checkout / Customer Contact Form */}
      {showCheckoutModal && cart.length > 0 && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#e6eef0] w-full max-w-lg rounded-3xl shadow-xl overflow-hidden relative animate-scaleIn">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-600" />
            
            <div className="p-6">
              <div className="flex items-center justify-between border-b border-[#f0f6f3] pb-4 mb-4">
                <h3 className="text-base font-extrabold text-slate-800">Thông tin liên hệ nhận Vé Tour</h3>
                <button 
                  onClick={() => setShowCheckoutModal(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Checkout details summary preview */}
              <div className="bg-[#f8faf9] border border-[#e2ece7] p-4 rounded-2xl mb-4 space-y-2 text-xs">
                <div className="font-bold text-slate-700">🛒 Tour đang đăng ký thanh toán:</div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{cart[0].tour.title}</span>
                  <strong className="text-slate-850 text-slate-800">{cart[0].ticketsCount} vé</strong>
                </div>
                <div className="flex justify-between border-t border-[#eff6f3] pt-2 font-bold text-rose-500">
                  <span>Tổng tiền thanh toán:</span>
                  <span>{new Intl.NumberFormat('vi-VN').format(cart[0].tour.price * cart[0].ticketsCount)} đ</span>
                </div>
              </div>

              <form onSubmit={handleCartCheckoutSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Họ và tên của bạn</label>
                    <input 
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={checkoutName}
                      onChange={(e) => setCheckoutName(e.target.value)}
                      className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Số điện thoại liên hệ</label>
                    <input 
                      type="tel"
                      required
                      placeholder="Ví dụ: 0987654321"
                      value={checkoutPhone}
                      onChange={(e) => setCheckoutPhone(e.target.value)}
                      className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Địa chỉ Email (Để hệ thống tự động gửi vé/hóa đơn)</label>
                  <input 
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={checkoutEmail}
                    onChange={(e) => setCheckoutEmail(e.target.value)}
                    className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Kênh thanh toán muốn dùng</label>
                  <select 
                    value={checkoutPaymentMethod}
                    onChange={(e) => setCheckoutPaymentMethod(e.target.value)}
                    className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors cursor-pointer text-slate-600 font-semibold"
                  >
                    <option value="VNPAY">Quét cổng VNPay QR giả lập</option>
                    <option value="MOMO">Quét ví điện tử MoMo giả lập</option>
                    <option value="CASH">Thanh toán tiền mặt tại văn phòng</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-[#f0f6f3]">
                  <button 
                    type="button" 
                    onClick={() => setShowCheckoutModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
                  >
                    Bỏ qua
                  </button>
                  <button 
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors"
                  >
                    Xác nhận và đặt vé
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Simulated payment redirect checkout QR code page */}
      {showPaymentSimulator && activeInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#e6eef0] w-full max-w-md rounded-3xl shadow-xl overflow-hidden relative animate-scaleIn">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-500" />
            
            <div className="p-6 text-center">
              <h3 className="text-base font-extrabold text-slate-800">Thanh toán vé du lịch (Cổng giả lập)</h3>
              <p className="text-slate-400 text-[11px] mt-1">Chụp hình hoặc quét mã chuyển khoản QR của {activeInvoice.paymentMethod}</p>

              {/* QR display simulation */}
              <div className="my-5 flex justify-center">
                <div className="bg-white p-3 rounded-2xl border border-[#e2ece7] shadow-md">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mockPaymentUrl)}`}
                    alt="Simulated Pay QR"
                    className="w-44 h-44 rounded-lg"
                  />
                </div>
              </div>

              {/* Reservation card metadata */}
              <div className="bg-[#f8faf9] border border-[#e2ece7] p-4 rounded-2xl text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã đơn đặt vé:</span>
                  <strong className="text-emerald-700">#{activeInvoice.id}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Người đại diện:</span>
                  <strong className="text-slate-800">{activeInvoice.customerName}</strong>
                </div>
                <div className="flex justify-between border-t border-[#eff6f3] pt-2">
                  <span className="text-slate-550 text-slate-500 font-bold">Tổng số tiền cần quét:</span>
                  <strong className="text-rose-500 font-black text-sm">{new Intl.NumberFormat('vi-VN').format(activeInvoice.totalPrice)} đ</strong>
                </div>
                <div className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 p-2.5 rounded-xl text-center leading-relaxed mt-2 animate-pulse">
                  ⚠️ Lưu ý: Quá 15 phút không hoàn tất chuyển tiền, hệ thống Scheduler sẽ tự động hủy đơn giữ chỗ này!
                </div>
              </div>

              <div className="mt-6 flex flex-col space-y-2">
                <button 
                  onClick={() => confirmMockPayment(activeInvoice.id)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white py-3 rounded-xl shadow-md transition-all"
                >
                  Xác nhận tôi đã chuyển khoản thành công
                </button>
                <button 
                  onClick={() => {
                    setShowPaymentSimulator(false);
                    setActiveInvoice(null);
                    triggerNotification('Thanh toán hoãn. Bạn vui lòng hoàn tất trong vòng 15 phút để tránh tự động hủy.', 'error');
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-650 py-3 rounded-xl transition-all"
                >
                  Thanh toán sau
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Admin CRUD Tour Edit/Add Screen */}
      {showTourCrudModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#e6eef0] w-full max-w-xl rounded-3xl shadow-xl overflow-hidden relative animate-scaleIn">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-650 bg-emerald-600" />
            
            <div className="p-6">
              <div className="flex items-center justify-between border-b border-[#f0f6f3] pb-4 mb-4">
                <h3 className="text-base font-extrabold text-slate-800">
                  {crudMode === 'ADD' ? '➕ Khai báo thêm Tour mới' : '✏️ Chỉnh sửa hồ sơ Tour'}
                </h3>
                <button 
                  onClick={() => setShowTourCrudModal(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCrudSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tiêu đề / Tên Tour</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ví dụ: Tour Du Lịch Đà Lạt - Thành Phố Ngàn Hoa"
                    value={crudTitle}
                    onChange={(e) => setCrudTitle(e.target.value)}
                    className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Điểm đến</label>
                    <input 
                      type="text"
                      required
                      placeholder="Ví dụ: Lâm Đồng, Việt Nam"
                      value={crudDestination}
                      onChange={(e) => setCrudDestination(e.target.value)}
                      className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Giá tour (VND)</label>
                    <input 
                      type="number"
                      required
                      placeholder="Ví dụ: 2500000"
                      value={crudPrice}
                      onChange={(e) => setCrudPrice(e.target.value)}
                      className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Ngày khởi hành</label>
                    <input 
                      type="date"
                      required
                      value={crudDepartureDate}
                      onChange={(e) => setCrudDepartureDate(e.target.value)}
                      className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors cursor-pointer text-slate-650"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tổng số vé trống</label>
                    <input 
                      type="number"
                      required
                      min="0"
                      value={crudAvailableSlots}
                      onChange={(e) => setCrudAvailableSlots(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Đường dẫn ảnh bao phủ (URL Image)</label>
                  <input 
                    type="url"
                    placeholder="URL ảnh https://..."
                    value={crudImage}
                    onChange={(e) => setCrudImage(e.target.value)}
                    className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Mô tả lịch trình (Text cụ thể)</label>
                  <textarea 
                    rows="4"
                    required
                    placeholder="Chi tiết chặng đi, các điểm thăm quan, khách sạn ăn uống nghỉ ngơi..."
                    value={crudItinerary}
                    onChange={(e) => setCrudItinerary(e.target.value)}
                    className="w-full bg-[#f8faf9] border border-[#e2ece7] focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs outline-none transition-colors resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-[#f0f6f3]">
                  <button 
                    type="button" 
                    onClick={() => setShowTourCrudModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
                  >
                    Bỏ qua
                  </button>
                  <button 
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all"
                  >
                    Lưu thông tin Tour
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Global minimal footer */}
      <footer className="mt-24 border-t border-[#e6eef0] pt-12 text-center text-xs text-slate-400 space-y-2">
        <div>© 2026 E-Tour Booking System. Cung cấp giải pháp Thương mại Điện tử cao cấp chuẩn quốc tế.</div>
        <div className="flex justify-center space-x-5">
          <a href="#" className="hover:text-emerald-700 transition-colors">Quy định chung</a>
          <a href="#" className="hover:text-emerald-700 transition-colors">Bảo mật thông tin</a>
          <a href="#" className="hover:text-emerald-700 transition-colors">Hotline 1900-ETOUR</a>
        </div>
      </footer>
    </div>
  );
}
