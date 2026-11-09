package com.bharatinvest.ai;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class GeminiService {

    @Value("${app.gemini.api-key}")
    private String apiKey;

    @Value("${app.gemini.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    public String analyzePitch(String videoUrl, String businessName, String businessDescription, Double askAmount) {
        String prompt = String.format("""
                You are an expert startup pitch analyst. A founder has uploaded a pitch video for their startup.
                
                Business: %s
                Description: %s
                Asking: ₹%.0f
                Video URL: %s
                
                Based on the business details, provide a comprehensive pitch analysis in the following JSON format:
                {
                    "overallScore": <1-10>,
                    "strengths": ["strength1", "strength2"],
                    "improvements": ["improvement1", "improvement2", "improvement3"],
                    "investorQuestions": ["question1", "question2", "question3"],
                    "investorPerspective": "What investors typically look for in this type of business...",
                    "pitchTips": ["tip1", "tip2", "tip3"],
                    "marketInsights": "Brief market analysis and potential...",
                    "summary": "Overall summary of the pitch quality and recommendations",
                    "financialData": {
                        "revenue": [{"label": "Year 1", "value": 0}, {"label": "Year 2", "value": 0}],
                        "profit": [{"label": "Year 1", "value": 0}, {"label": "Year 2", "value": 0}],
                        "unitEconomics": {"cac": 0, "ltv": 0, "margin": 0},
                        "notes": "Brief note about the financial outlook"
                    }
                }
                
                For financialData: estimate realistic numbers based on the business type, asking amount, and description.
                If the founder mentions specific numbers, use those. Revenue and profit arrays should have 3-5 entries
                for projected years. CAC = customer acquisition cost, LTV = lifetime value, margin = profit margin percentage.
                
                Be specific, constructive, and actionable. Think like a Shark Tank investor.
                Return ONLY valid JSON, no markdown formatting.
                """, businessName, businessDescription, askAmount, videoUrl);

        try {
            String url = String.format(
                    "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                    model, apiKey);

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(Map.of(
                            "parts", List.of(Map.of("text", prompt))
                    )),
                    "generationConfig", Map.of(
                            "temperature", 0.7,
                            "maxOutputTokens", 2048
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.POST,
                    new HttpEntity<>(requestBody, headers),
                    Map.class);

            if (response.getBody() != null) {
                List<Map<String, Object>> candidates =
                        (List<Map<String, Object>>) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    String text = (String) parts.get(0).get("text");
                    text = text.trim();
                    if (text.startsWith("```json")) {
                        text = text.substring(7);
                    } else if (text.startsWith("```")) {
                        text = text.substring(3);
                    }
                    if (text.endsWith("```")) {
                        text = text.substring(0, text.length() - 3);
                    }
                    return text.trim();
                }
            }
            return "{\"error\": \"Could not analyze pitch. Please try again.\"}";
        } catch (Exception e) {
            log.error("Gemini API error: {}", e.getMessage());
            return "{\"error\": \"AI service temporarily unavailable. Please try again later.\"}";
        }
    }

    public String translate(String text, String targetLanguage) {
        String prompt = String.format("""
                Translate the following text to %s.
                Keep all section markers like [SUMMARY], [STRENGTHS] etc exactly as they are — do NOT translate the markers.
                Translate only the text content after each marker.
                Return ONLY the translated text, nothing else.
                
                Text to translate:
                %s
                """, targetLanguage, text);

        try {
            String url = String.format(
                    "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                    model, apiKey);

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(Map.of(
                            "parts", List.of(Map.of("text", prompt))
                    )),
                    "generationConfig", Map.of(
                            "temperature", 0.3,
                            "maxOutputTokens", 4096
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.POST,
                    new HttpEntity<>(requestBody, headers),
                    Map.class);

            if (response.getBody() != null) {
                List<Map<String, Object>> candidates =
                        (List<Map<String, Object>>) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    return ((String) parts.get(0).get("text")).trim();
                }
            }
            return text;
        } catch (Exception e) {
            log.error("Translation error: {}", e.getMessage());
            return text;
        }
    }
}
