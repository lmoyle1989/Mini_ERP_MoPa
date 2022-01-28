module.exports = function(){
    var express = require('express');
    var router = express.Router();

    router.get('/',function(req,res){
        var context = {};
        var mysql = req.app.get('mysql')
        var boms;    
        
        //We do a nested query here because we are manipulating our results object with the results of another query and it must be done in this order so we can't count callbacks
        mysql.pool.query("SELECT * FROM Products", function(error, resultsProducts, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            //results from the first query
            context.products = resultsProducts;
            mysql.pool.query("SELECT productName, partName, quantityParts FROM Products INNER JOIN Parts_Products ON Products.productID = Parts_Products.productID INNER JOIN Parts ON Parts.partID = Parts_Products.partID", function(error, resultsParts, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                //results from the second query
                boms = resultsParts;
                //These nested for loops append the lists of parts and their quantities to the context object for each product (from the first query), essentially displaying all the information from the M:M Products_Parts table sorted by Product
                //iterate through each product
                for (var i = 0; i < context.products.length; i++) {
                    //create a new empty array that is a property of each product object
                    context.products[i].bominfo = [];
                    //for each product, iterate through the whole Parts_Products table
                    for (var j = 0; j < boms.length; j++) {
                        //if the product names match, append the part info on that row to the new array we made above, creating a parts/qty list in the form of an array of objects [{partname, qty}, {partname,qty}, ...]
                        if (context.products[i].productName == boms[j].productName) {
                            context.products[i].bominfo.push({part: boms[j].partName, qty: boms[j].quantityParts});
                        }
                    }
                }
                res.render('products', context);
            });
        });
    });

    router.post('/',function(req,res,next){
        console.log(req.body);
        
        if(req.body.submit_type == 'Add Product'){
            var mysql = req.app.get('mysql');
            mysql.pool.query("INSERT INTO Products (productName,productMfgTimeHours,productInventory,productSalePrice) VALUES (?,?,?,?)", 
            [req.body.product_name_input,req.body.product_mfg_time_input,req.body.product_inventory_input,req.body.part_target_price_input], function(error, results){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                res.redirect('/products');
            });
        }

        if(req.body.submit_type == 'Delete Product'){
            var mysql = req.app.get('mysql');
            mysql.pool.query("DELETE FROM Products WHERE productID=?", [req.body.product_choice], function(error, results){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                res.redirect('/products');
            });
        }

        if(req.body.submit_type == 'Update Product Attributes'){
            var mysql = req.app.get('mysql');
            mysql.pool.query("UPDATE Products SET productName=?, productMfgTimeHours=?, productInventory=?, productSalePrice=? WHERE productID=?", 
            [req.body.product_name_input,req.body.product_mfg_time_input,req.body.product_inventory_input,req.body.product_target_price_input,req.body.productID], function(error, results){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                res.redirect('/products');
            });
        }

    });

    return router;
}();
