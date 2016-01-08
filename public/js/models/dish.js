var eatz = eatz || {};

eatz.Dish = Backbone.Model.extend({

		urlRoot: "/dishes",
    idAttribute: "_id",
  	initialize: function() {
			this.validators = {};
			var letterDigitRegex = /^[a-zA-Z0-9][a-zA-Z0-9]*$/
			var Digit = /^[0-9]*$/
			this.validators.name = function(value) {
					return (value && (letterDigitRegex.test(value))&&(_.escape(value)===value)) ? {isOK: true} : {isOK: false, errMsg:"Only 1 or more letters and/or digits allowed"};
			};
			this.validators.venue = function(value) {
					return (value && letterDigitRegex.test(value)&&(_.escape(value)===value)) ? {isOK: true} : {isOK: false, errMsg:"Only 1 or more letters and/or digits allowed"};
			};
			this.validators.info = function(value) {
					return (value && letterDigitRegex.test(value)&&(_.escape(value)===value)) ? {isOK: true} : {isOK: false, errMsg:"Only 1 or more letters and/or digits allowed"};
			};
			this.validators.url = function(value) {
					return (value && value.substring(0,7) == 'http://'&&(_.escape(value)===value)) ? {isOK: true} : {isOK: false, errMsg:"not valid format URL"};
			};
			this.validators.number = function(value) {
					return (value && Digit.test(value)&&(_.escape(value)===value)) ? {isOK: true} : {isOK: false, errMsg:"Only 1 or more digits allowed"};
			};
			this.validators.street = function(value) {
					return (value && letterDigitRegex.test(value)&&(_.escape(value)===value)) ? {isOK: true} : {isOK: false, errMsg:"Only 1 or more letters and/or digits allowed"};
			};
			this.validators.city = function(value) {
					return (value && letterDigitRegex.test(value)&&(_.escape(value)===value)) ? {isOK: true} : {isOK: false, errMsg:"Only 1 or more letters and/or digits allowed"};
			};
		},

		validateField: function(field, value) {
			return (this.validators[field](value));
		},
		
		validateAll: function(model) {
				var results = {};
				for (i in this.validators) {
						if (this.validators.hasOwnProperty(i)) {
				 			var valid = this.validators[i](model.get(i));
							results[i] = valid;
						}; 
				};
				return (results);
		},
		
    defaults: {
      name : "",
			venue : "",
			info : "",
      number : "1265",
      street: "Military Trail",
			city: "Scarborouugh",
			province : "ON",
			url : "",
			image : "img/burger.jpg"
    }

});
