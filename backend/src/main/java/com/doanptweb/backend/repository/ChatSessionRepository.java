package com.doanptweb.backend.repository;

import com.doanptweb.backend.entity.ChatSession;
import com.doanptweb.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    Optional<ChatSession> findTopByUserOrderByCreatedAtDesc(User user);
}