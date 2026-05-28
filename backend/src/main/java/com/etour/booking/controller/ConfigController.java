package com.etour.booking.controller;

import com.etour.booking.entity.SystemConfig;
import com.etour.booking.repository.SystemConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ConfigController {

    @Autowired
    private SystemConfigRepository systemConfigRepository;

    @GetMapping("/config")
    public ResponseEntity<SystemConfig> getConfig() {
        SystemConfig config = systemConfigRepository.findById(1L)
                .orElseGet(() -> {
                    SystemConfig defaultCtx = new SystemConfig();
                    return systemConfigRepository.save(defaultCtx);
                });
        return ResponseEntity.ok(config);
    }

    @PutMapping("/admin/config")
    public ResponseEntity<?> updateConfig(@RequestBody SystemConfig newConfig) {
        SystemConfig config = systemConfigRepository.findById(1L)
                .orElseGet(SystemConfig::new);

        config.setPointRatio(newConfig.getPointRatio());
        config.setSilverThreshold(newConfig.getSilverThreshold());
        config.setSilverDiscount(newConfig.getSilverDiscount());
        config.setGoldThreshold(newConfig.getGoldThreshold());
        config.setGoldDiscount(newConfig.getGoldDiscount());

        SystemConfig saved = systemConfigRepository.save(config);
        return ResponseEntity.ok(saved);
    }
}
