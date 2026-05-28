package com.etour.booking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class UserProfileUpdateDTO {

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String phoneNumber;

    @NotBlank(message = "Mật khẩu hiện tại không được để trống")
    private String oldPassword;

    private String newPassword; // Optional, only changed if not empty

    private String gender;

    private java.time.LocalDate birthDate;

    private String cccd;

    private java.time.LocalDate cccdIssueDate;

    private String cccdIssuePlace;

    private String passport;

    private java.time.LocalDate passportIssueDate;

    private java.time.LocalDate passportExpiryDate;

    private String address;

    private String nationality;

    public UserProfileUpdateDTO() {
    }

    public UserProfileUpdateDTO(String email, String fullName, String phoneNumber, String oldPassword, String newPassword) {
        this.email = email;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
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
}
