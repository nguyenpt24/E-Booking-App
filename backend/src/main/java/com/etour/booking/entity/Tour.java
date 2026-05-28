package com.etour.booking.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "tours")
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "departure_date", nullable = false)
    private LocalDate departureDate;

    @Column(columnDefinition = "TEXT")
    private String itinerary;

    @Column(name = "available_slots", nullable = false)
    private Integer availableSlots;

    @Column(length = 1000)
    private String image;

    @Column(nullable = false)
    private Boolean deleted = false; // Soft delete flag

    @Column(name = "discount_percent")
    private Integer discountPercent = 0;

    public Tour() {
    }

    public Tour(String title, String destination, BigDecimal price, LocalDate departureDate, String itinerary, Integer availableSlots, String image) {
        this.title = title;
        this.destination = destination;
        this.price = price;
        this.departureDate = departureDate;
        this.itinerary = itinerary;
        this.availableSlots = availableSlots;
        this.image = image;
        this.deleted = false;
        this.discountPercent = 0;
    }

    public Tour(String title, String destination, BigDecimal price, LocalDate departureDate, String itinerary, Integer availableSlots, String image, Integer discountPercent) {
        this.title = title;
        this.destination = destination;
        this.price = price;
        this.departureDate = departureDate;
        this.itinerary = itinerary;
        this.availableSlots = availableSlots;
        this.image = image;
        this.deleted = false;
        this.discountPercent = discountPercent != null ? discountPercent : 0;
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

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

    public Integer getDiscountPercent() {
        return discountPercent != null ? discountPercent : 0;
    }

    public void setDiscountPercent(Integer discountPercent) {
        this.discountPercent = discountPercent != null ? discountPercent : 0;
    }
}
