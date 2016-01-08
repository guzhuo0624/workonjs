"use strict;"
var http = require('http'); 
var https = require('https');
var express = require('express');
var path = require('path');
// Express Web framework   
var fs = require('fs');
// config exports an object that defines attributes such as "port"
var config = require('./config.js');  

var eatz = require('./routes/eatz.js');  

var app = express();
 
var key_file = "eatz-key.pem";
var cert_file = "eatz-cert.pem";
var SSLconfig = {
  key: fs.readFileSync(key_file),
 cert: fs.readFileSync(cert_file)
};

// Configure app server
app.configure(function() {
    // use PORT environment variable, or local config file value
   app.set('port', process.env.PORT || config.port );

  // app.engine('html', cons.swig);

// set .html as the default extension 
//app.set('view engine', 'html');

    // change param value to control level of logging 
    app.use(express.logger('dev'));  

    // use compression (gzip) to reduce size of HTTP responses
    app.use(express.compress());
    

    // parses HTTP request-body and populates req.body
    app.use(express.bodyParser({
        uploadDir: __dirname + '/public/img/uploads',
        keepExtensions: true
	}));
	    
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

app.use(express.csrf());

 // location of app's static content 

    // return error details to client - use only during development
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));

app.get("/", function(req, res, next){
  console.log("trace 1");
 res.setHeader('X-CSRF-Token', req.csrfToken());
  next();
 /* var tmpl = swig.compileFile(__dirname + '/public/index.html');
var renderedHtml = tmpl({ token: req.csrfToken() });

res.writeHead(200, { 'Content-Type': 'text/html' });
res.end(renderedHtml); */ 
});
   app.use(express.static(__dirname + "/public"));

// Retrieve a single dish by its id attribute
app.get('/dishes/:id', eatz.getDish);

// Retrieve a single dish by its id attribute
app.get('/dishes', eatz.getDishes);

// Upload an image file and perform image processing on it
app.post('/dishes/image', eatz.uploadImage);

// Add dish
app.post('/dishes', eatz.addDish);

//Update dish
app.put('/dishes/:id', eatz.editDish);

//Update dish
app.delete('/dishes/:id', eatz.deleteDish);

// ADD CODE to support other routes listed on assignment handout
app.post('/auth',eatz.signup);
	app.put('/auth', eatz.login);
	app.get('/auth', eatz.isAuth);

// Start HTTP server

});

https.createServer(SSLconfig, app).listen(config.port, function () {
    console.log("Express server listening on port %d in %s mode",
      app.get('port'), config.env );
});