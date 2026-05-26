package com.etour.booking.controller;

import com.etour.booking.dto.RevenueReportDTO;
import com.etour.booking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private BookingService bookingService;

    // Retrieve aggregated revenue and booking counts per tour
    @GetMapping("/reports/revenue")
    public ResponseEntity<List<RevenueReportDTO>> getRevenueReport() {
        List<RevenueReportDTO> reports = bookingService.getRevenueReports();
        return ResponseEntity.ok(reports);
    }
}
