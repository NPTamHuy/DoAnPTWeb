package com.doanptweb.backend.repository;

import com.doanptweb.backend.entity.ChatMessage;
import com.doanptweb.backend.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySessionOrderByCreatedAtAsc(ChatSession session);
}