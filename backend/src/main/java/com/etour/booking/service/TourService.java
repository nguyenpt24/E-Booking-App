package com.etour.booking.service;

import com.etour.booking.dto.TourDTO;
import com.etour.booking.entity.Tour;
import com.etour.booking.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TourService {

    @Autowired
    private TourRepository tourRepository;

    public List<TourDTO> getAllTours() {
        return tourRepository.findByDeletedFalse().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<TourDTO> searchTours(String destination, BigDecimal maxPrice, LocalDate departureDate) {
        // Handle empty strings as null to align JPQL conditions
        String destQuery = (destination != null && !destination.trim().isEmpty()) ? destination.trim() : null;
        return tourRepository.searchTours(destQuery, maxPrice, departureDate).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TourDTO getTourById(Long id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tour du lịch với ID: " + id));
        if (Boolean.TRUE.equals(tour.getDeleted())) {
            throw new RuntimeException("Tour du lịch này đã bị xóa hoặc không còn tồn tại!");
        }
        return mapToDTO(tour);
    }

    @Transactional
    public TourDTO createTour(TourDTO dto) {
        Tour tour = new Tour(
                dto.getTitle(),
                dto.getDestination(),
                dto.getPrice(),
                dto.getDepartureDate(),
                dto.getItinerary(),
                dto.getAvailableSlots(),
                dto.getImage(),
                dto.getDiscountPercent()
        );
        Tour savedTour = tourRepository.save(tour);
        return mapToDTO(savedTour);
    }

    @Transactional
    public TourDTO updateTour(Long id, TourDTO dto) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tour du lịch với ID: " + id));
        
        if (Boolean.TRUE.equals(tour.getDeleted())) {
            throw new RuntimeException("Không thể chỉnh sửa tour đã bị xóa!");
        }

        tour.setTitle(dto.getTitle());
        tour.setDestination(dto.getDestination());
        tour.setPrice(dto.getPrice());
        tour.setDepartureDate(dto.getDepartureDate());
        tour.setItinerary(dto.getItinerary());
        tour.setAvailableSlots(dto.getAvailableSlots());
        tour.setImage(dto.getImage());
        tour.setDiscountPercent(dto.getDiscountPercent());

        Tour updatedTour = tourRepository.save(tour);
        return mapToDTO(updatedTour);
    }

    @Transactional
    public void softDeleteTour(Long id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tour du lịch với ID: " + id));
        tour.setDeleted(true);
        tourRepository.save(tour);
    }

    // Entity to DTO Helper Mapping
    public TourDTO mapToDTO(Tour tour) {
        return new TourDTO(
                tour.getId(),
                tour.getTitle(),
                tour.getDestination(),
                tour.getPrice(),
                tour.getDepartureDate(),
                tour.getItinerary(),
                tour.getAvailableSlots(),
                tour.getImage(),
                tour.getDiscountPercent()
        );
    }
}
