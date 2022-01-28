module.exports = function(){
    var express = require('express');
    var router = express.Router();

    router.get('/',function(req,res){
        var context = {};
        var mysql = req.app.get('mysql')
        mysql.pool.query("SELECT * FROM Parts", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.parts = results;
            res.render('parts', context);
        });
    });

    router.post('/',function(req,res){
        console.log(req.body);
        
        if(req.body.submit_type == 'Add Part'){
            var mysql = req.app.get('mysql');
            mysql.pool.query("INSERT INTO Parts (partName,partCost,partVendor,partCurrentStock,partLeadTimeDays) VALUES (?,?,?,?,?)", 
            [req.body.part_name_input,req.body.part_cost_input,req.body.part_vendor_input,req.body.part_stock_input,req.body.part_lead_time_input], function(error, results){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                res.redirect('/parts');
            });
        }

        if(req.body.submit_type == 'Delete Part'){
            var mysql = req.app.get('mysql');
            mysql.pool.query("DELETE FROM Parts WHERE partID=?", [req.body.part_choice], function(error, results){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                res.redirect('/parts');
            });
        }

    });

    return router;
}();
