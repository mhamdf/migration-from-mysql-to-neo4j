var express = require('express');
var router = express.Router();
var URL = require('url');


var textN = "";
var textR = "";


/* GET home page. */

router.get('/migration', function(req, res, next) {
  

  var db = [];

  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
  });
   
  
  connection.query("show databases", function(err, rows){
  if(err) {
    throw err;
  } else {
    var k=0;
     console.log(rows);
     for(var i in rows){
      if(rows[i]['Database'] != "performance_schema"
        && rows[i]['Database'] != "mysql"&& rows[i]['Database']!=
        "information_schema" && rows[i]['Database']!=
        "sys"){
         db[k] =rows[i]['Database'];
        k++;
        }
     }
 
  res.render('migration', { title: 'La migration', db:db});



  }
  });

});


router.get('/', function(req, res, next) {
  res.render('neo4j', { title: 'Neo4j Manager' });
});


router.get('/nosql', function(req, res, next) {
  res.render('nosql', { title: 'NOSQL' });
});

router.get('/sgbdr', function(req, res, next) {
  res.render('sgbdr', { title: 'Les bases relationnelles' });
});

router.get('/resultat', function(req, res, next) {
  res.render('resultat', { title: 'Résultat',textN:textN,textR:textR });
});





//Post des bases
router.post("/base",function(req, res, next){
  
  var obj = {};
  console.log('body: ' + JSON.stringify(req.body));

  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : req.body.db
  });
  console.log(req.body);

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
    });
  
  connection.query("show tables", function(err, rows){
  if(err) {
    throw err;
  } else {
          console.log("show tables");
          console.log(rows);
          var row = [];
          var data = "Tables_in_"+ req.body.db;
          console.log(data);
          for(var i in rows){
            row[i]=rows[i][data];
            console.log(row[i]);
          }
          res.send(row);
        } 
  });
});


//Post des tables
router.post("/tables",function(req, res, next){
  
  var obj = {};
  console.log('table: ' + JSON.stringify(req.body));

  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : req.body.db
  });
  console.log(req.body);

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
    });

 var async = require('async');
 async.waterfall([
    function(callback) {
  txt = "DESCRIBE "+ req.body.tab;
  connection.query(txt, function(err, rows){
  if(err) {
    throw err;
  } else {
          console.log(rows);
          var col = [];
          for(var i in rows){
            col[i]=rows[i]['Field'];
            console.log(col[i]);
          }
         callback(null,col);
        } 
  });
        
    },
    function(colonne,callback) {
      var txt = "Select * from " + req.body.tab;  
      connection.query(txt, function(err, rows){
      if(err) {
        throw err;
      } else {
        var result = {};
        result.col = colonne;
        result.val = rows;
         callback(null,result);
        }
         
      });
    }
  ], function(err, results) {
    if(err){
      throw err;
    }
    console.log("Le resultat ");
    console.log(results);
    res.send(results);
  });
});


