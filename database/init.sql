-- =========================================================
-- Shopping Cart System - PostgreSQL Database Initialization
-- PostgreSQL 18
-- =========================================================

-- =========================================================
-- 1. PRODUCT TABLE
-- =========================================================

CREATE TABLE product (
    product_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    stock INT NOT NULL
);

-- =========================================================
-- 2. CART TABLE
-- =========================================================

CREATE TABLE cart (
    cart_item_id INT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    CONSTRAINT fk_cart_product
        FOREIGN KEY (product_id)
        REFERENCES product(product_id)
);

-- =========================================================
-- 3. ORDERS TABLE
-- =========================================================

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    total_amount NUMERIC(10,2) NOT NULL,
    order_date DATE NOT NULL
);

-- =========================================================
-- 4. SAMPLE PRODUCTS
-- =========================================================

INSERT INTO product (product_id, name, price, stock)
VALUES
(1, 'Laptop', 60000.00, 10),
(2, 'Phone', 30000.00, 20),
(3, 'Headphones', 2000.00, 15),
(4, 'Keyboard', 1500.00, 25);

-- =========================================================
-- 5. FUNCTION
-- Calculate total value of items currently in cart
-- =========================================================

CREATE OR REPLACE FUNCTION calculate_cart_total()
RETURNS NUMERIC(10,2)
LANGUAGE plpgsql
AS Get-ChildItem
DECLARE
    total NUMERIC(10,2);
BEGIN
    SELECT COALESCE(SUM(p.price * c.quantity), 0)
    INTO total
    FROM cart c
    JOIN product p
        ON c.product_id = p.product_id;

    RETURN total;
END;
Get-ChildItem;

-- =========================================================
-- 6. PROCEDURE
-- Checkout cart
-- =========================================================

CREATE OR REPLACE PROCEDURE checkout()
LANGUAGE plpgsql
AS Get-ChildItem
DECLARE
    new_order_id INT;
    cart_total NUMERIC(10,2);
BEGIN
    SELECT calculate_cart_total()
    INTO cart_total;

    SELECT COALESCE(MAX(order_id), 5000) + 1
    INTO new_order_id
    FROM orders;

    INSERT INTO orders (order_id, total_amount, order_date)
    VALUES (new_order_id, cart_total, CURRENT_DATE);

    UPDATE product p
    SET stock = p.stock - c.quantity
    FROM cart c
    WHERE p.product_id = c.product_id;

    DELETE FROM cart;
END;
Get-ChildItem;

-- =========================================================
-- 7. TRIGGER FUNCTION
-- Prevent negative stock
-- =========================================================

CREATE OR REPLACE FUNCTION check_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
AS Get-ChildItem
BEGIN
    IF NEW.stock < 0 THEN
        RAISE EXCEPTION
            'Stock cannot be negative. Product ID: %',
            NEW.product_id;
    END IF;

    RETURN NEW;
END;
Get-ChildItem;

-- =========================================================
-- 8. TRIGGER
-- =========================================================

CREATE TRIGGER prevent_negative_stock
BEFORE INSERT OR UPDATE OF stock
ON product
FOR EACH ROW
EXECUTE FUNCTION check_stock();

-- =========================================================
-- END OF DATABASE INITIALIZATION
-- =========================================================
