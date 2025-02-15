package com.leandropitta.budget_manager.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table (name = "expenses")
@Data
public class Cost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private String buy;

    @Column(nullable = false)
    private BigDecimal cost;

    @ManyToOne
    @JoinColumn(name = "users_id", nullable = false)
    private User user;
}
