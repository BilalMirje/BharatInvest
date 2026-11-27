package com.bharatinvest.chat.repository;

import com.bharatinvest.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByConversationIdOrderBySentAtAsc(Long conversationId);

    long countByConversationIdAndReadFalseAndSenderIdNot(Long conversationId, Long userId);

    @Modifying
    @Query("UPDATE ChatMessage m SET m.read = true WHERE m.conversation.id = :convId AND m.sender.id <> :userId AND m.read = false")
    void markAsRead(Long convId, Long userId);
}
