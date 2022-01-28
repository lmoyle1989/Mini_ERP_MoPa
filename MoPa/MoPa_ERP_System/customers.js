module.exports = function(){
    var express = require('express');
    var router = express.Router();

    router.get('/',function(req,res,next){
        var context = {};
        var mysql = req.app.get('mysql')
        var addresses;

        mysql.pool.query("SELECT * FROM Customers", function(error, results,fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;

            mysql.pool.query("SELECT Customers.customerID, customerFirstName, customerLastName, addressStreet, addressCity, addressState, addressZipCode FROM Customers INNER JOIN Addresses ON Customers.customerID = Addresses.customerID", function(error, resultsAddresses, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                addresses = resultsAddresses;
                for (var i = 0; i < context.customers.length; i++) {
                    context.customers[i].addressInfo = [];
                    for (var j = 0; j < addresses.length; j++) {        
                        if (context.customers[i].customerID == addresses[j].customerID) {
                            context.customers[i].addressInfo.push({street: addresses[j].addressStreet, city: addresses[j].addressCity, state: addresses[j].addressState, zipCode: addresses[j].addressZipCode});
                        }
                    }
                } 
                res.render('customers', context);
            });
        });
    });

    router.post('/',function(req,res){
        console.log(req.body);
        
        if(req.body.submit_type == 'Add Customer'){
            var mysql = req.app.get('mysql');
            mysql.pool.query("INSERT INTO Customers (customerFirstName,customerLastName,customerEmail,customerPhone) VALUES (?,?,?,?)", 
            [req.body.first_name_input,req.body.last_name_input,req.body.email_input,req.body.phone_number_input], function(error, results){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                res.redirect('/customers');
            });
        }

        if(req.body.submit_type == 'Delete Customer'){
            var mysql = req.app.get('mysql');
            mysql.pool.query("DELETE FROM Customers WHERE customerID=?", [req.body.customer_choice], function(error, results){
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
