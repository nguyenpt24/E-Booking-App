package com.etour.booking.repository;

import com.etour.booking.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {

    // Retrieve active tours only
    List<Tour> findByDeletedFalse();

    // Dynamically filter tours by destination, max price, and departure date
    @Query("SELECT t FROM Tour t WHERE t.deleted = false " +
            "AND (:destination IS NULL OR LOWER(t.destination) LIKE LOWER(CONCAT('%', :destination, '%'))) " +
            "AND (:maxPrice IS NULL OR t.price <= :maxPrice) " +
            "AND (:departureDate IS NULL OR t.departureDate = :departureDate)")
    List<Tour> searchTours(
            @Param("destination") String destination,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("departureDate") LocalDate departureDate
    );
}
