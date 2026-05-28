package com.etour.booking.service;

import com.etour.booking.dto.BookingRequestDTO;
import com.etour.booking.dto.BookingResponseDTO;
import com.etour.booking.dto.RevenueReportDTO;
import com.etour.booking.entity.Booking;
import com.etour.booking.entity.Tour;
import com.etour.booking.entity.User;
import com.etour.booking.entity.PointHistory;
import com.etour.booking.repository.BookingRepository;
import com.etour.booking.repository.TourRepository;
import com.etour.booking.repository.UserRepository;
import com.etour.booking.repository.PointHistoryRepository;
import com.etour.booking.entity.SystemConfig;
import com.etour.booking.repository.SystemConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private SystemConfigRepository systemConfigRepository;

    private SystemConfig getSystemConfig() {
        return systemConfigRepository.findById(1L).orElseGet(SystemConfig::new);
    }

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PointHistoryRepository pointHistoryRepository;

    @Autowired
    private MailService mailService;

    @Autowired
    private PaymentService paymentService;

    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO request) {
        return createBooking(request, null);
    }

    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO request, String username) {
        // Fetch Tour with lock/transaction safety
        Tour tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tour du lịch yêu cầu!"));

        if (Boolean.TRUE.equals(tour.getDeleted())) {
            throw new RuntimeException("Tour du lịch này không còn kinh doanh hoặc đã bị xóa!");
        }

        // Concurrency Slot Check
        if (tour.getAvailableSlots() < request.getTicketsCount()) {
            throw new RuntimeException("Xin lỗi, tour chỉ còn lại " + tour.getAvailableSlots() + " chỗ trống. Không đủ cho " + request.getTicketsCount() + " vé đặt!");
        }

        // Base price calculation (taking tour discount into account if there is any promotion)
        BigDecimal basePrice = tour.getPrice();
        if (tour.getDiscountPercent() > 0) {
            BigDecimal multiplier = BigDecimal.valueOf(100 - tour.getDiscountPercent());
            basePrice = basePrice.multiply(multiplier).divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
        }

        BigDecimal originalPriceSum = basePrice.multiply(BigDecimal.valueOf(request.getTicketsCount()));
        BigDecimal finalPrice = originalPriceSum;
        BigDecimal discountAmount = BigDecimal.ZERO;

        User user = null;
        if (username != null && !username.trim().isEmpty()) {
            user = userRepository.findByUsername(username).orElse(null);
        }

        // If user is logged in, apply their membership discount if the tour has a promotion (tour.discountPercent > 0)
        if (user != null && tour.getDiscountPercent() > 0) {
            SystemConfig config = getSystemConfig();
            if ("SILVER".equalsIgnoreCase(user.getMembershipType())) {
                BigDecimal discount = originalPriceSum.multiply(BigDecimal.valueOf(config.getSilverDiscount())).divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
                discountAmount = discount;
                finalPrice = originalPriceSum.subtract(discount);
            } else if ("GOLD".equalsIgnoreCase(user.getMembershipType())) {
                BigDecimal discount = originalPriceSum.multiply(BigDecimal.valueOf(config.getGoldDiscount())).divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
                discountAmount = discount;
                finalPrice = originalPriceSum.subtract(discount);
            }
        }

        // Create Booking
        Booking booking = new Booking(
                request.getCustomerName(),
                request.getCustomerEmail(),
                request.getCustomerPhone(),
                request.getTicketsCount(),
                finalPrice,
                request.getPaymentMethod(),
                tour
        );

        if (user != null) {
            booking.setUser(user);
        }
        booking.setDiscountAmount(discountAmount);

        // Deduct slots from Tour
        tour.setAvailableSlots(tour.getAvailableSlots() - request.getTicketsCount());
        
        tourRepository.save(tour);
        Booking savedBooking = bookingRepository.save(booking);

        return mapToResponseDTO(savedBooking);
    }

    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponseDTO approvePayment(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đặt vé với ID: " + id));

        if ("PAID".equals(booking.getStatus())) {
            throw new RuntimeException("Đơn hàng này đã được xác nhận thanh toán trước đó!");
        }
        if ("CANCELLED".equals(booking.getStatus())) {
            throw new RuntimeException("Không thể duyệt thanh toán cho đơn hàng đã bị hủy!");
        }

        booking.setStatus("PAID");
        Booking updatedBooking = bookingRepository.save(booking);

        User user = booking.getUser();
        if (user != null) {
            SystemConfig config = getSystemConfig();
            int pointsEarned = booking.getTotalPrice().divide(BigDecimal.valueOf(config.getPointRatio()), 0, RoundingMode.DOWN).intValue();
            if (pointsEarned > 0) {
                user.setCurrentPoints(user.getCurrentPoints() + pointsEarned);
                user.setTotalPointsAccumulated(user.getTotalPointsAccumulated() + pointsEarned);
                user.setTotalToursParticipated(user.getTotalToursParticipated() + 1);
                
                updateUserMembershipTier(user);

                // Log point history
                PointHistory log = new PointHistory(user, pointsEarned, "Tích lũy từ đơn đặt tour #" + booking.getId() + " (" + booking.getTour().getTitle() + ")");
                pointHistoryRepository.save(log);
            } else {
                user.setTotalToursParticipated(user.getTotalToursParticipated() + 1);
                userRepository.save(user);
            }
        }

        // Dispatch Invoice Email
        mailService.sendBookingConfirmationEmail(updatedBooking);

        return mapToResponseDTO(updatedBooking);
    }

    @Transactional
    public BookingResponseDTO cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đặt vé với ID: " + id));

        if ("CANCELLED".equals(booking.getStatus())) {
            throw new RuntimeException("Đơn hàng này đã được hủy trước đó!");
        }

        boolean wasPaid = "PAID".equals(booking.getStatus());

        // Restore slots back to Tour
        Tour tour = booking.getTour();
        tour.setAvailableSlots(tour.getAvailableSlots() + booking.getTicketsCount());
        tourRepository.save(tour);

        booking.setStatus("CANCELLED");
        Booking updatedBooking = bookingRepository.save(booking);

        User user = booking.getUser();
        if (user != null && wasPaid) {
            SystemConfig config = getSystemConfig();
            int pointsDeducted = booking.getTotalPrice().divide(BigDecimal.valueOf(config.getPointRatio()), 0, RoundingMode.DOWN).intValue();
            user.setTotalToursParticipated(Math.max(0, user.getTotalToursParticipated() - 1));
            if (pointsDeducted > 0) {
                user.setCurrentPoints(Math.max(0, user.getCurrentPoints() - pointsDeducted));
                updateUserMembershipTier(user);

                // Log points deduction
                PointHistory log = new PointHistory(user, -pointsDeducted, "Hủy tích lũy do hủy đơn đặt tour #" + booking.getId());
                pointHistoryRepository.save(log);
            } else {
                userRepository.save(user);
            }
        }

        return mapToResponseDTO(updatedBooking);
    }

    private void updateUserMembershipTier(User user) {
        SystemConfig config = getSystemConfig();
        int pts = user.getCurrentPoints();
        if (pts >= config.getGoldThreshold()) {
            user.setMembershipType("GOLD");
        } else if (pts >= config.getSilverThreshold()) {
            user.setMembershipType("SILVER");
        } else {
            user.setMembershipType("BRONZE");
        }
        userRepository.save(user);
    }

    public String checkoutBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng cần thanh toán!"));
        
        if (!"PENDING".equals(booking.getStatus())) {
            throw new RuntimeException("Đơn hàng không nằm ở trạng thái chờ thanh toán!");
        }
        
        return paymentService.generatePaymentLink(booking);
    }

    public List<RevenueReportDTO> getRevenueReports() {
        return bookingRepository.getRevenueReport();
    }

    // Entity to DTO Conversion Helper
    private BookingResponseDTO mapToResponseDTO(Booking booking) {
        return new BookingResponseDTO(
                booking.getId(),
                booking.getCustomerName(),
                booking.getCustomerEmail(),
                booking.getCustomerPhone(),
                booking.getTicketsCount(),
                booking.getTotalPrice(),
                booking.getStatus(),
                booking.getPaymentMethod(),
                booking.getCreatedAt(),
                booking.getTour().getId(),
                booking.getTour().getTitle(),
                booking.getDiscountAmount(),
                booking.getUser() != null ? booking.getUser().getUsername() : null
        );
    }
}
