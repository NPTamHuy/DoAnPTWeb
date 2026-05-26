package com.doanptweb.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private BigDecimal totalAmount;
    private String shippingAddress;
    private String phone;
    private String note;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    public enum Status {
        PENDING, CONFIRMED, SHIPPING, DELIVERED, CANCELLED
    }
}