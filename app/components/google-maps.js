/* global google */

import Ember from 'ember';

var mapStyle = [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}];

export default Ember.Component.extend({
    insertMap: function() {
        var container = this.$(".map-canvas");

        var options = {
            center: new google.maps.LatLng(this.get('latitude') || "39.828175", this.get('longitude') || "-98.5795"),
            zoom: parseInt(this.get('zoom')),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false,
            styles: mapStyle
        };

        this.set('map', new google.maps.Map(container[0], options));

        this.set('markerCache', []);
        this.setMarkers();

    }.on('didInsertElement'),

    coordinatesChanged: function() {
        var map = this.get('map');

        if (map) {
            map.setCenter(new google.maps.LatLng(this.get('latitude') || "39.828175", this.get('longitude') || "-98.5795"));
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
