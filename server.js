
// -----------------------------------------------------------
// Webserver setup and configuration
//
// -----------------------------------------------------------
var  express = require('express');

var app = express();



app.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
    }
);




app.use(express.static(__dirname + '/app'));

app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());
app.use(app.router);

app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// bootstrap all the application routes here
// var routes = require('./app/routes');
// routes.addApplicationRoutes(app);



var port = Number(process.env.PORT || 8000);
app.listen(port, function() {
  console.log("Listening on " + port);
});






