var eatz = eatz || {};

eatz.pubSub = _.extend({}, Backbone.Events);

eatz.DishesView = Backbone.View.extend({


  initialize: function() {
		
		this.collection = new eatz.Dishes();
        
			this.collection.on('all', function() { this.render() }, this);
		
		this.collection.fetch();
		eatz.pubSub.on('sort', this.sortfunction, this);
				
		this.collection.bind("reset", this.render, this);

	},
	sortfunction : function (e) {
		console.log ("sortfunction");
		console.log (e);
		this.collection.sortByField(e.srcElement.id);
	},
	render : function() {
			var d = this;
			$(this.el).html("<ul class = 'thumbnails'></ul>");  
			this.collection.each(function (Dish){
      		var dv = new eatz.DishView({model:Dish});
          var item = $('<li>').append(dv.render().el);
				  $('.thumbnails', d.el).append(item);
			});
			return this; 
	}
});

