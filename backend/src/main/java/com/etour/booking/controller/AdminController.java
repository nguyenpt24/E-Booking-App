package com.etour.booking.controller;

import com.etour.booking.dto.RevenueReportDTO;
import com.etour.booking.entity.User;
import com.etour.booking.entity.PointHistory;
import com.etour.booking.repository.UserRepository;
import com.etour.booking.repository.PointHistoryRepository;
import com.etour.booking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PointHistoryRepository pointHistoryRepository;

    // Retrieve aggregated revenue and booking counts per tour
    @GetMapping("/reports/revenue")
    public ResponseEntity<List<RevenueReportDTO>> getRevenueReport() {
        List<RevenueReportDTO> reports = bookingService.getRevenueReports();
        return ResponseEntity.ok(reports);
    }

    // View all users who are customers
    @GetMapping("/members")
    public ResponseEntity<List<User>> getAllMembers() {
        List<User> users = userRepository.findAll().stream()
                .filter(u -> "ROLE_CUSTOMER".equals(u.getRole()))
                .collect(Collectors.toList());
        users.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(users);
    }

    // Manually add/subtract points and update tier
    @PutMapping("/members/{id}/points")
    public ResponseEntity<User> adjustPoints(
            @PathVariable Long id,
            @RequestBody PointsUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thành viên!"));

        int change = request.getPointsChange();
        user.setCurrentPoints(Math.max(0, user.getCurrentPoints() + change));
        if (change > 0) {
            user.setTotalPointsAccumulated(user.getTotalPointsAccumulated() + change);
        }

        // Evaluate Membership Tier
        int pts = user.getCurrentPoints();
        if (pts >= 5000) {
            user.setMembershipType("GOLD");
        } else if (pts >= 1000) {
            user.setMembershipType("SILVER");
        } else {
            user.setMembershipType("BRONZE");
        }

        userRepository.save(user);

        // Record history log
        PointHistory log = new PointHistory(user, change, "Thay đổi thủ công bởi Admin: " + request.getReason());
        pointHistoryRepository.save(log);

        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    // Retrieve point histories for a user
    @GetMapping("/members/{id}/history")
    public ResponseEntity<List<PointHistory>> getMemberHistory(@PathVariable Long id) {
        List<PointHistory> logs = pointHistoryRepository.findByUserIdOrderByCreatedAtDesc(id);
        logs.forEach(l -> l.getUser().setPassword(null));
        return ResponseEntity.ok(logs);
    }

    // DTO for updating points
    public static class PointsUpdateRequest {
        private Integer pointsChange;
        private String reason;

        public PointsUpdateRequest() {
        }

        public Integer getPointsChange() {
            return pointsChange;
        }

        public void setPointsChange(Integer pointsChange) {
            this.pointsChange = pointsChange;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }
}
