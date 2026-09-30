package com.wipro.shopping.test;

import com.wipro.shopping.service.*;
import com.wipro.shopping.bean.*;

public class ShoppingTest {
    public static void main(String[] args) {
        ShoppingService service = new ShoppingService();

        // Add products
        service.addProduct(new ProductBean(1, "Laptop", 60000, 5));
        service.addProduct(new ProductBean(2, "Phone", 30000, 10));
        service.addProduct(new ProductBean(3, "Headphones", 2000, 15));

        System.out.println("\n📦 Products:");
        service.getAllProducts().forEach(System.out::println);

        // Add to cart
        service.addToCart(new CartItemBean(101, 1, 1)); // 1 Laptop
        service.addToCart(new CartItemBean(102, 2, 2)); // 2 Phones

        System.out.println("\n🛒 Cart:");
        service.getCartItems().forEach(System.out::println);

        // Checkout
        service.checkout(5001);

        System.out.println("\n📑 Orders:");
        service.getAllOrders().forEach(System.out::println);

        System.out.println("\n📦 Products After Checkout:");
        service.getAllProducts().forEach(System.out::println);
    }
}


