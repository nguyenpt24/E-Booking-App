package com.etour.booking.scheduler;

import com.etour.booking.entity.Booking;
import com.etour.booking.repository.BookingRepository;
import com.etour.booking.service.BookingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class BookingCleanupScheduler {

    private static final Logger log = LoggerFactory.getLogger(BookingCleanupScheduler.class);

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingService bookingService;

    /**
     * Runs every 60 seconds to scan and cancel unpaid bookings that exceed the 15-minute window.
     * FixedRate is 60000 ms.
     */
    @Scheduled(fixedRate = 60000)
    public void cleanupUnpaidBookings() {
        LocalDateTime thresholdTime = LocalDateTime.now().minusMinutes(15);
        
        log.info("⏰ Background Scheduler: Quét các hóa đơn PENDING trễ hạn trước {}", thresholdTime);

        // Find all bookings with status "PENDING" created more than 15 minutes ago
        List<Booking> expiredBookings = bookingRepository.findByStatusAndCreatedAtBefore("PENDING", thresholdTime);

        if (!expiredBookings.isEmpty()) {
            log.info("🔔 Tìm thấy {} đơn đặt tour quá hạn 15 phút chưa thanh toán. Tiến hành tự động hủy...", expiredBookings.size());
            
            for (Booking booking : expiredBookings) {
                try {
                    // Reuse the bookingService cancelBooking logic which gracefully updates status to CANCELLED 
                    // and restores availableSlots to the Tour
                    bookingService.cancelBooking(booking.getId());
                    log.info("✅ Tự động hủy đơn hàng ID: #{} thành công. Số chỗ trống đã được hoàn trả.", booking.getId());
                } catch (Exception e) {
                    log.error("❌ Gặp lỗi khi tự động hủy đơn hàng ID: #{} - {}", booking.getId(), e.getMessage());
                }
            }
        }
    }
}
