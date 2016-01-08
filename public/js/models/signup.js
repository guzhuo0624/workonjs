var eatz = eatz || {};
eatz.Signup = Backbone.Model.extend({

    idAttribute: "_id",
	url:'/auth',
  	initialize: function() {
			this.validators = {};
			var letterDigitRegex = /^[a-zA-Z0-9][a-zA-Z0-9]*$/
			var usernamereg = /^[a-z0-9]+$/i
			var Digit = /^[0-9]*$/
			var emailRegex =/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

			this.validators.username = function(value) {
					return (value && usernamereg.test(value)&&(_.escape(value)===value)) ? {isOK: true} : {isOK: false, errMsg:"Only Alpha Numeric allowed"};
			};
			this.validators.email = function(value) {
					return (value && emailRegex.test(value)&&(_.escape(value)===value)) ? {isOK: true} : {isOK: false, errMsg:"Invalid Email Address"};
			};
			this.validators.password = function(value) {
					return (value && value.length > 5) ? {isOK: true} : {isOK: false, errMsg:"Minimum 6 character password"};
			};
			this.validators.confirmpassword = function(value, model) {
					return (value && model.get('password') == value) ? {isOK: true} : {isOK: false, errMsg:"Confirm Password Mismatch"};
			};
			this.validators.rememberme = function(value, model) {
					return  {isOK: true};
			};
			this.validators.sortby = function(value, model) {
					return  {isOK: true};
			};
			
		},

		validateField: function(field, value, model) {
			return (this.validators[field](value,model));
		},
		
		validateAll: function(model) {
				var results = {};
				for (i in this.validators) {
						if (this.validators.hasOwnProperty(i)) {
				 			var valid = this.validators[i](model.get(i), model);
							results[i] = valid;
						}; 
				};
				return (results);
		},
		
    defaults: {
			username : "",
      email : "",
      password: "",
	  confirmpassword:"",
	  rememberme:""
			
    }

});




