package com.etour.booking.controller;

import com.etour.booking.dto.TourDTO;
import com.etour.booking.service.TourService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tours")
@CrossOrigin
public class TourController {

    @Autowired
    private TourService tourService;

    @GetMapping
    public ResponseEntity<List<TourDTO>> getAllTours() {
        return ResponseEntity.ok(tourService.getAllTours());
    }

    @GetMapping("/search")
    public ResponseEntity<List<TourDTO>> searchTours(
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate) {
        return ResponseEntity.ok(tourService.searchTours(destination, maxPrice, departureDate));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourDTO> getTourById(@PathVariable Long id) {
        return ResponseEntity.ok(tourService.getTourById(id));
    }

    @PostMapping
    public ResponseEntity<TourDTO> createTour(@Valid @RequestBody TourDTO dto) {
        TourDTO createdTour = tourService.createTour(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTour);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TourDTO> updateTour(@PathVariable Long id, @Valid @RequestBody TourDTO dto) {
        return ResponseEntity.ok(tourService.updateTour(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {
        tourService.softDeleteTour(id);
        return ResponseEntity.noContent().build();
    }
}
