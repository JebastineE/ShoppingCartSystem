package com.wipro.shopping.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wipro.shopping.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Integer> {
}