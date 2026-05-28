import React, { createContext, useContext, useState, useEffect } from 'react';
import * as tourService from '../services/tourService';
import * as userService from '../services/userService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication & Session States
  const [token, setToken] = useState(localStorage.getItem('jwtToken') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  // Navigation State: 'home' | 'tours-catalog' | 'login' | 'register' | 'admin-dashboard' | 'user-profile'
  const [activeTab, setActiveTab] = useState('home');

  // Currency Converter State
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'VND');
  const exchangeRate = 25000;

  // Shopping Cart States
  const [cart, setCart] = useState([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  // Notification Toast State
  const [notification, setNotification] = useState(null);
  const [toastKey, setToastKey] = useState(0);

  // Profile Cache States
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Customer Catalog States
  const [tours, setTours] = useState([]);
  const [loadingTours, setLoadingTours] = useState(false);
  const [searchDest, setSearchDest] = useState('');
  const [searchMaxPrice, setSearchMaxPrice] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Auto-dismiss Alerts Utility
  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setToastKey((prev) => prev + 1);
    setTimeout(() => setNotification(null), 2500);
  };

  // Price Formatters
  const formatPrice = (priceVND) => {
    if (currency === 'USD') {
      const converted = priceVND / exchangeRate;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(converted);
    }
    return new Intl.NumberFormat('vi-VN').format(priceVND) + ' đ';
  };

  const getBookingPromoPrice = (tour) => {
    let price = tour.price;
    if (tour.discountPercent > 0) {
      price = (price * (100 - tour.discountPercent)) / 100;
    }
    return price;
  };

  const getBookingFinalPrice = (tour, count) => {
    let base = getBookingPromoPrice(tour) * count;
    if (userProfile && tour.discountPercent > 0) {
      if (userProfile.membershipType === 'SILVER') {
        base = base * 0.97;
      } else if (userProfile.membershipType === 'GOLD') {
        base = base * 0.95;
      }
    }
    return Math.round(base);
  };

  const handleCurrencyChange = (newCurr) => {
    setCurrency(newCurr);
    localStorage.setItem('currency', newCurr);
    triggerNotification(`Đã chuyển đổi tiền tệ sang ${newCurr}`);
  };

  // Fetch Public/Filtered Tours
  const fetchTours = async (isSearch = false) => {
    setLoadingTours(true);
    try {
      let data;
      if (isSearch) {
        data = await tourService.searchTours({
          destination: searchDest,
          maxPrice: searchMaxPrice,
          departureDate: searchDate
        });
      } else {
        data = await tourService.getTours();
      }
      setTours(data);
    } catch (err) {
      console.error(err);
      triggerNotification(
        err.response?.data?.message || 'Không thể tải danh sách tour du lịch!',
        'error'
      );
    } finally {
      setLoadingTours(false);
    }
  };

  // Fetch User Profile
  const fetchUserProfile = async () => {
    if (!token) return;
    setProfileLoading(true);
    try {
      const data = await userService.getUserProfile();
      setUserProfile(data);
    } catch (err) {
      console.error(err);
      triggerNotification(
        err.response?.data?.message || 'Không thể lấy thông tin tài khoản!',
        'error'
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // Persist Cart
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('tourCart', JSON.stringify(newCart));
  };

  // Cart Operations
  const addToCart = (tour, count = 1) => {
    if (!token) {
      triggerNotification('Vui lòng đăng nhập tài khoản thành viên để chọn/đặt tour!', 'error');
      setActiveTab('login');
      return;
    }
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
    return cart.reduce(
      (total, item) => total + getBookingFinalPrice(item.tour, item.ticketsCount),
      0
    );
  };

  // Auth Operations
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setToken('');
    setUsername('');
    setRole('');
    setUserProfile(null);
    setActiveTab('home');
    triggerNotification('Đã đăng xuất tài khoản an toàn!');
  };

  // View catalog reset
  const handleViewAllTours = () => {
    setSearchDest('');
    setSearchMaxPrice('');
    setSearchDate('');
    fetchTours(false);
    setActiveTab('tours-catalog');
  };

  // Initialize
  useEffect(() => {
    fetchTours();
    const storedCart = localStorage.getItem('tourCart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        localStorage.removeItem('tourCart');
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [token]);

  return (
    <AppContext.Provider
      value={{
        token,
        setToken,
        username,
        setUsername,
        role,
        setRole,
        activeTab,
        setActiveTab,
        currency,
        setCurrency,
        exchangeRate,
        formatPrice,
        getBookingPromoPrice,
        getBookingFinalPrice,
        handleCurrencyChange,
        cart,
        setCart,
        showCartDrawer,
        setShowCartDrawer,
        notification,
        setNotification,
        toastKey,
        setToastKey,
        triggerNotification,
        userProfile,
        setUserProfile,
        profileLoading,
        fetchUserProfile,
        tours,
        setTours,
        loadingTours,
        setLoadingTours,
        searchDest,
        setSearchDest,
        searchMaxPrice,
        setSearchMaxPrice,
        searchDate,
        setSearchDate,
        activeCategory,
        setActiveCategory,
        fetchTours,
        addToCart,
        updateCartCount,
        removeFromCart,
        clearCart,
        getCartTotal,
        handleLogout,
        handleViewAllTours
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
