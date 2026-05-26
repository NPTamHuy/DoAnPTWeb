package com.doanptweb.backend.controller;

import com.doanptweb.backend.entity.Product;
import com.doanptweb.backend.entity.Review;
import com.doanptweb.backend.entity.User;
import com.doanptweb.backend.repository.ReviewRepository;
import com.doanptweb.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    @Autowired private ReviewRepository reviewRepository;
    @Autowired private UserRepository userRepository;

    @GetMapping("/product/{productId}")
    public List<Review> getByProduct(@PathVariable Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    @GetMapping("/product/{productId}/stats")
    public Map<String, Object> getStats(@PathVariable Long productId) {
        Double avg = reviewRepository.avgRatingByProductId(productId);
        Long count = reviewRepository.countByProductId(productId);
        return Map.of(
            "average", avg != null ? Math.round(avg * 10.0) / 10.0 : 0,
            "count", count
        );
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<?> create(@PathVariable Long productId,
                                    @RequestBody Review review,
                                    Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Chưa đăng nhập"));

        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        if (reviewRepository.existsByProductIdAndUserId(productId, user.getId())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Bạn đã đánh giá sản phẩm này"));
        }

        review.setProduct(new Product());
        review.getProduct().setId(productId);
        review.setUser(user);
        return ResponseEntity.ok(reviewRepository.save(review));
    }
}