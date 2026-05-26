package com.etour.booking.service;

import com.etour.booking.dto.BookingRequestDTO;
import com.etour.booking.dto.BookingResponseDTO;
import com.etour.booking.dto.RevenueReportDTO;
import com.etour.booking.entity.Booking;
import com.etour.booking.entity.Tour;
import com.etour.booking.repository.BookingRepository;
import com.etour.booking.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private MailService mailService;

    @Autowired
    private PaymentService paymentService;

    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO request) {
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

        // Calculate total price
        BigDecimal totalPrice = tour.getPrice().multiply(BigDecimal.valueOf(request.getTicketsCount()));

        // Create Booking
        Booking booking = new Booking(
                request.getCustomerName(),
                request.getCustomerEmail(),
                request.getCustomerPhone(),
                request.getTicketsCount(),
                totalPrice,
                request.getPaymentMethod(),
                tour
        );

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

        // Dispatch Invoice Email in Background/Simulated
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

        // Restore slots back to Tour if it was not already cancelled
        Tour tour = booking.getTour();
        tour.setAvailableSlots(tour.getAvailableSlots() + booking.getTicketsCount());
        tourRepository.save(tour);

        booking.setStatus("CANCELLED");
        Booking updatedBooking = bookingRepository.save(booking);

        return mapToResponseDTO(updatedBooking);
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
                booking.getTour().getTitle()
        );
    }
}
