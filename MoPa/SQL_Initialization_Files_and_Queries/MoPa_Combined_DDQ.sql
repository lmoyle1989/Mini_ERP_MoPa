-- Data Definition & Sample Data Queries
-- CS340 Team 15 "MoPa"
-- Lucas Moyle, Sung Hyun Pak

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Parts;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Addresses;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Parts_Products;
DROP TABLE IF EXISTS Orders_Products;
SET FOREIGN_KEY_CHECKS = 1;

--
-- Table structure for table `Parts`
--
CREATE TABLE Parts (
    partID int(11) NOT NULL AUTO_INCREMENT,
    partName varchar(255) NOT NULL,
    partCost float NOT NULL,
    partVendor varchar(255) NOT NULL,
    partCurrentStock int(11) NOT NULL,
    partLeadTimeDays int(11) NOT NULL,
    PRIMARY KEY (partID)
) ENGINE=InnoDB;

INSERT INTO Parts (`partName`, `partCost`, `partVendor`, `partCurrentStock`, `partLeadTimeDays`) VALUES
("Screw", 0.05, "Fastenal", 500, 7),
("Bolt", 0.10, "Fastenal", 250, 7),
("Nut", 0.07, "McMaster-Carr", 513, 3),
("Small Box", 1.21, "Box Mfg Company", 25, 14),
("Large Box", 2.75, "Box Mfg Company", 15, 14),
("Bearing", 5.00, "McMaster-Carr", 100, 31),
("Manifold", 55.00, "Sheet Metal Inc.", 10, 21),
("Gear", 5.00, "Gearco Ltd.", 50, 9),
("Motor", 110.00, "Westinghouse", 5, 14),
("Lightbulb", 2.00, "Light Co.", 340, 10),
("Chassis", 200.00, "Metalworks", 20, 60);

--
-- Table structure for table `Products`
--
CREATE TABLE Products (
    productID int(11) NOT NULL AUTO_INCREMENT,
    productName varchar(255) NOT NULL,
    productSalePrice float NOT NULL,
    -- productCost float DEFAULT NULL,
    productMfgTimeHours float NOT NULL,
    productInventory int(11) NOT NULL,
    PRIMARY KEY (productID)
) ENGINE=InnoDB;

INSERT INTO Products (`productName`, `productSalePrice`, `productMfgTimeHours`, `productInventory`) VALUES
("Widget", 300.00, 20.50, 0),
("Gadget", 350.00, 12.00, 10),
("Thingamabob", 100.00, 8.00, 8),
("Gizmo", 200.00, 18.70, 2),
("Contraption", 500.00, 32.00, 1);

--
-- Table structure for table `Customers`
--
CREATE TABLE Customers (
    customerID int(11) NOT NULL AUTO_INCREMENT,
    customerFirstName varchar(255) NOT NULL,
    customerLastName varchar(255) NOT NULL,
    customerEmail varchar(255) NOT NULL,
    customerPhone varchar(255) NOT NULL,
    PRIMARY KEY (customerID)
) ENGINE=InnoDB;

INSERT INTO `Customers` (`customerFirstName`, `customerLastName`, `customerEmail`, `customerPhone`) VALUES
("Bobby", "Lee", "BobbyLee98@gmail.com", "8329982943"),
("Billy", "Gee", "BillyGee99@gmail.com", "8329982943"),
("David", "Copperfield", "davidcopperfieldofficial@gmail.com", "9669872387"),
("Rene", "Rock", "rocky982@gmail.com", "8888888888");

