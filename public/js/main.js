var eatz = eatz || {};

eatz.utils.loadTemplates(['HomeView', 'HeaderView', 'AboutView', 'EditView','DishView', 'MapView'], function() {
    app = new eatz.AppRouter();
    Backbone.history.start();
});

eatz.AppRouter = Backbone.Router.extend({

    routes: {
        "": "home",
				/*home view*/
				"about": "showAbout",
				/*about view*/
				"header": "showHeader",
				"dishes": "showDishes",
        "dishes/add" : "showEdit",
				"dishes/:id" : "showDish"
    },

    initialize: function() {
				this.showHeader();
				//this.home();
    },

    home: function() {
        if (!this.homeView) {
            this.homeView = new eatz.HomeView();
        }
        $('#content').html(this.homeView.el);
				this.headerView.selectMenuItem("home");
    },

		showAbout: function(){
			if (!this.aboutView) {
					this.aboutView = new eatz.AboutView();
			}
			$('#content').html(this.aboutView.el);
			this.headerView.selectMenuItem("about");
		},

		showDish: function(id) {
        if (!this.dishes) {
            var dishes = new eatz.Dishes();
        }
				dishes.fetch({
						success: function() {
								var d = dishes.get(id);
								var ev = new eatz.EditView({model:d, collection:dishes});
								$('#content').html(ev.render().el);
								ev.map();
						}
				});
				this.headerView.selectMenuItem("edit");
		},

    showEdit: function() {
        if (!this.dishes) {
            var dishes = new eatz.Dishes();
        }
				dishes.fetch ({
						success: function() {
								var dish = new eatz.Dish();
								dishes.add(dish);
								var ev = new eatz.EditView({model:dish, collection:dishes});
        				$('#content').html(ev.render().el); 
        				ev.map();       					
						}
				});
				this.headerView.selectMenuItem("edit");
    },

		showDishes: function() {
				if (!this.dishes) {
						var dishes = new eatz.Dishes();
				} 
				dishes.fetch ({
						success: function() {
								var bv = new eatz.DishesView({collection:dishes});
								$('#content').html(bv.render().el);
								
						}
				});
				this.headerView.selectMenuItem("dish");
		},
		
    showHeader: function() {
        if (!this.headerView) {
		var signup = new eatz.Signup();
            this.headerView = new eatz.HeaderView({model:signup});
        }
        $('#header').html(this.headerView.el);
		}
});
