package com.etour.booking.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "system_config")
public class SystemConfig {

    @Id
    private Long id = 1L; // Singleton row key

    private long pointRatio = 100000; // default 100k VND = 1 point
    private int silverThreshold = 1000; // default 1000 points
    private double silverDiscount = 3.0; // default 3%
    private int goldThreshold = 5000; // default 5000 points
    private double goldDiscount = 5.0; // default 5%

    public SystemConfig() {}

    public SystemConfig(long pointRatio, int silverThreshold, double silverDiscount, int goldThreshold, double goldDiscount) {
        this.pointRatio = pointRatio;
        this.silverThreshold = silverThreshold;
        this.silverDiscount = silverDiscount;
        this.goldThreshold = goldThreshold;
        this.goldDiscount = goldDiscount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public long getPointRatio() {
        return pointRatio;
    }

    public void setPointRatio(long pointRatio) {
        this.pointRatio = pointRatio;
    }

    public int getSilverThreshold() {
        return silverThreshold;
    }

    public void setSilverThreshold(int silverThreshold) {
        this.silverThreshold = silverThreshold;
    }

    public double getSilverDiscount() {
        return silverDiscount;
    }

    public void setSilverDiscount(double silverDiscount) {
        this.silverDiscount = silverDiscount;
    }

    public int getGoldThreshold() {
        return goldThreshold;
    }

    public void setGoldThreshold(int goldThreshold) {
        this.goldThreshold = goldThreshold;
    }

    public double getGoldDiscount() {
        return goldDiscount;
    }

    public void setGoldDiscount(double goldDiscount) {
        this.goldDiscount = goldDiscount;
    }
}
