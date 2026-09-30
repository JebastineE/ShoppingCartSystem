package com.wipro.shopping.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wipro.shopping.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {

}