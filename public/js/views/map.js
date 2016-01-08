var eatz = eatz || {};
eatz.MapView = Backbone.View.extend({

  latlng : new google.maps.LatLng(-34.397, 150.644),

  render: function() {
    this.$el.html(this.template());
    return this;
  },

  setCenter : function(lat, lon){
    this.latlng = new google.maps.LatLng(lat, lon);
    this.createMap();
  },

  createMap:function(){
    var map;
      var mapOptions = {
      zoom: 16,
      center: this.latlng
    }  

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var marker = new google.maps.Marker({
          map: map,
          position: this.latlng
      });
  },

  initialize : function () {   
    this.render();
  },

  codeAddress : function (address) {
    var geocoder = new google.maps.Geocoder();
    var me = this;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        me.latlng = results[0].geometry.location;
        me.createMap();   
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
});