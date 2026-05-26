package com.doanptweb.backend.controller;

import com.doanptweb.backend.entity.Order;
import com.doanptweb.backend.entity.User;
import com.doanptweb.backend.repository.OrderRepository;
import com.doanptweb.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;

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
    public List<Map<String, Object>> getMyOrders(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);

        List<Map<String, Object>> result = new ArrayList<>();
        for (Order order : orders) {
            Map<String, Object> orderMap = new LinkedHashMap<>();
            orderMap.put("id", order.getId());
            orderMap.put("status", order.getStatus());
            orderMap.put("totalAmount", order.getTotalAmount());
            orderMap.put("shippingAddress", order.getShippingAddress());
            orderMap.put("phone", order.getPhone());
            orderMap.put("createdAt", order.getCreatedAt());

            List<Map<String, Object>> items = new ArrayList<>();
            if (order.getOrderItems() != null) {
                for (var item : order.getOrderItems()) {
                    Map<String, Object> itemMap = new LinkedHashMap<>();
                    itemMap.put("id", item.getId());
                    itemMap.put("quantity", item.getQuantity());
                    itemMap.put("price", item.getPrice());

                    if (item.getProduct() != null) {
                        Map<String, Object> product = new LinkedHashMap<>();
                        product.put("id", item.getProduct().getId());
                        product.put("name", item.getProduct().getName());
                        product.put("imageUrl", item.getProduct().getImageUrl());
                        itemMap.put("product", product);
                    }
                    items.add(itemMap);
                }
            }
            orderMap.put("orderItems", items);
            result.add(orderMap);
        }
        return result;
    }

    @GetMapping
    public List<Map<String, Object>> getAll() {
        List<Order> orders = orderRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Order order : orders) {
            Map<String, Object> orderMap = new LinkedHashMap<>();
            orderMap.put("id", order.getId());
            orderMap.put("status", order.getStatus());
            orderMap.put("totalAmount", order.getTotalAmount());
            orderMap.put("shippingAddress", order.getShippingAddress());
            orderMap.put("phone", order.getPhone());
            orderMap.put("createdAt", order.getCreatedAt());


            if (order.getUser() != null) {
            Map<String, Object> userMap = new LinkedHashMap<>();
            userMap.put("id", order.getUser().getId());
            userMap.put("fullName", order.getUser().getFullName());
            userMap.put("email", order.getUser().getEmail());
            userMap.put("phone", order.getUser().getPhone());
            orderMap.put("user", userMap);
            }

            List<Map<String, Object>> items = new ArrayList<>();
            if (order.getOrderItems() != null) {
                for (var item : order.getOrderItems()) {
                    Map<String, Object> itemMap = new LinkedHashMap<>();
                    itemMap.put("id", item.getId());
                    itemMap.put("quantity", item.getQuantity());
                    itemMap.put("price", item.getPrice());
                    if (item.getProduct() != null) {
                        Map<String, Object> product = new LinkedHashMap<>();
                        product.put("id", item.getProduct().getId());
                        product.put("name", item.getProduct().getName());
                        product.put("imageUrl", item.getProduct().getImageUrl());
                        itemMap.put("product", product);
                    }
                    items.add(itemMap);
                }
            }
            orderMap.put("orderItems", items);
            result.add(orderMap);
        }
        return result;
    }

    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable Long id, @RequestBody Order body) {
        Order order = orderRepository.findById(id).orElseThrow();
        order.setStatus(body.getStatus());
        return orderRepository.save(order);
    }
    
}