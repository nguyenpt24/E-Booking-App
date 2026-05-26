package com.etour.booking.dto;

import java.math.BigDecimal;

public class RevenueReportDTO {

    private String tourTitle;
    private BigDecimal revenue;
    private Long bookingsCount;

    public RevenueReportDTO() {
    }

    public RevenueReportDTO(String tourTitle, BigDecimal revenue, Long bookingsCount) {
        this.tourTitle = tourTitle;
        this.revenue = revenue;
        this.bookingsCount = bookingsCount;
    }

    // Getters and Setters
    public String getTourTitle() {
        return tourTitle;
    }

    public void setTourTitle(String tourTitle) {
        this.tourTitle = tourTitle;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public Long getBookingsCount() {
        return bookingsCount;
    }

    public void setBookingsCount(Long bookingsCount) {
        this.bookingsCount = bookingsCount;
    }
}
