package com.etour.booking.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class TourDTO {

    private Long id;

    @NotBlank(message = "Tên tour không được để trống")
    private String title;

    @NotBlank(message = "Điểm đến không được để trống")
    private String destination;

    @NotNull(message = "Giá tour không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá tour phải lớn hơn 0")
    private BigDecimal price;

    @NotNull(message = "Ngày khởi hành không được để trống")
    private LocalDate departureDate;

    @NotBlank(message = "Lịch trình không được để trống")
    private String itinerary;

    @NotNull(message = "Số chỗ trống không được để trống")
    @Min(value = 0, message = "Số chỗ trống không được nhỏ hơn 0")
    private Integer availableSlots;

    private String image;

    public TourDTO() {
    }

    public TourDTO(Long id, String title, String destination, BigDecimal price, LocalDate departureDate, String itinerary, Integer availableSlots, String image) {
        this.id = id;
        this.title = title;
        this.destination = destination;
        this.price = price;
        this.departureDate = departureDate;
        this.itinerary = itinerary;
        this.availableSlots = availableSlots;
        this.image = image;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public LocalDate getDepartureDate() {
        return departureDate;
    }

    public void setDepartureDate(LocalDate departureDate) {
        this.departureDate = departureDate;
    }

    public String getItinerary() {
        return itinerary;
    }

    public void setItinerary(String itinerary) {
        this.itinerary = itinerary;
    }

    public Integer getAvailableSlots() {
        return availableSlots;
    }

    public void setAvailableSlots(Integer availableSlots) {
        this.availableSlots = availableSlots;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
