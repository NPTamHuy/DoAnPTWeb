package com.doanptweb.backend.controller;

import com.doanptweb.backend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<?> chat(
            @RequestBody Map<String, String> body,
            Authentication auth) {
        if (auth == null)
            return ResponseEntity.status(401)
                .body(Map.of("message", "Vui lòng đăng nhập để sử dụng tính năng này"));

        String message = body.get("message");
        if (message == null || message.trim().isEmpty())
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Tin nhắn không được để trống"));

        Map<String, Object> result = chatService.chat(message, auth.getName());
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/session")
    public ResponseEntity<?> clearSession(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        chatService.clearSession(auth.getName());
        return ResponseEntity.ok(Map.of("message", "Đã xóa lịch sử chat"));
    }
}