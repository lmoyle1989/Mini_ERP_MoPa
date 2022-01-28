-- Data Manipulation Queries
-- CS340 Team 15 "MoPa"
-- Lucas Moyle, Sung Hyun Pak

-- Customers
-- Get Customer's info
SELECT * FROM Customers;
-- Get Addresses for each Customer
SELECT Customers.customerID, customerFirstName, customerLastName, addressStreet, addressCity, addressState, addressZipCode 
FROM Customers INNER JOIN Addresses ON Customers.customerID = Addresses.customerID;
-- Add new Customer
INSERT INTO Customers (customerFirstName,customerLastName,customerEmail,customerPhone) VALUES (?,?,?,?);
-- Delete Customer
DELETE FROM Customers WHERE customerID=?;

-- Addresses/Update Customer
-- Select specific Customer
SELECT * FROM Customers WHERE customerID = ?;
-- Update Customer info
UPDATE Customers SET customerFirstName=?, customerLastName=?, customerEmail=?, customerPhone=? WHERE customerID=?;
-- Get Customer's Addresses
SELECT addressStreet, addressCity, addressState, addressZipCode FROM Customers INNER JOIN Addresses ON Customers.customerID = Addresses.customerID WHERE Customers.customerID = ?;
-- Add New Address
INSERT INTO Addresses (addressStreet,addressCity,addressState,addressZipCode,customerID) VALUES (?,?,?,?,?);

-- Orders
-- View # of Orders by Customer Name
SELECT Customers.customerID, customerFirstName, customerLastName, customerEmail, COUNT(Orders.orderID) AS 'orderQty' FROM Customers 
LEFT JOIN Addresses ON Customers.customerID = Addresses.customerID 
LEFT JOIN Orders ON Addresses.addressID = Orders.addressID 
GROUP BY Customers.customerID 
ORDER BY customerFirstName ASC;
--Search by Customer First Name
SELECT Customers.customerID, customerFirstName, customerLastName, customerEmail, COUNT(Orders.orderID) AS 'orderQty' FROM Customers 
LEFT JOIN Addresses ON Customers.customerID = Addresses.customerID 
LEFT JOIN Orders ON Addresses.addressID = Orders.addressID 
WHERE customerFirstName LIKE '" + req.body.customerFirstName + "%' 
GROUP BY Customers.customerID 
ORDER BY customerFirstName ASC;
--Search by Customer Last Name
SELECT Customers.customerID, customerFirstName, customerLastName, customerEmail, COUNT(Orders.orderID) AS 'orderQty' FROM Customers 
LEFT JOIN Addresses ON Customers.customerID = Addresses.customerID 
LEFT JOIN Orders ON Addresses.addressID = Orders.addressID 
WHERE customerLastName LIKE '" + req.body.customerLastName + "%' 
GROUP BY Customers.customerID 
ORDER BY customerLastName ASC;

-- Order Creator
-- Get single Customer's Info
SELECT * FROM Customers WHERE customerID = ?;
-- Get that Customer's Addresses
SELECT * FROM Addresses WHERE customerID = ?;
-- Get that Customer's Orders
SELECT Orders.orderID, Orders.orderSalePrice, DATE_FORMAT(Orders.orderEntryDate, '%Y-%m-%d') AS orderEntryDate, DATE_FORMAT(Orders.orderDueDate, '%Y-%m-%d') 
AS orderDueDate, Orders.orderTrackingNumber, Addresses.addressStreet, Addresses.addressCity, Addresses.addressState, Addresses.addressZipCode FROM Orders 
INNER JOIN Addresses ON Orders.addressID = Addresses.addressID 
INNER JOIN Customers ON Addresses.customerID = Customers.customerID 
WHERE Addresses.customerID = ?;
-- Add new order
INSERT INTO Orders (addressID,orderSalePrice,orderEntryDate,orderDueDate,orderTrackingNumber) VALUES (?,?,CURDATE(),?,?);

-- Order Editor
-- Get the list of Products and qtys on an Order
SELECT Orders_Products.productID, Orders_Products.orderID, Products.productName, Orders_Products.quantityProducts, Products.productSalePrice FROM Orders_Products 
INNER JOIN Products ON Orders_Products.productID = Products.productID WHERE Orders_Products.orderID = ?;
-- Get selected Order's information
SELECT Customers.customerFirstName, Customers.customerLastName, Orders.orderID, DATE_FORMAT(Orders.orderEntryDate, '%Y-%m-%d') AS orderEntryDate, 
DATE_FORMAT(Orders.orderDueDate, '%Y-%m-%d') AS orderDueDate, Orders.orderSalePrice, Orders.orderTrackingNumber, Addresses.addressStreet, Addresses.addressCity, Addresses.addressState, Addresses.addressZipCode 
FROM Orders INNER JOIN Addresses ON Orders.addressID = Addresses.addressID 
INNER JOIN Customers ON Addresses.customerID = Customers.customerID WHERE Orders.orderID = ?;
-- Get list of Products for drop-down selection
SELECT * FROM Products;
-- Delete a Product from the Order
DELETE FROM Orders_Products WHERE (orderID=? AND productID=?);
-- Add a Product to the Order or update its qty
INSERT INTO Orders_Products (productID,orderID,quantityProducts) VALUES (?,?,?) ON DUPLICATE KEY UPDATE quantityProducts =  '+ req.body.qty_input';

-- Parts
-- View all parts
SELECT * FROM Parts;
--Add a new part
INSERT INTO Parts (partName,partCost,partVendor,partCurrentStock,partLeadTimeDays) VALUES (?,?,?,?,?);
-- Delete a part
DELETE FROM Parts WHERE partID=?;

-- Products
-- View all products
SELECT * FROM Products
-- View BOMs for each product
SELECT productName, partName, quantityParts FROM Products INNER JOIN Parts_Products ON Products.productID = Parts_Products.productID INNER JOIN Parts ON Parts.partID = Parts_Products.partID;
-- Add a new product
INSERT INTO Products (productName,productMfgTimeHours,productInventory,productSalePrice) VALUES (?,?,?,?);
-- Delete a product
DELETE FROM Products WHERE productID=?;
-- Update a product
UPDATE Products SET productName=?, productMfgTimeHours=?, productInventory=?, productSalePrice=? WHERE productID=?;

-- Product Manager
-- View a single product
SELECT * FROM Products WHERE productID = ?;
-- View a single product's BOM
SELECT productID, Parts_Products.partID, partName, quantityParts FROM Parts_Products INNER JOIN Parts ON Parts_Products.partID = Parts.partID WHERE productID = ?;
-- Get a list of all parts for a drop-down
SELECT * FROM Parts;
-- Delete a part from the BOM of a product
DELETE FROM Parts_Products WHERE (partID=? AND productID=?);
-- Add a part to a product's BOM or update the part's quantity
INSERT INTO Parts_Products (partID,productID,quantityParts) VALUES (?,?,?) ON DUPLICATE KEY UPDATE quantityParts = ?;