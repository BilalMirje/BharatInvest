package com.bharatinvest.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final GeminiService geminiService;

    @PostMapping("/translate")
    public ResponseEntity<Map<String, String>> translate(@RequestBody Map<String, String> body) {
        String text = body.get("text");
        String language = body.get("language");
        String translated = geminiService.translate(text, language);
        return ResponseEntity.ok(Map.of("translated", translated));
    }
}
