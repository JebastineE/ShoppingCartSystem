package com.wipro.shopping.bean;

public class CartItemBean {
    private int cartItemId;
    private int productId;
    private int quantity;

    public CartItemBean() {}

    public CartItemBean(int cartItemId, int productId, int quantity) {
        this.cartItemId = cartItemId;
        this.productId = productId;
        this.quantity = quantity;
    }

    public int getCartItemId() { return cartItemId; }
    public void setCartItemId(int cartItemId) { this.cartItemId = cartItemId; }

    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    @Override
    public String toString() {
        return "CartItem [ID=" + cartItemId + ", ProductID=" + productId + ", Quantity=" + quantity + "]";
    }
}
