package com.wipro.shopping.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wipro.shopping.entity.CartItem;

public interface CartRepository extends JpaRepository<CartItem, Integer> {
}