package com.wipro.shopping.dao;

import java.sql.*;
import java.util.*;

import com.wipro.shopping.bean.CartItemBean;
import com.wipro.shopping.util.ShoppingUtil;

public class CartDao {
    public int addCartItem(CartItemBean item) {
        int status = 0;
        try (Connection con = ShoppingUtil.getConnection()) {
            String sql = "INSERT INTO cart VALUES (?, ?, ?)";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, item.getCartItemId());
            ps.setInt(2, item.getProductId());
            ps.setInt(3, item.getQuantity());
            status = ps.executeUpdate();
        } catch (Exception e) { e.printStackTrace(); }
        return status;
    }

    public List<CartItemBean> getAllCartItems() {
        List<CartItemBean> list = new ArrayList<>();
        try (Connection con = ShoppingUtil.getConnection()) {
            ResultSet rs = con.createStatement().executeQuery("SELECT * FROM cart");
            while (rs.next()) {
                list.add(new CartItemBean(rs.getInt(1), rs.getInt(2), rs.getInt(3)));
            }
        } catch (Exception e) { e.printStackTrace(); }
        return list;
    }

    public void clearCart() {
        try (Connection con = ShoppingUtil.getConnection()) {
            con.createStatement().executeUpdate("DELETE FROM cart");
        } catch (Exception e) { e.printStackTrace(); }
    }
}
