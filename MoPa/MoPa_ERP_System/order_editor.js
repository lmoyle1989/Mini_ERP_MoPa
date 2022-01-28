module.exports = function(){
    var express = require('express');
    var router = express.Router();

    router.get('/',function(req,res){
        var context = {};
        var mysql = req.app.get('mysql')
        mysql.pool.query("SELECT Orders_Products.productID, Orders_Products.orderID, Products.productName, Orders_Products.quantityProducts, Products.productSalePrice FROM Orders_Products INNER JOIN Products ON Orders_Products.productID = Products.productID WHERE Orders_Products.orderID = ?", [req.query.orderID], function(error, resultsItems, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.orderItems = resultsItems;
            mysql.pool.query("SELECT Customers.customerFirstName, Customers.customerLastName, Orders.orderID, DATE_FORMAT(Orders.orderEntryDate, '%Y-%m-%d') AS orderEntryDate, DATE_FORMAT(Orders.orderDueDate, '%Y-%m-%d') AS orderDueDate, Orders.orderSalePrice, Orders.orderTrackingNumber, Addresses.addressStreet, Addresses.addressCity, Addresses.addressState, Addresses.addressZipCode FROM Orders INNER JOIN Addresses ON Orders.addressID = Addresses.addressID INNER JOIN Customers ON Addresses.customerID = Customers.customerID WHERE Orders.orderID = ?", [req.query.orderID], function(error, resultsOrder, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.order = resultsOrder;
                mysql.pool.query("SELECT * FROM Products", function(error, resultsProducts, fields){
                    if(error){
                        res.write(JSON.stringify(error));
                        res.end();
                    }
                    context.productList = resultsProducts;
                    res.render('order_editor', context);
                });
            });
        });
    });

    router.post('/',function(req,res){

        if(req.body.submit_type == 'Remove Product(s)'){
            var mysql = req.app.get('mysql');
            mysql.pool.query("DELETE FROM Orders_Products WHERE (orderID=? AND productID=?)", [req.body.orderID,req.body.productID], function(error, results){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                res.redirect('/order_editor?orderID=' + req.body.orderID);
            });
        }

        if(req.body.submit_type == 'Add Product To Order/Update Existing Product Qty'){
            var mysql = req.app.get('mysql');
            mysql.pool.query("INSERT INTO Orders_Products (productID,orderID,quantityProducts) VALUES (?,?,?) ON DUPLICATE KEY UPDATE quantityProducts = " + req.body.qty_input, 
            [req.body.productID,req.body.orderID,req.body.qty_input], function(error, results){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                res.redirect('/order_editor?orderID=' + req.body.orderID);
            });
        }

    });

    return router;
}();
