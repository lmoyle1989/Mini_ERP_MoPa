module.exports = function(){
    var express = require('express');
    var router = express.Router();

    router.get('/',function(req,res){
        var context = {};
        var mysql = req.app.get('mysql');
        console.log(req.query);
        mysql.pool.query("SELECT * FROM Customers WHERE customerID = ?", [req.query.customerID], function(error, resultsCustomer, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customer = resultsCustomer;
            mysql.pool.query("SELECT * FROM Addresses WHERE customerID = ?", [req.query.customerID], function(error, resultsAddresses, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.addresses = resultsAddresses;
                mysql.pool.query("SELECT Orders.orderID, Orders.orderSalePrice, DATE_FORMAT(Orders.orderEntryDate, '%Y-%m-%d') AS orderEntryDate, DATE_FORMAT(Orders.orderDueDate, '%Y-%m-%d') AS orderDueDate, Orders.orderTrackingNumber, Addresses.addressStreet, Addresses.addressCity, Addresses.addressState, Addresses.addressZipCode FROM Orders INNER JOIN Addresses ON Orders.addressID = Addresses.addressID INNER JOIN Customers ON Addresses.customerID = Customers.customerID WHERE Addresses.customerID = ?", [req.query.customerID], function(error, resultsOrders, fields){
                    if(error){
                        res.write(JSON.stringify(error));
                        res.end();
                    }
                    context.orders = resultsOrders;
                    console.log(context);
                    res.render('order_creator', context);
                }); 
            });
        });
    });

    router.post('/',function(req,res){
        console.log(req.body);
        if(req.body.submit_type == 'Add Order'){
            var mysql = req.app.get('mysql');
            mysql.pool.query("INSERT INTO Orders (addressID,orderSalePrice,orderEntryDate,orderDueDate,orderTrackingNumber) VALUES (?,?,CURDATE(),?,?)", 
            [req.body.addressID,req.body.price_input,req.body.due_date_input,req.body.tracking_input], function(error, results){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                res.redirect('/order_creator?customerID=' + req.body.customerID);
            });
        }

    });

    return router;
}();
