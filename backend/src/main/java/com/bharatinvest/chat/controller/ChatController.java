package com.bharatinvest.chat.controller;

import com.bharatinvest.chat.dto.ChatMessageResponse;
import com.bharatinvest.chat.dto.ConversationResponse;
import com.bharatinvest.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping
    public ResponseEntity<List<ConversationResponse>> myConversations(Authentication auth) {
        return ResponseEntity.ok(chatService.getMyConversations(auth.getName()));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<ChatMessageResponse>> getMessages(@PathVariable Long id) {
        return ResponseEntity.ok(chatService.getMessages(id));
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        return ResponseEntity.ok(chatService.sendMessage(id, body.get("content"), auth.getName()));
    }
}
