var eatz = eatz || {};

eatz.Dishes = Backbone.Collection.extend({

  // Reference to this collection's model.
  model: eatz.Dish,

  // Save all of the todo items under the `"todos-backbone"` namespace.
  //localStorage: new Backbone.LocalStorage('eatz')
	url: "/dishes",
	sort_key: 'name', // default sort key

	comparator: function(a, b) {
        if ( a.get(this.sort_key) > b.get(this.sort_key) ) return 1;
        if ( a.get(this.sort_key) < b.get(this.sort_key) ) return -1;
        if ( a.get(this.sort_key) === b.get(this.sort_key) ) return 0;
    },
	sortByField: function (fieldName) {
      this.sort_key = fieldName;
			this.sort();
    }
});
// Create our global collection of **Todos**.
