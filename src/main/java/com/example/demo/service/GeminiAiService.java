package com.example.demo.service;

import com.example.demo.entity.Transaction;
import com.example.demo.repository.TransactionRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GeminiAiService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final TransactionRepository transactionRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public GeminiAiService(TransactionRepository transactionRepository, ObjectMapper objectMapper) {
        this.transactionRepository = transactionRepository;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newHttpClient();
    }

    public List<Map<String, String>> generateInsightsForUser(Long userId) {
        List<Transaction> transactions = transactionRepository.findByUserIdOrderByDateDesc(userId);
        
        if (transactions.isEmpty()) {
            return List.of(Map.of(
                "id", "no-data",
                "type", "insight",
                "color", "var(--neon-cyan)",
                "title", "Not Enough Data",
                "description", "Add some transactions to get AI-powered financial insights!"
            ));
        }

        // Validate if API key is not set
        if (geminiApiKey == null || geminiApiKey.equals("YOUR_ACTUAL_KEY_HERE") || geminiApiKey.trim().isEmpty()) {
            return List.of(Map.of(
                "id", "no-api-key",
                "type", "alert",
                "color", "var(--neon-pink)",
                "title", "Gemini API Key Missing",
                "description", "Please add your real Gemini API key to application.properties to enable AI insights."
            ));
        }

        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("Here is a list of my recent financial transactions:\n");
        for (int i = 0; i < Math.min(transactions.size(), 50); i++) {
            Transaction t = transactions.get(i);
            promptBuilder.append("- ").append(t.getName())
                         .append(" (").append(t.getCategory()).append("): ")
                         .append(t.getAmount()).append("\n");
        }
        promptBuilder.append("\nPlease thoroughly analyze these transactions and provide exactly 3 highly actionable pieces of financial advice or alerts. ");
        promptBuilder.append("Return ONLY a valid JSON array of objects. ");
        promptBuilder.append("Each object must have the following string keys: 'id' (a unique string), 'type' (choose one of: 'subscription', 'dining', 'alert', 'insight'), ");
        promptBuilder.append("'color' (choose one of: 'var(--neon-violet)', 'var(--neon-magenta)', 'var(--neon-cyan)', '#10b981'), 'title' (a short compelling title), and 'description' (the detailed practical advice).");

        try {
            // Build the JSON request body for Gemini
            String requestBody = objectMapper.writeValueAsString(Map.of(
                "contents", List.of(Map.of(
                    "parts", List.of(Map.of("text", promptBuilder.toString()))
                ))
            ));

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                // Parse the Gemini Response
                JsonNode rootNode = objectMapper.readTree(response.body());
                JsonNode candidates = rootNode.path("candidates");
                if (candidates.isArray() && candidates.size() > 0) {
                    JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
                    String jsonText = textNode.asText().trim();
                    
                    // Robustly extract JSON array part from Markdown if present
                    int startIdx = jsonText.indexOf('[');
                    int endIdx = jsonText.lastIndexOf(']');
                    if (startIdx >= 0 && endIdx >= startIdx) {
                        jsonText = jsonText.substring(startIdx, endIdx + 1);
                    } else {
                        throw new RuntimeException("Could not find a valid JSON array in Gemini response.");
                    }

                    return objectMapper.readValue(jsonText, new TypeReference<List<Map<String, String>>>() {});
                }
            } else {
                System.err.println("Gemini API Error: " + response.body());
                return List.of(Map.of(
                    "id", "api-error",
                    "type", "alert",
                    "color", "var(--neon-pink)",
                    "title", "AI Processing Error",
                    "description", "We couldn't connect to the AI model. Status Code: " + response.statusCode()
                ));
            }

        } catch (Exception e) {
            e.printStackTrace();
            return List.of(Map.of(
                "id", "system-error",
                "type", "alert",
                "color", "var(--neon-pink)",
                "title", "System Error",
                "description", "An error occurred while generating insights: " + e.getMessage()
            ));
        }

        return new ArrayList<>();
    }

    public String chatWithAssistant(Long userId, String userQuery) {
        List<Transaction> transactions = transactionRepository.findByUserIdOrderByDateDesc(userId);
        
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("You are a smart, professional, and friendly financial assistant named Spendora AI.\n");
        promptBuilder.append("The user is asking you a direct question about their finances: \"").append(userQuery).append("\"\n\n");
        promptBuilder.append("Here is their recent transaction history to use as context (if relevant):\n");
        
        for (int i = 0; i < Math.min(transactions.size(), 30); i++) {
            Transaction t = transactions.get(i);
            promptBuilder.append("- ").append(t.getName())
                         .append(" (").append(t.getCategory()).append("): ")
                         .append(t.getAmount()).append("\n");
        }
        promptBuilder.append("\nPlease answer the user's question directly, clearly, and concisely. Use markdown formatting to make your response easy to read.");

        try {
            String requestBody = objectMapper.writeValueAsString(Map.of(
                "contents", List.of(Map.of(
                    "parts", List.of(Map.of("text", promptBuilder.toString()))
                ))
            ));

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode rootNode = objectMapper.readTree(response.body());
                JsonNode candidates = rootNode.path("candidates");
                if (candidates.isArray() && candidates.size() > 0) {
                    JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
                    return textNode.asText().trim();
                }
            } else {
                System.err.println("Gemini Chat API Error: " + response.body());
                return "Error connecting to AI: " + response.statusCode();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "A system error occurred while generating a response: " + e.getMessage();
        }

        return "I'm sorry, I couldn't process your request right now.";
    }
}
