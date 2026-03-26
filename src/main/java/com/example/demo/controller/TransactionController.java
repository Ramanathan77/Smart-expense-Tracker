package com.example.demo.controller;

import com.example.demo.entity.Transaction;
import com.example.demo.entity.User;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;
    
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
    public ResponseEntity<List<Transaction>> getUserTransactions(@RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        return ResponseEntity.ok(transactionRepository.findByUserIdOrderByDateDesc(userId));
    }

    @PostMapping
    public ResponseEntity<Transaction> addTransaction(@RequestHeader("Authorization") String authHeader, @RequestBody Transaction tx) {
        Long userId = getUserIdFromToken(authHeader);
        tx.setUserId(userId);
        if(tx.getWalletType() == null || tx.getWalletType().isEmpty()) tx.setWalletType("Cash");
        if(tx.getDate() == null) tx.setDate(java.time.LocalDateTime.now());
        return ResponseEntity.ok(transactionRepository.save(tx));
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<Transaction>> addBulkTransactions(@RequestHeader("Authorization") String authHeader, @RequestBody Map<String, List<Transaction>> payload) {
        Long userId = getUserIdFromToken(authHeader);
        List<Transaction> transactions = payload.get("transactions");
        for (Transaction tx : transactions) {
            tx.setUserId(userId);
            if(tx.getWalletType() == null || tx.getWalletType().isEmpty()) tx.setWalletType("Cash");
            if(tx.getDate() == null) tx.setDate(java.time.LocalDateTime.now());
        }
        return ResponseEntity.ok(transactionRepository.saveAll(transactions));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@RequestHeader("Authorization") String authHeader, @PathVariable Long id) {
        Long userId = getUserIdFromToken(authHeader);
        Transaction tx = transactionRepository.findById(id).orElse(null);
        if (tx == null) return ResponseEntity.status(404).body(Map.of("msg", "Not found"));
        if (!tx.getUserId().equals(userId)) return ResponseEntity.status(401).body(Map.of("msg", "Not authorized"));
        
        transactionRepository.delete(tx);
        return ResponseEntity.ok(Map.of("msg", "Deleted"));
    }
}
