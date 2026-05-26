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

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    public ResponseEntity<Map<String, String>> getProfile(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin tài khoản!"));

        Map<String, String> profile = new HashMap<>();
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("role", user.getRole());
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

        // Update email
        user.setEmail(dto.getEmail());

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
