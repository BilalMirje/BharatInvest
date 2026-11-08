package com.bharatinvest.chat.dto;

import com.bharatinvest.chat.entity.ChatMessage;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessageResponse {
    private Long id;
    private Long conversationId;
    private Long senderId;
    private String senderName;
    private String content;
    private LocalDateTime sentAt;
    private boolean read;

    public static ChatMessageResponse from(ChatMessage m) {
        ChatMessageResponse r = new ChatMessageResponse();
        r.setId(m.getId());
        r.setConversationId(m.getConversation().getId());
        r.setSenderId(m.getSender().getId());
        r.setSenderName(m.getSender().getName());
        r.setContent(m.getContent());
        r.setSentAt(m.getSentAt());
        r.setRead(m.isRead());
        return r;
    }
}