--
-- Table structure for table `Addresses`
--
CREATE TABLE Addresses (
    addressID int(11) NOT NULL AUTO_INCREMENT,
    addressStreet varchar(255) NOT NULL,
    addressCity varchar(255) NOT NULL,
    addressState varchar(255) NOT NULL,
    addressZipCode int(5) NOT NULL,
    customerID int,
    PRIMARY KEY (addressID),
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT INTO `Addresses` (`addressStreet`, `addressCity`, `addressState`, `addressZipCode`, `customerID`) VALUES
("4243 Rosedale Ave.", "Genesis", "Kentucky", 98765, 1),
("17782 Mission St.", "Killbegan", "California", 87253, 2),
("b245 Copperfield Lane", "Pasadona","CA", 98732, 2),
("423 Rocky St. Apt B.","Portland", "OR", 98234, 3),
("99 Smith Road", "Seattle", "WA", 45266, 4),
("123 Mountain Drive", "Springtown", "Colorado", 98765, 1);

--
-- Table structure for table `Orders`
--
CREATE TABLE Orders (
    orderID int(11) NOT NULL AUTO_INCREMENT,
    addressID int(11) NOT NULL,
    orderCost float(11) DEFAULT NULL,
    orderSalePrice float(11) NOT NULL,
    orderEntryDate date NOT NULL,
    orderDueDate date NOT NULL,
    orderTrackingNumber bigint DEFAULT NULL,
    PRIMARY KEY (orderID),
    KEY `addressID_FK` (`addressID`),
    CONSTRAINT `addressID_FK` FOREIGN KEY (addressID) REFERENCES Addresses(addressID)
) ENGINE=InnoDB;

INSERT INTO `Orders` (`addressID`, `orderSalePrice`, `orderEntryDate`, `orderDueDate`, `orderTrackingNumber`) VALUES
(1, 350.06, "2020-10-15", "2021-1-1", 345702381),
(1, 299.54, "2020-11-1", "2021-2-1", 85647332),
(3, 512.33, "2020-9-12", "2021-5-15", 123654381),
(4, 99.98, "2020-2-15", "2021-2-14", 345702381),
(6, 55.55, "2020-5-10", "2022-1-1", 999999999);

--
-- Parts_Products Relationship Table
--
CREATE TABLE Parts_Products (
    partID int(11) NOT NULL,
    productID int(11) NOT NULL,
    quantityParts int(11) NOT NULL,
    PRIMARY KEY (partID, productID),
    FOREIGN KEY (partID) REFERENCES Parts (partID) ON DELETE CASCADE,
    FOREIGN KEY (productID) REFERENCES Products (productID) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `Parts_Products` (`partID`, `productID`, `quantityParts`) VALUES
-- Widget BOM (x10 Screws, x20 Bolts, x20 Nuts, x1 Motor, x1 Large Box):
(1, 1, 10),
(2, 1, 20),
(3, 1, 20),
(9, 1, 1),
(5, 1, 1),
-- Gadget BOM:
(1, 2, 2),
(2, 2, 5),
(3, 2, 5),
(7, 2, 2),
(4, 2, 1),
-- Etc...
(9, 3, 1),
(8, 3, 1),
(6, 3, 4),
--
(2, 4, 12),
(3, 4, 12),
(11, 4, 1),
(9, 4, 4),
(8, 4, 4),
(10, 4, 2),
--
(1, 5, 2),
(11, 5, 1),
(5, 5, 1);

--
-- Orders_Products Relationship Table
--
CREATE TABLE Orders_Products (
    orderID int(11) NOT NULL,
    productID int(11) NOT NULL,
    quantityProducts int(11) NOT NULL,
    PRIMARY KEY (orderID, productID),
    FOREIGN KEY (orderID) REFERENCES Orders (orderID) ON DELETE CASCADE,
    FOREIGN KEY (productID) REFERENCES Products (productID) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `Orders_Products` (`orderID`, `productID`, `quantityProducts`) VALUES
-- Order #1 has x2 Widgets and x1 Gizmo
(1, 1, 2),
(1, 4, 1),
-- Order #2 has x1 Contraption
(2, 5, 1),
-- Order #3 has x10 Thingamabobs
(3, 3, 10),
-- Etc...
(4, 2, 5),
(5, 2, 2);