// la Migration des Noeuds
router.post("/migrerN",function(req, res, next){

  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : req.body.db
  });

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });

   var async = require('async');
   async.waterfall([
    function(callback) {
      connection.query("show tables", function(err, rows){
      if(err) {
      throw err;
      } else {
          var data = "Tables_in_"+ req.body.db;
          var tab = [];
          for(var i in rows){
            tab[i]=rows[i][data];
            console.log(tab[i]);
            
          }
         callback(null,tab);
        } 
    });
        
    },
    function(table,callback) {
      var txt = "DESCRIBE "+table[1];
      connection.query(txt, function(err, rows){
      if(err) {
        throw err;
      } else {
        //console.log(rows);
        var result = {};
        result.tab = [];
        for(var j in table){
        result.tab[j]= table[j];
        }
        var col =[];
        for(var i in rows){
            col[i]=rows[i]['Field'];
            console.log(col[i]);
          }
        result.val = col;
        callback(null,result);
        }
         
      });
    },
    function(tabrow,callback) {
      console.log(tabrow);
      var txt = "select * from " + tabrow.tab[1];
      console.log(txt);
      connection.query(txt, function(err, rows){
      if(err) {
        throw err;
      } else {
        var results = {};
        results.col = tabrow;
        results.ch = rows;
        
        callback(null,results);
        }
         
      });
    }
  ], function(err, results) {
    if(err){
      throw err;
    }
    console.log("Le resultat ");
    console.log(results);
    var txt = "CREATE ";
    for(var i=0 ;i< results.ch.length-1;i++){
    txt += "(:"+results.col.tab[1]+"{";      
        for(var j=0 ; j<results.col.val.length-1;j++){
          txt+=results.col.val[j]+":'"+results.ch[i][results.col.val[j]]+"',";
        }
      txt+=results.col.val[j]+":'"+results.ch[i][results.col.val[j]]+"'}),";
    }
    txt += "(:"+results.col.tab[1]+"{";
    for(var j=0 ; j<results.col.val.length-1;j++){
    txt+=results.col.val[j]+":'"+results.ch[i][results.col.val[j]]+"',";  
  }
    txt+=results.col.val[j]+":'"+results.ch[i][results.col.val[j]]+"'})";
    console.log("le text est ");
    console.log(txt);
    textN = txt;
    db.cypherQuery(txt,{
     },function(err,result){
    if(err){
      return  console.log(err.stack);
    }
    });
    res.send(results);
  });

});



//La migration des relations
router.post("/migrerR",function(req, res, next){

  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : req.body.db
  });
  console.log("la relation est :");
  console.log(req.body.relation);

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });

   var async = require('async');
   async.waterfall([
    function(callback) {
      connection.query("show tables", function(err, rows){
      if(err) {
      throw err;
      } else {
          var data = "Tables_in_"+ req.body.db;
          var tab = [];
          for(var i in rows){
            tab[i]=rows[i][data];
            console.log(tab[i]);
            
          }
         callback(null,tab);
        } 
    });
        
    },
    function(table,callback) {
      var txt = "DESCRIBE "+table[0];
      connection.query(txt, function(err, rows){
      if(err) {
        throw err;
      } else {
        //console.log(rows);
        var result = {};
        result.tab = [];
        for(var j in table){
        result.tab[j]= table[j];
        }
        var col =[];
        for(var i in rows){
            col[i]=rows[i]['Field'];
            console.log(col[i]);
          }
        result.val = col;
        callback(null,result);
        }
         
      });
    },
    function(tabrow,callback) {
      console.log(tabrow);
      var txt = "select * from " + tabrow.tab[0];
      console.log(txt);
      connection.query(txt, function(err, rows){
      if(err) {
        throw err;
      } else {
        var results = {};
        results.col = tabrow;
        results.ch = rows;
        
        callback(null,results);
        }
         
      });
    }
  ], function(err, results) {
    if(err){
      throw err;
    }
    console.log("Le resultat ");
    console.log(results);
    
    for(var i in results.ch){
     var txt ="";
     txt+= "MATCH (a:"+results.col.tab[1]+"{"+results.col.val[1]+":'"+results.ch[i][results.col.val[0]]+"'}),";
     txt+= "(b:"+results.col.tab[1]+"{"+results.col.val[1]+":'"+results.ch[i][results.col.val[1]]+"'}) \n";
     txt+= "CREATE (a)-[:"+req.body.relation+"{"+results.col.val[2]+":'"+results.ch[i][results.col.val[2]]+"'}]->(b)\n";
     textR+=txt;
     db.cypherQuery(txt,{
     },function(err,result){
    if(err){
      return  console.log(err.stack);
    }
    });
    }
    console.log("le text est ");
    console.log(txt);
    res.send(results);
  });

});

/*router.post("/resultat",function(req, res, next){
	req.method = 'GET'; 
  res.redirect('http://localhost:3000/resultat');
});

*/
module.exports = router;