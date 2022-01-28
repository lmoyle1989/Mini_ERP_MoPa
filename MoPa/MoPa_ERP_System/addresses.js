module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var addresses;

    router.get('/',function(req,res){
        var context = {};
        var mysql = req.app.get('mysql');
        console.log(req.query);
        mysql.pool.query("SELECT * FROM Customers WHERE customerID = ?", [req.query.customerID], function(error, resultsCustomers, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customerInfo = resultsCustomers;
            mysql.pool.query("SELECT addressStreet, addressCity, addressState, addressZipCode FROM Customers INNER JOIN Addresses ON Customers.customerID = Addresses.customerID WHERE Customers.customerID = ?", [req.query.customerID], function(error, resultsAddresses, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.addressInfo = resultsAddresses;
                console.log(context);
                res.render('addresses', context);
            });
        });
    });

    router.post('/',function(req,res,next){
        console.log(req.body);

        if(req.body.submit_type == 'Update Customer'){
            var mysql = req.app.get('mysql');
            mysql.pool.query("UPDATE Customers SET customerFirstName=?, customerLastName=?, customerEmail=?, customerPhone=? WHERE customerID=?", 
            [req.body.first_name_input,req.body.last_name_input,req.body.email_input,req.body.phone_number_input,req.body.customerID], function(error, results){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                res.redirect('/customers');
            });
        }
        if(req.body.submit_type == 'Add New Address'){
            var mysql = req.app.get('mysql');
            mysql.pool.query("INSERT INTO Addresses (addressStreet,addressCity,addressState,addressZipCode,customerID) VALUES (?,?,?,?,?)", 
            [req.body.street_input,req.body.city_input,req.body.state_input,req.body.zip_input,req.body.customer_ID], function(error, results){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                res.redirect('/customers');
            });
        }

    });

    return router;
}();
