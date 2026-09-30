package com.wipro.shopping.bean;

import java.time.LocalDate;

public class OrderBean {
    private int orderId;
    private double totalAmount;
    private LocalDate orderDate;

    public OrderBean() {}

    public OrderBean(int orderId, double totalAmount, LocalDate orderDate) {
        this.orderId = orderId;
        this.totalAmount = totalAmount;
        this.orderDate = orderDate;
    }

    public int getOrderId() { return orderId; }
    public void setOrderId(int orderId) { this.orderId = orderId; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public LocalDate getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }

    @Override
    public String toString() {
        return "Order [ID=" + orderId + ", Total=" + totalAmount + ", Date=" + orderDate + "]";
    }
}
