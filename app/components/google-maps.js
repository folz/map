import Ember from 'ember';

export default Ember.Component.extend({
    insertMap: function() {
        var container = this.$(".map-canvas");

        var options = {
            center: new google.maps.LatLng(this.get('latitude'), this.get('longitude')),
            zoom: parseInt(this.get('zoom')),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.set('map', new google.maps.Map(container[0], options));
        this.setMarkers();
    }.on('didInsertElement'),

    coordinatesChanged: function() {
        var map = this.get('map');

        if (map) {
            map.setCenter(new google.maps.LatLng(this.get('latitude'), this.get('longitude')));
        }
    }.observes('latitude', 'longitude'),

    setMarkers: function() {
        var map = this.get('map'),
            markers = this.get('markers');

        markers.forEach(function(marker) {
            new google.maps.Marker({
                position: new google.maps.LatLng(marker.get('latitude'), marker.get('longitude')),
                map: map
            });
        }, this);
    }.observes('markers.@each.latitude', 'markers.@each.longitude')
});
