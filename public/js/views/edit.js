var eatz = eatz || {};

eatz.EditView = Backbone.View.extend({

  initialize: function() {
		_.bindAll(this, "viewcallback");		
		eatz.pubSub.on('updateview', this.viewcallback, this)
		this.render();		
  },

map:function(){
	if (!this.mapView) {
            this.mapView = new eatz.MapView();
        }
        $('#map').html(this.mapView.el);
        console.log(this.model.attributes.city);
        this.mapView.codeAddress(this.model.attributes.city +", "+ this.model.attributes.street);
        this.mapView.createMap();
},

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

		return this;
  },
	
	events: {
		'change': 'inputChange',
		'click #save' : 'inputSave',
		'click #delete' : 'clear',
		'change .upload' : 'change',
		'dragover .drop-picture' : 'dragover',
		'drop .drop-picture' : 'drop',
		'click #location':'changeLocation'
  },

changeLocation:function(e){
	 if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setNewPosition);
    } else { 
        console.log("Geolocation is not supported by this browser.");
    }
    function setNewPosition(position){
    	$.get('https://geocoder.ca?latt='+position.coords.latitude+'&longt='+position.coords.longitude+'&reverse=1&geoit=XML', function(data){
    		var jsonObj = $.xml2json(data);
      		$('[name="city"]').val(jsonObj.geodata.city);
      		$('[name="number"]').val(jsonObj.geodata.stnumber);
      		$('[name="street"]').val(jsonObj.geodata.staddress);
    	});
    	this.mapView = new eatz.MapView();
    	this.mapView.setCenter(position.coords.latitude,position.coords.longitude);
    }
	//
},

viewcallback : function (res)
	{
		console.log ("viewcallback");
		console.log (res);
		console.log (this.model);
		
		var data = {};
		var name = 'image';
		data[name] = res;	
		console.log(this.model);
		this.model.set(data);
	},
	inputChange: function(event) {
		var name = event.target.name;
		var value = event.target.value;
		var isOK = this.model.validateField(event.target.name, event.target.value);
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
	
	inputSave : function() {
	var me = this;
	$.ajax({
			  url: '/auth',
			  contentType: false,
			  type: 'GET',
			  success: function(data){
			if(data.username != null){
		var result = {};
		var loc = {};
		var locate = me.model.attributes.city +", " + me.model.attributes.street+" "+ me.model.attributes.number; 
		$.get('https://geocoder.ca?locate='+locate+'1&geoit=XML', function(data){
    		var jsonObj = $.xml2json(data);
      		loc.lat = jsonObj.geodata.latt;
			loc.lng = jsonObj.geodata.longt;			 
    	});
		_.extend(me.model.attributes, loc);
		result = me.model.validateAll(me.model);
		for (i in result) {
				if (!result[i].isOK) {
						console.log(i);
						eatz.utils.showValidationError(i, result[i].errMsg);
				} else {
						eatz.utils.clearValidationError(i);
				}
		}
		var save = 0;
		for (i in result) {
				if (!result[i].isOK) {
						save++;
				}
		}
		console.log(save);
		
		if (save == 0) {
			//need to comment below comment once we get new filename from callback. 
			me.collection.add(me.model);
			me.model.save({}, {
						wait:true,
						success: function(model, response) {
							var status = "error";
							if(response.success != false) {
							app.navigate('dishes', {trigger: true});
							status = "success";
						}
							if(response.edited){
							status = "info"
						}
						eatz.utils.showNotice(status, response.errormsg);
						},
						error: function() {
							console.log ("Dish is not saved");
						}	
			});
		}
				} else {
				eatz.utils.showNotice("error", "Please log in or sign up");
				}
			  }
			});
	},
	
	dragover: function (event) {
		event.preventDefault();
	},

	drop: function(event) {
			event.preventDefault();
			event.stopPropagation();
			var ev = event.originalEvent;
			ev.dataTransfer.dropEffect = 'copy';
			this.picture = ev.dataTransfer.files[0];
			var fr = new FileReader();
			fr.onloadend = function() {
					$('.drop-picture img').attr('src', fr.result);
					eatz.utils.uploadFile (fr.result, eatz.EditView.viewcallback);
			};
			fr.readAsDataURL(this.picture);
	},

	change: function(event) {
			event.preventDefault();
			event.stopPropagation();
			this.picture = event.target.files[0];
			
			var fr = new FileReader();
			var callback = _.bind(this.viewcallback, this);
			var this1 = this;
			fr.onloadend = function() {
					$('.drop-picture img').attr('src', fr.result);
					
					console.log (callback);
					eatz.utils.uploadFile (fr.result, callback);
			};
			fr.readAsDataURL(this.picture);
			console.log (fr);
	},
	
  clear: function() {
    this.model.destroy();
		app.navigate('dishes', {trigger: true});
  }
});