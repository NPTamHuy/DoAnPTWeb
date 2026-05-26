package com.doanptweb.backend.controller;

import com.doanptweb.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.doanptweb.backend.entity.User;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        String email = auth.getName();
        return userRepository.findByEmail(email)
            .map(u -> {
                Map<String, Object> res = new LinkedHashMap<>();
                res.put("id", u.getId());
                res.put("fullName", u.getFullName());
                res.put("email", u.getEmail());
                res.put("phone", u.getPhone());
                res.put("address", u.getAddress());
                res.put("role", u.getRole());
                return ResponseEntity.ok(res);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMe(@RequestBody Map<String, String> body, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        String email = auth.getName();
        return userRepository.findByEmail(email)
            .map(u -> {
                if (body.containsKey("fullName")) u.setFullName(body.get("fullName"));
                if (body.containsKey("phone")) u.setPhone(body.get("phone"));
                if (body.containsKey("address")) u.setAddress(body.get("address"));
                userRepository.save(u);
                return ResponseEntity.ok(Map.of("message", "Cập nhật thành công"));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        String email = auth.getName();
        return userRepository.findByEmail(email)
            .map(u -> {
                if (!passwordEncoder.matches(body.get("currentPassword"), u.getPassword())) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Mật khẩu hiện tại không đúng"));
                }
                u.setPassword(passwordEncoder.encode(body.get("newPassword")));
                userRepository.save(u);
                return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công"));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}