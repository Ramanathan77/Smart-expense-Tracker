package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.GeminiAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/insights")
public class InsightController {

    @Autowired
    private GeminiAiService geminiAiService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;

    private Long getUserIdFromToken(String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);
        User user = userRepository.findByEmail(email).orElseThrow();
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<List<Map<String, String>>> getInsights(@RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        List<Map<String, String>> insights = geminiAiService.generateInsightsForUser(userId);
        return ResponseEntity.ok(insights);
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestHeader("Authorization") String authHeader, @RequestBody Map<String, String> payload) {
        Long userId = getUserIdFromToken(authHeader);
        String query = payload.get("query");
        String response = geminiAiService.chatWithAssistant(userId, query);
        return ResponseEntity.ok(Map.of("message", response));
    }
}
