import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import axios from './api/client';
import * as adminService from './services/adminService';

// Import Common Components
import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';
import CartDrawer from './components/CartDrawer';
import FloatingContact from './components/FloatingContact';
import BackToTop from './components/BackToTop';

// Import Views
import HomeView from './views/HomeView';
import ToursCatalogView from './views/ToursCatalogView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import UserProfileView from './views/UserProfileView';
import AdminDashboardView from './views/AdminDashboardView';

// Import Modals
import TourDetailModal from './modals/TourDetailModal';
import CheckoutModal from './modals/CheckoutModal';
import PaymentSimulatorModal from './modals/PaymentSimulatorModal';
import TourCrudModal from './modals/TourCrudModal';
import PointsAdjustModal from './modals/PointsAdjustModal';
import HistoryModal from './modals/HistoryModal';

function AppContent() {
  const {
    activeTab,
    cart,
    setCart,
    fetchTours,
    triggerNotification
  } = useApp();

  // Detail Modal State
  const [selectedTourDetail, setSelectedTourDetail] = useState(null);

  // Checkout Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Payment Simulator State
  const [showPaymentSimulator, setShowPaymentSimulator] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [mockPaymentUrl, setMockPaymentUrl] = useState('');

  // Tour CRUD Modal State
  const [showTourCrudModal, setShowTourCrudModal] = useState(false);
  const [crudMode, setCrudMode] = useState('ADD'); // 'ADD' | 'EDIT'
  const [crudTour, setCrudTour] = useState(null);

  // Points Adjustment Modal State
  const [showPointsAdjustModal, setShowPointsAdjustModal] = useState(false);
  const [adjustingMember, setAdjustingMember] = useState(null);

  // Member History State
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedMemberHistory, setSelectedMemberHistory] = useState([]);

  // Dashboard Refresh Counter
  const [adminRefreshCounter, setAdminRefreshCounter] = useState(0);

  // Checkout flows
  const handleCartCheckoutSubmit = async ({
    checkoutName,
    checkoutEmail,
    checkoutPhone,
    checkoutPaymentMethod
  }) => {
    if (cart.length === 0) return;

    try {
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
      setCart(remainingCart);
      localStorage.setItem('tourCart', JSON.stringify(remainingCart));

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
      setAdminRefreshCounter((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      triggerNotification(err.response?.data?.message || 'Xác nhận thanh toán thất bại!', 'error');
    }
  };

  const handlePaymentSimulatorClose = () => {
    setShowPaymentSimulator(false);
    setActiveInvoice(null);
    triggerNotification(
      'Thanh toán hoãn. Bạn vui lòng hoàn tất trong vòng 15 phút để tránh tự động hủy.',
      'error'
    );
  };

  // Tour CRUD form submission callback
  const handleCrudSubmit = async (payload) => {
    try {
      if (crudMode === 'ADD') {
        await axios.post('/tours', payload);
        triggerNotification('Đã thêm tour mới thành công!');
      } else {
        await axios.put(`/tours/${crudTour.id}`, payload);
        triggerNotification('Đã cập nhật thông tin tour thành công!');
      }

      setShowTourCrudModal(false);
      setCrudTour(null);
      fetchTours();
      setAdminRefreshCounter((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      triggerNotification(err.response?.data?.message || 'Không thể lưu thông tin tour!', 'error');
    }
  };

  const handleAddTourClick = () => {
    setCrudMode('ADD');
    setCrudTour(null);
    setShowTourCrudModal(true);
  };

  const handleEditTourClick = (tour) => {
    setCrudMode('EDIT');
    setCrudTour(tour);
    setShowTourCrudModal(true);
  };

  // Loyalty points updates submission
  const handleAdjustPointsSubmit = async (payload) => {
    if (!adjustingMember) return;
    try {
      await adminService.adjustMemberPoints(adjustingMember.id, payload.pointsChange, payload.reason);
      triggerNotification(`Đã điều chỉnh điểm cho thành viên ${adjustingMember.fullName}!`);
      setShowPointsAdjustModal(false);
      setAdjustingMember(null);
      setAdminRefreshCounter((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      triggerNotification(err.response?.data?.message || 'Không thể điều chỉnh điểm!', 'error');
    }
  };

  const handleAdjustPointsClick = (member) => {
    setAdjustingMember(member);
    setShowPointsAdjustModal(true);
  };

  // Timeline histories logs
  const handleViewHistoryClick = async (member) => {
    try {
      const data = await adminService.getMemberHistory(member.id);
      setSelectedMemberHistory(data);
      setShowHistoryModal(true);
    } catch (err) {
      console.error(err);
      triggerNotification('Không thể tải lịch sử tích điểm của thành viên!', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#1e293b] font-sans antialiased pb-20 selection:bg-emerald-500 selection:text-white">
      {/* Dynamic Toast Alert Notification */}
      <Toast />

      {/* Premium Minimalist Green-White Header Navigation */}
      <Header />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {activeTab === 'home' && <HomeView onViewTourDetails={setSelectedTourDetail} />}

        {activeTab === 'tours-catalog' && (
          <ToursCatalogView onViewTourDetails={setSelectedTourDetail} />
        )}

        {activeTab === 'login' && <LoginView />}

        {activeTab === 'register' && <RegisterView />}

        {activeTab === 'user-profile' && <UserProfileView />}

        {activeTab === 'admin-dashboard' && (
          <AdminDashboardView
            onAddTour={handleAddTourClick}
            onEditTour={handleEditTourClick}
            onAdjustPoints={handleAdjustPointsClick}
            onViewHistory={handleViewHistoryClick}
            refreshCounter={adminRefreshCounter}
          />
        )}
      </main>

      {/* FULL SCREEN MODAL: Tour Itinerary Details */}
      <TourDetailModal tour={selectedTourDetail} onClose={() => setSelectedTourDetail(null)} />

      {/* SLIDE-OVER DRAWER: Shopping Cart Sidebar */}
      <CartDrawer onCheckout={() => setShowCheckoutModal(true)} />

      {/* POPUP MODAL: Checkout / Customer Contact Form */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onSubmitCheckout={handleCartCheckoutSubmit}
      />

      {/* POPUP MODAL: Simulated payment redirect checkout QR code page */}
      <PaymentSimulatorModal
        isOpen={showPaymentSimulator}
        activeInvoice={activeInvoice}
        mockPaymentUrl={mockPaymentUrl}
        onConfirm={confirmMockPayment}
        onClose={handlePaymentSimulatorClose}
      />

      {/* POPUP MODAL: Admin CRUD Tour Edit/Add Screen */}
      <TourCrudModal
        isOpen={showTourCrudModal}
        crudMode={crudMode}
        tour={crudTour}
        onClose={() => {
          setShowTourCrudModal(false);
          setCrudTour(null);
        }}
        onSubmit={handleCrudSubmit}
      />

      {/* POPUP MODAL: Points Adjustment CRM Modal */}
      <PointsAdjustModal
        isOpen={showPointsAdjustModal}
        member={adjustingMember}
        onClose={() => {
          setShowPointsAdjustModal(false);
          setAdjustingMember(null);
        }}
        onSubmit={handleAdjustPointsSubmit}
      />

      {/* POPUP MODAL: Member Point History Audit Log */}
      <HistoryModal
        isOpen={showHistoryModal}
        history={selectedMemberHistory}
        onClose={() => setShowHistoryModal(false)}
      />

      {/* Global minimal footer */}
      <Footer />

      {/* Floating utility widgets (bottom right) */}
      <FloatingContact />
      <BackToTop />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
