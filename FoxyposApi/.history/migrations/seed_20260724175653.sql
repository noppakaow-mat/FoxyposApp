TRUNCATE TABLE
order_items,
orders,
table_sessions,
products,
categories,
tables,
buffet_packages,
users
RESTART IDENTITY CASCADE;



-- =====================
-- BUFFET PACKAGE
-- =====================

INSERT INTO buffet_packages
(name,price_per_person)

VALUES

('Buffet Standard',299),
('Buffet Premium',499),
('Buffet Platinum',699);




-- =====================
-- TABLE
-- =====================

INSERT INTO tables
(table_number,status)

VALUES

(1,'available'),
(2,'available'),
(3,'available'),
(4,'available'),
(5,'available'),
(6,'available'),
(7,'available'),
(8,'available'),
(9,'available'),
(10,'available');




-- =====================
-- CATEGORY
-- =====================

INSERT INTO categories
(name)

VALUES

('Meat'),
('Seafood'),
('Vegetables'),
('Dessert'),
('Drinks');




-- =====================
-- PRODUCTS
-- =====================

INSERT INTO products

(category_id,name,price,image_url,is_complimentary,stock_quantity,is_available)

VALUES

(1,'Beef Slice',0,'/images/beef-slice.jpeg',false,100,true),
(1,'Pork Belly',0,'/images/pork-belly.jpg',false,100,true),

(2,'Shrimp',0,'/images/shrimp.jpg',false,100,true),
(2,'Salmon',0,'/images/salmon.webp',false,100,true),

(3,'Corn',0,'/images/corn.png',false,100,true),
(3,'Mushroom',0,'/images/mushroom.jpeg',false,100,true),

(4,'Ice Cream',0,'/images/ice-cream.jpg',false,50,true),   

(5,'Coke',0,'/images/coke.jpg',false,100,true),
(5,'Water',0,'/images/drinking-water.svg',false,200,true);




-- =====================
-- USERS
-- =====================

INSERT INTO users
(
 username,
 password_hash,
 role
)
VALUES
(
 'cashier1',
 '$2b$10$/GcrdPqSKcBP3XCG9N7/t.eSsY7SpzjQLMaupDbv9KUJ.mNzFOWgm',
 'cashier'
),

(
 'kitchen1',
 '$2b$10$/GcrdPqSKcBP3XCG9N7/t.eSsY7SpzjQLMaupDbv9KUJ.mNzFOWgm',
 'kitchen'
);

(
 'kitchen1',
 '$2b$10$/GcrdPqSKcBP3XCG9N7/t.eSsY7SpzjQLMaupDbv9KUJ.mNzFOWgm',
 'kitchen'
);

