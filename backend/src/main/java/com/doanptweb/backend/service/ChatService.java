package com.doanptweb.backend.service;

import com.doanptweb.backend.entity.*;
import com.doanptweb.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class ChatService {

    @Autowired private ChatSessionRepository sessionRepository;
    @Autowired private ChatMessageRepository messageRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;

    @Value("${groq.api.key}")
    private String groqApiKey;

    private final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private final String MODEL = "llama-3.3-70b-versatile";
    
    public Map<String, Object> chat(String userMessage, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();

        // Lấy hoặc tạo session
        ChatSession session = sessionRepository
            .findTopByUserOrderByCreatedAtDesc(user)
            .orElseGet(() -> {
                ChatSession s = new ChatSession();
                s.setUser(user);
                return sessionRepository.save(s);
            });

        // Lưu tin nhắn người dùng
        ChatMessage userMsg = new ChatMessage();
        userMsg.setSession(session);
        userMsg.setRole("user");
        userMsg.setContent(userMessage);
        messageRepository.save(userMsg);

        // Lấy lịch sử chat (tối đa 10 tin gần nhất)
        List<ChatMessage> history = messageRepository
            .findBySessionOrderByCreatedAtAsc(session);
        if (history.size() > 10) {
            history = history.subList(history.size() - 10, history.size());
        }

        // Lấy sản phẩm phù hợp từ DB (lọc thông minh)
        List<Product> products = getRelevantProducts(userMessage);

        // Tạo system prompt
        String systemPrompt = buildSystemPrompt(products);

        // Gọi Groq API
        String aiResponse = callGroqAPI(systemPrompt, history);

        // Lưu phản hồi AI
        ChatMessage aiMsg = new ChatMessage();
        aiMsg.setSession(session);
        aiMsg.setRole("assistant");
        aiMsg.setContent(aiResponse);
        messageRepository.save(aiMsg);

        // Parse product IDs từ response
        List<Long> productIds = parseProductIds(aiResponse);
        List<Product> suggestedProducts = productIds.isEmpty()
            ? Collections.emptyList()
            : productRepository.findAllById(productIds);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("message", cleanResponse(aiResponse));
        result.put("sessionId", session.getId());
        result.put("products", suggestedProducts.stream().map(p -> {
            Map<String, Object> pm = new LinkedHashMap<>();
            pm.put("id", p.getId());
            pm.put("name", p.getName());
            pm.put("price", p.getPrice());
            pm.put("imageUrl", p.getImageUrl());
            pm.put("stock", p.getStock());
            return pm;
        }).toList());
        return result;
    }

    private List<Product> getRelevantProducts(String message) {
        // Lọc theo từ khóa trong câu hỏi
        String lower = message.toLowerCase();
        List<Product> all = productRepository.findAll();

        return all.stream()
            .filter(p -> {
                if (lower.contains("laptop") || lower.contains("máy tính"))
                    return p.getCategory() != null &&
                        p.getCategory().getName().toLowerCase().contains("laptop");
                if (lower.contains("điện thoại") || lower.contains("iphone") ||
                    lower.contains("samsung") || lower.contains("phone"))
                    return p.getCategory() != null &&
                        p.getCategory().getName().toLowerCase().contains("mobile");
                if (lower.contains("tablet") || lower.contains("ipad") ||
                    lower.contains("máy tính bảng"))
                    return p.getCategory() != null &&
                        p.getCategory().getName().toLowerCase().contains("tablet");
                return true; // Không rõ danh mục → gửi tất cả
            })
            .limit(10) // Tối đa 10 sản phẩm
            .toList();
    }

    private String buildSystemPrompt(List<Product> products) {
        StringBuilder sb = new StringBuilder();
        sb.append("""
            Bạn là trợ lý tư vấn mua sắm của TechShop — cửa hàng thiết bị công nghệ.
            Nhiệm vụ của bạn là tư vấn sản phẩm phù hợp với nhu cầu khách hàng.

            QUY TẮC QUAN TRỌNG:
            1. Chỉ gợi ý sản phẩm có trong danh sách bên dưới, không tự bịa sản phẩm.
            2. Nếu không có sản phẩm phù hợp, hãy nói thật và xin lỗi.
            3. Trả lời bằng tiếng Việt, thân thiện và ngắn gọn.
            4. Khi gợi ý sản phẩm, PHẢI kèm theo [ID:số] ở cuối tên sản phẩm.
               Ví dụ: iPhone 17 Pro Max [ID:3]
            5. Giải thích ngắn gọn tại sao gợi ý sản phẩm đó.
            6. Nếu khách hỏi về thông số, trả lời dựa trên thông số trong danh sách.

            DANH SÁCH SẢN PHẨM HIỆN CÓ:
            """);

        for (Product p : products) {
            sb.append(String.format("\n[ID:%d] %s | Giá: %,.0f VND | Tồn kho: %d",
                p.getId(), p.getName(), p.getPrice().doubleValue(), p.getStock()));

            if (p.getSpecs() != null && !p.getSpecs().isEmpty()) {
                sb.append(" | Thông số: ");
                p.getSpecs().stream()
                    .filter(s -> s.getSpecValue() != null && !s.getSpecValue().isEmpty())
                    .limit(5)
                    .forEach(s -> sb.append(s.getSpecName())
                        .append(": ").append(s.getSpecValue()).append(", "));
            }
        }

        return sb.toString();
    }

    private String callGroqAPI(String systemPrompt, List<ChatMessage> history) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        List<Map<String, String>> messages = new ArrayList<>();

        // System message
        messages.add(Map.of("role", "system", "content", systemPrompt));

        // Lịch sử chat
        for (ChatMessage msg : history) {
            messages.add(Map.of("role", msg.getRole(), "content", msg.getContent()));
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", MODEL);
        body.put("messages", messages);
        body.put("max_tokens", 1024);
        body.put("temperature", 0.7);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                GROQ_URL, request, Map.class);

            List<Map> choices = (List<Map>) response.getBody().get("choices");
            Map message = (Map) choices.get(0).get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            System.err.println("=== GROQ ERROR: " + e.getMessage() + " ===");
            e.printStackTrace();
            return "Xin lỗi, hiện tại mình đang gặp sự cố. Bạn vui lòng thử lại sau nhé!";
        }
    }

    private List<Long> parseProductIds(String response) {
        List<Long> ids = new ArrayList<>();
        java.util.regex.Pattern pattern =
            java.util.regex.Pattern.compile("\\[ID:(\\d+)\\]");
        java.util.regex.Matcher matcher = pattern.matcher(response);
        while (matcher.find()) {
            ids.add(Long.parseLong(matcher.group(1)));
        }
        return ids;
    }

    private String cleanResponse(String response) {
        // Giữ nguyên text, frontend sẽ parse [ID:x]
        return response;
    }

    public void clearSession(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        sessionRepository.findTopByUserOrderByCreatedAtDesc(user)
            .ifPresent(session -> {
                messageRepository.deleteAll(
                    messageRepository.findBySessionOrderByCreatedAtAsc(session));
                sessionRepository.delete(session);
            });
    }
}