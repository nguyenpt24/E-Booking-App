package com.etour.booking.controller;

import com.etour.booking.entity.User;
import com.etour.booking.repository.UserRepository;
import com.etour.booking.dto.UserProfileUpdateDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import com.etour.booking.entity.SystemConfig;
import com.etour.booking.repository.SystemConfigRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    @Autowired
    private SystemConfigRepository systemConfigRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin tài khoản!"));

        Map<String, Object> profile = new HashMap<>();
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("fullName", user.getFullName());
        profile.put("phoneNumber", user.getPhoneNumber());
        profile.put("role", user.getRole());
        
        // Supplemental Info
        profile.put("gender", user.getGender());
        profile.put("birthDate", user.getBirthDate() != null ? user.getBirthDate().toString() : null);
        profile.put("cccd", user.getCccd());
        profile.put("cccdIssueDate", user.getCccdIssueDate() != null ? user.getCccdIssueDate().toString() : null);
        profile.put("cccdIssuePlace", user.getCccdIssuePlace());
        profile.put("passport", user.getPassport());
        profile.put("passportIssueDate", user.getPassportIssueDate() != null ? user.getPassportIssueDate().toString() : null);
        profile.put("passportExpiryDate", user.getPassportExpiryDate() != null ? user.getPassportExpiryDate().toString() : null);
        profile.put("address", user.getAddress());
        profile.put("nationality", user.getNationality());

        // Membership Cards metrics
        profile.put("membershipType", user.getMembershipType());
        profile.put("totalToursParticipated", user.getTotalToursParticipated());
        profile.put("totalPointsAccumulated", user.getTotalPointsAccumulated());
        profile.put("currentPoints", user.getCurrentPoints());

        SystemConfig config = systemConfigRepository.findById(1L).orElseGet(SystemConfig::new);
        int pointsNeededToNextLevel = 0;
        if ("BRONZE".equalsIgnoreCase(user.getMembershipType())) {
            pointsNeededToNextLevel = Math.max(0, config.getSilverThreshold() - user.getCurrentPoints());
        } else if ("SILVER".equalsIgnoreCase(user.getMembershipType())) {
            pointsNeededToNextLevel = Math.max(0, config.getGoldThreshold() - user.getCurrentPoints());
        }
        profile.put("pointsNeededToNextLevel", pointsNeededToNextLevel);

        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, String>> updateProfile(
            Principal principal,
            @Valid @RequestBody UserProfileUpdateDTO dto) {
        
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin tài khoản!"));

        // Check if email is already in use by another user
        if (!user.getEmail().equalsIgnoreCase(dto.getEmail()) && userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email này đã được sử dụng bởi tài khoản khác!");
        }

        // Verify password
        if (dto.getOldPassword() == null || dto.getOldPassword().trim().isEmpty()) {
            throw new RuntimeException("Vui lòng cung cấp mật khẩu hiện tại để xác thực thay đổi!");
        }
        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu hiện tại không chính xác!");
        }

        // Update fields
        user.setEmail(dto.getEmail());
        user.setFullName(dto.getFullName());
        user.setPhoneNumber(dto.getPhoneNumber());
        
        // Update new supplemental details
        user.setGender(dto.getGender());
        user.setBirthDate(dto.getBirthDate());
        user.setCccd(dto.getCccd());
        user.setCccdIssueDate(dto.getCccdIssueDate());
        user.setCccdIssuePlace(dto.getCccdIssuePlace());
        user.setPassport(dto.getPassport());
        user.setPassportIssueDate(dto.getPassportIssueDate());
        user.setPassportExpiryDate(dto.getPassportExpiryDate());
        user.setAddress(dto.getAddress());
        user.setNationality(dto.getNationality());

        // Update password if newPassword is provided
        if (dto.getNewPassword() != null && !dto.getNewPassword().trim().isEmpty()) {
            if (dto.getNewPassword().trim().length() < 6) {
                throw new RuntimeException("Mật khẩu mới phải có ít nhất 6 ký tự!");
            }
            user.setPassword(passwordEncoder.encode(dto.getNewPassword().trim()));
        }

        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Cập nhật thông tin cá nhân thành công!");
        response.put("email", user.getEmail());
        return ResponseEntity.ok(response);
    }
}
