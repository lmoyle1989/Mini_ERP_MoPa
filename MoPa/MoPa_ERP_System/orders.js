module.exports = function(){
    var express = require('express');
    var router = express.Router();

    router.get('/',function(req,res,next){
        var context = {};
        var mysql = req.app.get('mysql');
        mysql.pool.query("SELECT Customers.customerID, customerFirstName, customerLastName, customerEmail, COUNT(Orders.orderID) AS 'orderQty' FROM Customers LEFT JOIN Addresses ON Customers.customerID = Addresses.customerID LEFT JOIN Orders ON Addresses.addressID = Orders.addressID GROUP BY Customers.customerID ORDER BY customerFirstName ASC", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customerOrders = results;
            res.render('orders', context);
        });
    });

    router.post('/',function(req,res,next){
        console.log(req.body);
        
        if(req.body.submit_type == 'Search By First Name'){
            var context = {};
            var mysql = req.app.get('mysql');
            mysql.pool.query("SELECT Customers.customerID, customerFirstName, customerLastName, customerEmail, COUNT(Orders.orderID) AS 'orderQty' FROM Customers LEFT JOIN Addresses ON Customers.customerID = Addresses.customerID LEFT JOIN Orders ON Addresses.addressID = Orders.addressID WHERE customerFirstName LIKE '" + req.body.customerFirstName + "%' GROUP BY Customers.customerID ORDER BY customerFirstName ASC", function(error, results){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.customerOrders = results;
                res.render('orders', context);
            });
        }

        if(req.body.submit_type == 'Search By Last Name'){
            var context = {};
            var mysql = req.app.get('mysql');
            mysql.pool.query("SELECT Customers.customerID, customerFirstName, customerLastName, customerEmail, COUNT(Orders.orderID) AS 'orderQty' FROM Customers LEFT JOIN Addresses ON Customers.customerID = Addresses.customerID LEFT JOIN Orders ON Addresses.addressID = Orders.addressID WHERE customerLastName LIKE '" + req.body.customerLastName + "%' GROUP BY Customers.customerID ORDER BY customerFirstName ASC", function(error, results){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.customerOrders = results;
                res.render('orders', context);
            });
        }
    });

    return router;
}();