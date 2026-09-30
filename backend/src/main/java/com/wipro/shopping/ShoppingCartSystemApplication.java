package com.wipro.shopping;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ShoppingCartSystemApplication {

    public static void main(String[] args) {

        // Use the modern India timezone name
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));

        SpringApplication.run(ShoppingCartSystemApplication.class, args);
    }
}