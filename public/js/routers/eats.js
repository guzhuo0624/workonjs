var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/colleage');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Server Running');
});

var userSchema =  require('../schemas/user');
exports.newUser = function(req, res) 
{
	console.log('New User');
	console.log(req.body);
	var request = req.body;
	var record =  new userSchema({username : request.uname,
		email: request.email,
		password: request.password });
	
	
};