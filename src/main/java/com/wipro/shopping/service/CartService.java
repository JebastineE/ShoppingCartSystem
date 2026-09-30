package com.wipro.shopping.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.wipro.shopping.entity.CartItem;
import com.wipro.shopping.repository.CartRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    public List<CartItem> getAllCartItems() {
        return cartRepository.findAll();
    }

    public CartItem getCartItemById(Integer cartItemId) {
        return cartRepository.findById(cartItemId).orElse(null);
    }

    public CartItem addCartItem(CartItem cartItem) {
        return cartRepository.save(cartItem);
    }

    public void deleteCartItem(Integer cartItemId) {
        cartRepository.deleteById(cartItemId);
    }
}