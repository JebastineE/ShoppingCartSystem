package com.wipro.shopping.service;

import java.time.LocalDate;
import java.util.List;

import com.wipro.shopping.bean.*;
import com.wipro.shopping.dao.*;

public class ShoppingService {
    private ProductDao productDao = new ProductDao();
    private CartDao cartDao = new CartDao();
    private OrderDao orderDao = new OrderDao();

    public boolean addProduct(ProductBean product) {
        return productDao.addProduct(product) > 0;
    }

    public List<ProductBean> getAllProducts() {
        return productDao.getAllProducts();
    }

    public boolean addToCart(CartItemBean item) {
        return cartDao.addCartItem(item) > 0;
    }

    public List<CartItemBean> getCartItems() {
        return cartDao.getAllCartItems();
    }

    public boolean checkout(int orderId) {
        List<CartItemBean> cartItems = getCartItems();
        if (cartItems.isEmpty()) {
            System.out.println("❌ Cart is empty!");
            return false;
        }

        double total = 0.0;
        for (CartItemBean item : cartItems) {
            ProductBean product = productDao.getAllProducts().stream()
                .filter(p -> p.getProductId() == item.getProductId())
                .findFirst().orElse(null);
            if (product != null && product.getStock() >= item.getQuantity()) {
                total += product.getPrice() * item.getQuantity();
                productDao.updateStock(product.getProductId(), product.getStock() - item.getQuantity());
            } else {
                System.out.println("❌ Not enough stock for product: " + item.getProductId());
                return false;
            }
        }

        OrderBean order = new OrderBean(orderId, total, LocalDate.now());
        orderDao.addOrder(order);
        cartDao.clearCart();
        System.out.println("✅ Order placed: " + order);
        return true;
    }

    public List<OrderBean> getAllOrders() {
        return orderDao.getAllOrders();
    }
}
