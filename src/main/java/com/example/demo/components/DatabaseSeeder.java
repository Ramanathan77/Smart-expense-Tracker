package com.example.demo.controller;

import com.example.demo.entity.Transaction;
import com.example.demo.entity.User;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        User bob = userRepository.findByEmail("bob@gmail.com").orElseGet(() -> {
            User newBob = new User();
            newBob.setName("Bob");
            newBob.setEmail("bob@gmail.com");
            newBob.setPassword(passwordEncoder.encode("password123"));
            return userRepository.save(newBob);
        });

        if (transactionRepository.findByUserIdOrderByDateDesc(bob.getId()).isEmpty()) {
            Transaction t1 = new Transaction(); t1.setUserId(bob.getId()); t1.setName("Monthly Salary"); t1.setCategory("Other"); t1.setAmount(new BigDecimal("5000.00")); t1.setWalletType("Bank Account"); t1.setDate(LocalDateTime.now().minusDays(15));
            Transaction t2 = new Transaction(); t2.setUserId(bob.getId()); t2.setName("Groceries"); t2.setCategory("Food"); t2.setAmount(new BigDecimal("-150.00")); t2.setWalletType("Credit Card"); t2.setDate(LocalDateTime.now().minusDays(5));
            Transaction t3 = new Transaction(); t3.setUserId(bob.getId()); t3.setName("Netflix"); t3.setCategory("Shopping"); t3.setAmount(new BigDecimal("-15.99")); t3.setWalletType("Credit Card"); t3.setDate(LocalDateTime.now().minusDays(2));
            Transaction t4 = new Transaction(); t4.setUserId(bob.getId()); t4.setName("Uber"); t4.setCategory("Transport"); t4.setAmount(new BigDecimal("-25.50")); t4.setWalletType("Cash"); t4.setDate(LocalDateTime.now().minusDays(1));
            Transaction t5 = new Transaction(); t5.setUserId(bob.getId()); t5.setName("Gym Membership"); t5.setCategory("Other"); t5.setAmount(new BigDecimal("-40.00")); t5.setWalletType("Bank Account"); t5.setDate(LocalDateTime.now());
            
            transactionRepository.saveAll(List.of(t1, t2, t3, t4, t5));
            System.out.println("Seeded Bob's account with beautifully structured demo transactions!");
        }
    }
}
