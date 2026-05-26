package com.etour.booking.repository;

import com.etour.booking.dto.RevenueReportDTO;
import com.etour.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Retrieve expired bookings for background cleanup
    List<Booking> findByStatusAndCreatedAtBefore(String status, LocalDateTime thresholdTime);

    // Retrieve aggregated revenue reports for Admin dashboards
    @Query("SELECT new com.etour.booking.dto.RevenueReportDTO(b.tour.title, SUM(b.totalPrice), COUNT(b.id)) " +
           "FROM Booking b " +
           "WHERE b.status = 'PAID' " +
           "GROUP BY b.tour.title")
    List<RevenueReportDTO> getRevenueReport();
}
