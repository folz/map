import Ember from 'ember';

export default Ember.Controller.extend({
    userLocationString: "",
    userLocationCoords: {lat: "39.828175", lng: "-98.5795"},

    init: function() {
        this.set('geocoder', new google.maps.Geocoder());
    },

    stringDidUpdate: function() {
        Ember.run.debounce(this, this.geocodeLocationString, 750);
    }.observes('userLocationString'),

    geocodeLocationString: function() {
        var geocoder = this.get('geocoder');

        geocoder.geocode({ address: this.get('userLocationString') }, function(results, status) {
            console.log(results);
            this.set('userLocationCoords', { lat: results[0].geometry.location.k, lng: results[0].geometry.location.B })
        }.bind(this));
    }
});
