var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_moylel',
  password        : '5150',
  database        : 'cs340_moylel'
});

module.exports.pool = pool;
