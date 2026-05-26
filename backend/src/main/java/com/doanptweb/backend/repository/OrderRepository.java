package com.doanptweb.backend.repository;

import com.doanptweb.backend.entity.Order;
import com.doanptweb.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
}