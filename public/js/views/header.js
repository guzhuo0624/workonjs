var eatz = eatz || {};
eatz.HeaderView = Backbone.View.extend({

    initialize: function () {
				this.render();
    },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
		return this;
  },
	events: {
		'click #signup':'signup',
		'click #logout':'signout',
		'click #btnLogin':'authenticate',
		'change': 'inputChange',
		'click input[name=sortby]:checked': 'onRadioClick'
	},
	onRadioClick : function (e)	{
		var location;
		if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
        		if(e.currentTarget.id==="distance"){
					$.cookie('lat', position.coords.latitude);
					$.cookie('lon', position.coords.longitude);
					$.get('/dishes');
				}
        	});
	    } else { 
	        console.log("Geolocation is not supported by this browser.");
	    }

		
		eatz.pubSub.trigger('sort', e);  
	},
     selectMenuItem: function(menuItem){
				$("li.active").removeClass("active");
				$("." + menuItem).addClass("active");
			console.log("in selectMenuItem");
  },
  inputChange: function(event) {
		var name = event.target.name;
		var value = event.target.value;
		var isOK = this.model.validateField(event.target.name, event.target.value, this.model);
		if (!isOK.isOK) {
				eatz.utils.showValidationError(event.target.name, isOK.errMsg);
		} else {
				eatz.utils.clearValidationError(event.target.name);
				var data = {};
				data[name] = value;
				console.log(value);
				this.model.set(data);
		}
	},
	signup: function(event) {
	var result = {};
		result = this.model.validateAll(this.model);
		console.log(result);
		for (i in result) {
				if (!result[i].isOK) {
						console.log(i);
						eatz.utils.showValidationError(i, result[i].errMsg);
				} else {
						console
						eatz.utils.clearValidationError(i);
				}
		}
		var save = 0;
		for (i in result) {
				if (!result[i].isOK) {
						save++;
				}
		}
		if(save == 0) {
	this.render();
	this.model.save({}, {
						wait:true,
						success: function(model, response) {
						if(response.success != false) {
						$('#loggedin').show();
						$('#signupform').hide();
						$('#menuLogin').hide();
						} else {
						eatz.utils.showNotice("error", response.errormsg);
						}
						},
						error: function() {
						}	
			});
			}
	
	},
	signout: function(event){
	
	this.model.save({login:false},{success: function(model, response) {
		if(response.success === false) {
			eatz.utils.showNotice("error", response.errormsg);
		} else {
			location.reload();
		}
	}
	});
						
	},

	  selectMenuItem: function(menuItem){
				$("li.active").removeClass("active");
				$("." + menuItem).addClass("active");
console.log("in selectMenuItem");
    },
	authenticate: function(event) {
	
	this.model.set('_id',1);
	this.render();
	this.model.save({login:true},{success: function(model, response) {
	if(response.success === false) {
	eatz.utils.showNotice("error", response.errormsg);
	} else {
						$('#loggedin').show();
						$('#signupform').hide();
						$('#menuLogin').hide();
	}
	}
	});
	
	}
});

