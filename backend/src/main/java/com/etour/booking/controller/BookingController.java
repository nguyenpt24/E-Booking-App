package com.etour.booking.controller;

import com.etour.booking.dto.BookingRequestDTO;
import com.etour.booking.dto.BookingResponseDTO;
import com.etour.booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Public / Customer: Create a booking reservation
    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(@Valid @RequestBody BookingRequestDTO request) {
        BookingResponseDTO response = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Public / Customer: Pay booking and retrieve mock payment links (VNPay/MoMo redirection)
    @PostMapping("/{id}/pay")
    public ResponseEntity<Map<String, String>> checkoutBooking(@PathVariable Long id) {
        String paymentLink = bookingService.checkoutBooking(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("paymentUrl", paymentLink);
        
        return ResponseEntity.ok(response);
    }

    // Admin: List all booking reservations
    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // Admin: Confirm booking has been paid manually
    @PutMapping("/{id}/approve")
    public ResponseEntity<BookingResponseDTO> approvePayment(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.approvePayment(id));
    }

    // Admin / Customer: Cancel a reservation (restores available slots)
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponseDTO> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }
}
