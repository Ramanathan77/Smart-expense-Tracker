package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/insights")
public class InsightController {

    @GetMapping
    public ResponseEntity<List<Map<String, String>>> getInsights() {
        return ResponseEntity.ok(List.of(
            Map.of("title", "Spending Alert", "description", "You are spending 40% more on Food this month compared to last month. Consider cutting down on dining out to stay within your goal.")
        ));
    }
}
