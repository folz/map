/* global google */

import Ember from 'ember';

export default Ember.Component.extend({
    insertMap: function() {
        var container = this.$(".map-canvas");

        var options = {
            center: new google.maps.LatLng(this.get('latitude'), this.get('longitude')),
            zoom: parseInt(this.get('zoom')),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false
        };

        this.set('map', new google.maps.Map(container[0], options));

        this.set('markerCache', []);
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
            markers = this.get('markers'),
            markerCache = this.get('markerCache');

        markerCache.forEach(function(marker) {
            marker.setMap(null);
        });

        markers.forEach(function(marker) {
            var gMapsMarker = new google.maps.Marker({
                position: new google.maps.LatLng(marker.event_location.coords.lat, marker.event_location.coords.lng),
                map: map,
                title: 'Title here.'
            });

            var contentString = '<h1>' + marker.event_name.text + '</h1><div><p><a href=' +
                marker.event_name.href + '>' + marker.event_name.text + '</a></p></div>';

            var infoWindow = new google.maps.InfoWindow({
                content: contentString
            });

            markerCache.pushObject(gMapsMarker);

            google.maps.event.addListener(gMapsMarker, 'click', function() {
                infoWindow.open(map,gMapsMarker);
            });

        }, this);
    }.observes('markers.@each.latitude', 'markers.@each.longitude')
});
