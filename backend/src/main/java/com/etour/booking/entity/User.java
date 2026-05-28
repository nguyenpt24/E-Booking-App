package com.etour.booking.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String role; // e.g., ROLE_CUSTOMER, ROLE_ADMIN

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "phone_number")
    private String phoneNumber;

    // Supplemental Personal Information
    private String gender;

    @Column(name = "birth_date")
    private java.time.LocalDate birthDate;

    private String cccd;

    @Column(name = "cccd_issue_date")
    private java.time.LocalDate cccdIssueDate;

    @Column(name = "cccd_issue_place")
    private String cccdIssuePlace;

    private String passport;

    @Column(name = "passport_issue_date")
    private java.time.LocalDate passportIssueDate;

    @Column(name = "passport_expiry_date")
    private java.time.LocalDate passportExpiryDate;

    private String address;

    private String nationality;

    // Membership Fields
    @Column(name = "membership_type")
    private String membershipType = "BRONZE";

    @Column(name = "total_tours_participated")
    private Integer totalToursParticipated = 0;

    @Column(name = "total_points_accumulated")
    private Integer totalPointsAccumulated = 0;

    @Column(name = "current_points")
    private Integer currentPoints = 0;

    public User() {
    }

    public User(String username, String password, String email, String role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.membershipType = "BRONZE";
        this.totalToursParticipated = 0;
        this.totalPointsAccumulated = 0;
        this.currentPoints = 0;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public java.time.LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(java.time.LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getCccd() {
        return cccd;
    }

    public void setCccd(String cccd) {
        this.cccd = cccd;
    }

    public java.time.LocalDate getCccdIssueDate() {
        return cccdIssueDate;
    }

    public void setCccdIssueDate(java.time.LocalDate cccdIssueDate) {
        this.cccdIssueDate = cccdIssueDate;
    }

    public String getCccdIssuePlace() {
        return cccdIssuePlace;
    }

    public void setCccdIssuePlace(String cccdIssuePlace) {
        this.cccdIssuePlace = cccdIssuePlace;
    }

    public String getPassport() {
        return passport;
    }

    public void setPassport(String passport) {
        this.passport = passport;
    }

    public java.time.LocalDate getPassportIssueDate() {
        return passportIssueDate;
    }

    public void setPassportIssueDate(java.time.LocalDate passportIssueDate) {
        this.passportIssueDate = passportIssueDate;
    }

    public java.time.LocalDate getPassportExpiryDate() {
        return passportExpiryDate;
    }

    public void setPassportExpiryDate(java.time.LocalDate passportExpiryDate) {
        this.passportExpiryDate = passportExpiryDate;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getMembershipType() {
        return membershipType != null ? membershipType : "BRONZE";
    }

    public void setMembershipType(String membershipType) {
        this.membershipType = membershipType;
    }

    public Integer getTotalToursParticipated() {
        return totalToursParticipated != null ? totalToursParticipated : 0;
    }

    public void setTotalToursParticipated(Integer totalToursParticipated) {
        this.totalToursParticipated = totalToursParticipated;
    }

    public Integer getTotalPointsAccumulated() {
        return totalPointsAccumulated != null ? totalPointsAccumulated : 0;
    }

    public void setTotalPointsAccumulated(Integer totalPointsAccumulated) {
        this.totalPointsAccumulated = totalPointsAccumulated;
    }

    public Integer getCurrentPoints() {
        return currentPoints != null ? currentPoints : 0;
    }

    public void setCurrentPoints(Integer currentPoints) {
        this.currentPoints = currentPoints;
    }
}
