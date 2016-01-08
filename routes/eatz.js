"use strict";

var fs = require('fs');
// GraphicsMagick (gm) for Node is used to resize user-supplied images
var gm = require('gm').subClass({imageMagick: true});
var express = require("express");
/*
var mongoose = require('mongoose'); // MongoDB integration

mongoose.connect('mongodb://localhost/mathlab');*/
var config = require(__dirname + '/../config');

var bcrypt = require("./bCrypt");
var mongoose = require('mongoose');

mongoose.connect('mongodb://' + config.dbuser + ':' + config.dbpass+ '@' +config.dbhost+'/' +config.dbname);


//autoIncrement.initialize(connection);


// Schemas
var Dish = new mongoose.Schema({
    name: { type: String, required: true},
    venue: { type: String, required: true},
    info : { type: String, required: false },
	number: { type: String, required: true },
	street: { type: String, required: true },
	city: { type: String, required: true },
	province: { type: String, required: true },
	url: { type: String, required: false },
	image: { type: String, required: true }
	
});
Dish.add({loc : { lat : Number, lng :  Number}});
Dish.index({ name: 1, venue: 1 }, { unique: true });
Dish.index({ loc: "2d" });

// Models
//var DishModel = mongoose.model('Dish', Dish);
//User.plugin(autoIncrement.plugin, 'Dish');
var DishModel = mongoose.model('Dish', Dish);


var User = new mongoose.Schema({
    username: { type: String, required: true, unique:true },
    password : { type: String, required: true },
	email: { type: String, required: true, unique:true }
});


// Models
//User.plugin(autoIncrement.plugin, 'User');
var UserModel = mongoose.model('User', User);

// Implement the eatz API:

// heartbeat response for server API
exports.api = function(req, res){
  res.send(200, '<h3>Eatz API is running!</h3>');
};

// retrieve an individual dish model, using it's id as a DB key
exports.getDish = function(req, res){
    DishModel.findById(req.params.id, function(err, dish) {
        if (err) {
            res.send(500, "Sorry, unable to retrieve dish at this time (" + err.message+ ")" );
        } else if (!dish) {
            res.send(404, "Sorry, that dish doesn't exist; try reselecting from browse view");
        } else {
            res.send(200, dish);
        }
    });
};

// retrieve an individual dish model, using it's id as a DB key
exports.getDishes = function(req, res){	
  	var lat = req.cookies.lat; 
  	var lon = req.cookies.lon;
  	req.cookies.lon = "";
  	req.cookies.lat = "";
  	if(!!lat && lat!==""){
  		DishModel.geoNear(lon, lat, {spherical: true});
  	}  	
	DishModel.find({}, function(error, dishes){
		if (!error)
		{
			//console.log (dishes);
			res.send(dishes);
		}
	});
};

exports.addDish = function(req, res){
	DishModel.findOne({name:req.body.name, venue:req.body.venue}, function(e, result)
	{
		if (result)
		{
		res.send(200, {success:false, errormsg:"Sorry a Dish with same venue already in the system!"});
		} else {
		var dish = new DishModel(
				{name : req.body.name,
				venue : req.body.venue,
				info : req.body.info,
				number : req.body.number,
				street : req.body.street,
				city : req.body.city,
				province : req.body.province,
				url : req.body.url,
				image : req.body.image,
				loc:{lat:req.body.lat, lng:req.body.lng}
				});
	
	dish.save(function(error, dish)
	{
		if(!error)
		{
			res.send(200, {success:true, errormsg:"Dish Saved Successfully!"}); // return model
		}
		else 
		{ 
			res.send(200, "Dish is not saved");
		}
	});
	}
	});
};


exports.editDish = function(req, res){
	DishModel.findById(req.params.id, 
	function(findErr, dish1)
	{
		if(!findErr)
		{
			dish1.name = req.body.name;
			dish1.venue = req.body.venue;
			dish1.info = req.body.info;
			dish1.number = req.body.number;
			dish1.street = req.body.street;
			dish1.city = req.body.city;
			dish1.province = req.body.province;
			dish1.url = req.body.url;
			dish1.image = req.body.image;
			dish1.loc={lat:req.body.lat, lng:req.body.lng};
			// update dish attributes from req.body
			dish1.save(function(saveErr, dish) 
			{
				if (!saveErr) 
				{
					res.send(200, {success:true, edited:true, errormsg:"Dish Updated Successfully!"}); // return model
				}
				else 
				{ 
					res.send(200, dish);
				}
			});
		}
		else
		{
			res.send(404, "Sorry, that dish doesn't exist; try reselecting from browse view");
		}
	});
};


