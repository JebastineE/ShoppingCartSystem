package com.wipro.shopping.dao;

import java.sql.*;
import java.util.*;

import com.wipro.shopping.bean.ProductBean;
import com.wipro.shopping.util.ShoppingUtil;

public class ProductDao {
    public int addProduct(ProductBean product) {
        int status = 0;
        try (Connection con = ShoppingUtil.getConnection()) {
            String sql = "INSERT INTO product VALUES (?, ?, ?, ?)";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, product.getProductId());
            ps.setString(2, product.getName());
            ps.setDouble(3, product.getPrice());
            ps.setInt(4, product.getStock());
            status = ps.executeUpdate();
        } catch (Exception e) { e.printStackTrace(); }
        return status;
    }

    public List<ProductBean> getAllProducts() {
        List<ProductBean> list = new ArrayList<>();
        try (Connection con = ShoppingUtil.getConnection()) {
            ResultSet rs = con.createStatement().executeQuery("SELECT * FROM product");
            while (rs.next()) {
                list.add(new ProductBean(rs.getInt(1), rs.getString(2), rs.getDouble(3), rs.getInt(4)));
            }
        } catch (Exception e) { e.printStackTrace(); }
        return list;
    }

    public boolean updateStock(int productId, int newStock) {
        try (Connection con = ShoppingUtil.getConnection()) {
            String sql = "UPDATE product SET stock=? WHERE productId=?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, newStock);
            ps.setInt(2, productId);
            return ps.executeUpdate() > 0;
        } catch (Exception e) { e.printStackTrace(); }
        return false;
    }
}
