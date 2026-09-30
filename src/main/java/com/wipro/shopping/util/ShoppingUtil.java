package com.wipro.shopping.util;

import java.sql.Connection;
import java.sql.DriverManager;

public class ShoppingUtil {

    public static Connection getConnection() {

        Connection con = null;

        try {

            Class.forName("oracle.jdbc.driver.OracleDriver");

            con = DriverManager.getConnection(
                    "jdbc:oracle:thin:@localhost:1521:XE",
                    "shopping",          // your oracle user
                    "shopping123"        // your oracle password
            );

        } catch (Exception e) {
            e.printStackTrace();
        }

        return con;
    }
}