/* global google, moment */

import Ember from 'ember';

export default Ember.Controller.extend({
    userLocationString: "",
    userLocationCoords: {lat: null, lng: null},

    initMapsServices: function() {
        this.set('directionsRenderer', new google.maps.DirectionsRenderer());
        this.set('geocoder', new google.maps.Geocoder());
    }.on('init'),

    hackathonsByWeek: function() {
        var hackathons = this.get('model');

        var hackathonWeekMap = {};

        hackathons.forEach(function(hackathon) {
            var weekOfYear = moment(hackathon.get('start'), moment.ISO_8601).isoWeek();
            if (hackathonWeekMap[weekOfYear]) {
                hackathonWeekMap[weekOfYear].push(hackathon);
            } else {
                hackathonWeekMap[weekOfYear] = [hackathon];
            }
        }, this);

        return Ember.keys(hackathonWeekMap).sort().map(function(week) {
            var weekMoment = moment(week, "W WW");

            return {
                'hackathons': hackathonWeekMap[week],
                'timestamp': weekMoment.format(),
                'timeago': weekMoment.fromNow()
            };
        });
    }.property('model'),

    locationDidUpdate: function() {
        Ember.run.debounce(this, this._geocodeLocationString, 750);
    }.observes('userLocationString'),

    _geocodeLocationString: function() {
        var geocoder = this.get('geocoder');
        geocoder.geocode({address: this.get('userLocationString')}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                this.set('userLocationCoords', {lat: results[0].geometry.location.k, lng: results[0].geometry.location.B});
            } else {
                console.log(results, status);
            }
        }.bind(this));
    },

    getDistances: function() {
        var directionsDisplay = this.get('directionsRenderer');
        //var directionsService = new google.maps.DirectionsService();
        var currentCoords = this.get('userLocationCoords');
        var model = this.get('model');

        directionsDisplay.setMap(this.get('map'));
        directionsDisplay.setPanel(document.getElementById("routesBox"));

        var locations = model.locations;

        var service = new google.maps.DistanceMatrixService();

        service.getDistanceMatrix({
            origins: new google.maps.LatLng(currentCoords.lat, currentCoords.lng),
            destinations: locations
        }, function(response, status) {
            if (status === google.maps.DistanceMatrixStatus.OK) {
                var origins = response.originAddresses;
                var destinations = response.destinationAddresses;

                for (var i = 0; i < origins.length; i++) {
                    var results = response.rows[i].elements;
                    for (var j = 0; j < results.length; j++) {
                        var element = results[j];
                        var distance = element.distance.text;
                        var duration = element.duration.text;
                        var from = origins[i];
                        var to = destinations[j];
                    }
                }
            } else {
                console.log(response, status);
            }
        });
    }.observes('userLocationCoords')

    /*locations.forEach(function(location) {
     var start = new google.maps.LatLng(currentCoords.lat, currentCoords.lng);
     var end = new google.maps.LatLng(location.event_location.coords.lat, location.event_location.coords.lng);
     var request = {
     origin:start,
     destination:end,
     travelMode: google.maps.TravelMode.DRIVING
     };

     directionsService.route(request, function(result, status) {
     if (status == google.maps.DirectionsStatus.OK) {
     directionsDisplay.setDirections(result);
     }
     });

     });*/

});
