package com.bharatinvest.chat.service;

import com.bharatinvest.chat.dto.ChatMessageResponse;
import com.bharatinvest.chat.dto.ConversationResponse;
import com.bharatinvest.chat.entity.ChatMessage;
import com.bharatinvest.chat.entity.Conversation;
import com.bharatinvest.chat.repository.ChatMessageRepository;
import com.bharatinvest.chat.repository.ConversationRepository;
import com.bharatinvest.user.entity.User;
import com.bharatinvest.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    public List<ConversationResponse> getMyConversations(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return conversationRepository.findByInvestorIdOrFounderId(user.getId(), user.getId())
                .stream()
                .map(c -> {
                    ConversationResponse r = ConversationResponse.from(c);
                    r.setUnreadCount(
                        chatMessageRepository.countByConversationIdAndReadFalseAndSenderIdNot(c.getId(), user.getId())
                    );
                    return r;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public List<ChatMessageResponse> getMessages(Long conversationId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        chatMessageRepository.markAsRead(conversationId, user.getId());
        return chatMessageRepository.findByConversationIdOrderBySentAtAsc(conversationId)
                .stream()
                .map(ChatMessageResponse::from)
                .collect(Collectors.toList());
    }

    public ChatMessageResponse sendMessage(Long conversationId, String content, String email) {
        User sender = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        if (!conversation.getInvestor().getId().equals(sender.getId())
                && !conversation.getFounder().getId().equals(sender.getId())) {
            throw new RuntimeException("Not part of this conversation");
        }

        ChatMessage message = ChatMessage.builder()
                .conversation(conversation)
                .sender(sender)
                .content(content)
                .build();

        return ChatMessageResponse.from(chatMessageRepository.save(message));
    }
}
