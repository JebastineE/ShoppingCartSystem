package com.wipro.shopping.dao;

import java.sql.*;
import java.util.*;

import com.wipro.shopping.util.ShoppingUtil;
import com.wipro.shopping.bean.OrderBean;

public class OrderDao {
    public int addOrder(OrderBean order) {
        int status = 0;
        try (Connection con = ShoppingUtil.getConnection()) {
            String sql = "INSERT INTO orders VALUES (?, ?, ?)";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, order.getOrderId());
            ps.setDouble(2, order.getTotalAmount());
            ps.setDate(3, java.sql.Date.valueOf(order.getOrderDate()));
            status = ps.executeUpdate();
        } catch (Exception e) { e.printStackTrace(); }
        return status;
    }

    public List<OrderBean> getAllOrders() {
        List<OrderBean> list = new ArrayList<>();
        try (Connection con = ShoppingUtil.getConnection()) {
            ResultSet rs = con.createStatement().executeQuery("SELECT * FROM orders");
            while (rs.next()) {
                list.add(new OrderBean(rs.getInt(1), rs.getDouble(2), rs.getDate(3).toLocalDate()));
            }
        } catch (Exception e) { e.printStackTrace(); }
        return list;
    }
}
