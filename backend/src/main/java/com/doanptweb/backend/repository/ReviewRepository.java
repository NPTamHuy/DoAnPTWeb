package com.doanptweb.backend.repository;

import com.doanptweb.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);
    boolean existsByProductIdAndUserId(Long productId, Long userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double avgRatingByProductId(Long productId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId")
    Long countByProductId(Long productId);
}