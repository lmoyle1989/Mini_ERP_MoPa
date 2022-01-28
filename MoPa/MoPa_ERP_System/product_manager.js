module.exports = function(){
    var express = require('express');
    var router = express.Router();

    
    router.get('/',function(req,res){
        var context = {};
        var mysql = req.app.get('mysql');
        //triple nested query here, first for pre-filling the selected product's attribute fields, second for displaying the selected product's BOM, third for the drop-down list to add a new part to the selected product's BOM
        console.log(req.query);
        mysql.pool.query("SELECT * FROM Products WHERE productID = ?", [req.query.productID], function(error, resultsProduct, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.productInfo = resultsProduct;
            mysql.pool.query("SELECT productID, Parts_Products.partID, partName, quantityParts FROM Parts_Products INNER JOIN Parts ON Parts_Products.partID = Parts.partID WHERE productID = ?", [req.query.productID], function(error, resultsBOM, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.bomInfo = resultsBOM;
                mysql.pool.query("SELECT * FROM Parts", function(error, resultsPartsList, fields){
                    if(error){
                        res.write(JSON.stringify(error));
                        res.end();
                    }
                    context.partsList = resultsPartsList;
                    console.log(context);
                    res.render('product_manager', context);
                });
            });
        });
    });
    

    router.post('/',function(req,res,next){
        
        if(req.body.submit_type == 'Remove Part(s)'){
            var mysql = req.app.get('mysql');
            mysql.pool.query("DELETE FROM Parts_Products WHERE (partID=? AND productID=?)", [req.body.partID,req.body.productID], function(error, results){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                res.redirect('/product_manager?productID=' + req.body.productID);
            });
        }
        
        if(req.body.submit_type == 'Add Part To BOM/Update Existing Part Qty'){
            var mysql = req.app.get('mysql');
            mysql.pool.query("INSERT INTO Parts_Products (partID,productID,quantityParts) VALUES (?,?,?) ON DUPLICATE KEY UPDATE quantityParts = " + req.body.qty_input, 
            [req.body.partID,req.body.productID,req.body.qty_input], function(error, results){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                res.redirect('/product_manager?productID=' + req.body.productID);
            });
        }
            
    });

    return router;
}();
