package com.etour.booking.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/config")
@CrossOrigin
public class ConfigController {

    // Automatically convert based on configured system exchange rate
    @GetMapping("/currency")
    public ResponseEntity<Map<String, Object>> getCurrencyConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("exchangeRate", 25000); // 1 USD = 25,000 VND
        config.put("supportedCurrencies", new String[]{"VND", "USD"});
        return ResponseEntity.ok(config);
    }
}
