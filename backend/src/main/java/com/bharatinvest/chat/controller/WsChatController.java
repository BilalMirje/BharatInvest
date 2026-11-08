package com.bharatinvest.chat.controller;

import com.bharatinvest.chat.dto.ChatMessageRequest;
import com.bharatinvest.chat.dto.ChatMessageResponse;
import com.bharatinvest.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class WsChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessageRequest request, Principal principal) {
        String email = principal != null ? principal.getName() : "anonymous";
        ChatMessageResponse response = chatService.sendMessage(
                request.getConversationId(), request.getContent(), email);

        messagingTemplate.convertAndSend(
                "/topic/chat/" + request.getConversationId(), response);
    }
}