exports.deleteDish = function(req, res){
	DishModel.findById(req.params.id, 
	function(findErr, dish1)
	{
		if(!findErr)
		{
			// update dish attributes from req.body
			dish1.remove(function(err) 
			{
				if (!err) 
				{
					console.log("Deleted");
					res.send(''); // return model
				}
				else 
				{ 
					console.log (err);
					res.send(200, dish);
				}
			});
		}
		else
		{
			res.send(404, "Sorry, that dish doesn't exist; try reselecting from browse view");
		}
	});
};


var getFileID = (function(id) {
		return function() {
			return id++;
		}
	})(0);

	
exports.uploadImage = function (req, res) {
	var data_url = req.body.files;
	var matches = data_url.match(/^data:.+\/(.+);base64,(.*)$/);
	var ext = matches[1];
	var base64_data = matches[2];
	var buffer = new Buffer(base64_data, 'base64');
	//Get Unique Id
	var d1 = new Date();
	d1.toUTCString();
	console.log (d1);
	d1 = Math.floor(d1.getTime()/ 1000);
	console.log (d1);
	var filename = 'public/img/uploads/filename' +getFileID ()+d1 + ".png";
	fs.writeFile( filename, buffer, function (err)
	{
		var targetfilenumber = getFileID () +d1;
		var target = 'public/img/uploads/filename' + targetfilenumber + ".png";
		 gm(filename)
		.resize(360, 270)
		.noProfile()
		.write(target, function (err) 
		{
			if (!err) 
			{
				var file = 'img/uploads/filename' + targetfilenumber + ".png";
				console.log(file);
				res.send(file);
				
			}
			else
			{
				console.log(err);
			}
			
		});
	  
	})
	//Delete temp file
};
exports.signup = function (req, res){	
var request = req.body;
	console.log(request);			
			 var hashpass =  bcrypt.hashSync(request.password);
			 console.log(hashpass);
			 var user = new UserModel({email:request.email, 
							username:request.username,
							 password:hashpass,
							});
							
							user.save(function(err,user) {
	  if (!err) {
	  req.session.auth = true;
		req.session.username = user.username;
		req.session.userid = user._id;
	  res.send(200,user);
	  }else{
	   if (err.err.indexOf("E11000") != -1) {
	   res.send(200,{success:false, errormsg:"Either email or Username already exist in system"});
	   } else {
	   res.send(200,{success:false, errormsg:"Either email or Username already exist in system"});
	   }
	  
	  };
	});
};

exports.isAuth = function (req, res){
	if(req.session && req.session.auth === true){
	res.send(200, {username:req.session.username,userid:req.session.userid});
	}else{
	res.send(200, {username:null,userid:null});
	}
};

exports.login = function (req, res){
res.cookie('rememberme', 'yes', { expires: 0, httpOnly: true });	
	var request = req.body;
	console.log(request);
	if(request.login){
	UserModel.findOne({username:request.username}, function(e, result) 
		{
			if (result)
			{
				var isValid = bcrypt.compareSync(request.password, result.password);
				if (isValid === true)
				{
					req.session.auth = true;
					req.session.username = result.username;
					req.session.userid = result._id;
					result.success = true;
					res.send(200,result);
					console.log("Login Success!");
					if(req.rememberme == '1') {
					req.session.cookie.maxAge = 10000;
					}
				}
				else
				{
					res.send(200,{success:false, errormsg:"Incorrect Password"}); 
					console.log("Password incorrect");
				}
			} else{
			res.send(200,{success:false, errormsg:"Incorrect User Name"}); 
			}	
		});	
		} else {
					req.session.auth = false;
					req.session.username ='';
					req.session.userid = '';
		res.send(200,{success:true, msg:"Log Out Successful"}); 
		}
};
