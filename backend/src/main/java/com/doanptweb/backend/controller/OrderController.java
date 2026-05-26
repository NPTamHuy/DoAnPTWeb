package com.doanptweb.backend.controller;

import com.doanptweb.backend.entity.Order;
import com.doanptweb.backend.entity.OrderItem;
import com.doanptweb.backend.entity.User;
import com.doanptweb.backend.repository.OrderRepository;
import com.doanptweb.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public Order create(@RequestBody Order order, Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        order.setUser(user);
        if (order.getOrderItems() != null) {
            order.getOrderItems().forEach(item -> item.setOrder(order));
        }
        return orderRepository.save(order);
    }

    @GetMapping("/my")
    public List<Order> getMyOrders(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @GetMapping
    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable Long id, @RequestBody Order body) {
        Order order = orderRepository.findById(id).orElseThrow();
        order.setStatus(body.getStatus());
        return orderRepository.save(order);
    }
}