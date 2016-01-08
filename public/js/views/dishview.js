var eatz = eatz || {};

eatz.DishView = Backbone.View.extend({

  initialize: function() {
	},

	render : function() {
			this.$el.html(this.template(this.model.toJSON()));  // create DOM content for HomeView
			return this;    // support chaining
	}
});
