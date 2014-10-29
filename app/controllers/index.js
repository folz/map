/* global google, moment */

import Ember from 'ember';

export default Ember.Controller.extend({
    userLocationString: "",
    userLocationCoords: {lat: null, lng: null},

    initMapsServices: function() {
        this.set('directionsRenderer', new google.maps.DirectionsRenderer());
        this.set('distanceMatrix', new google.maps.DistanceMatrixService());
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
    }.property('model.@each'),

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

    getDistancesFromUserLocation: function() {
        var distanceMatrix = this.get('distanceMatrix'),
            currentCoords = this.get('userLocationCoords');

        this.get('hackathonsByWeek').forEach(function(week) {
            distanceMatrix.getDistanceMatrix({
                origins: [new google.maps.LatLng(currentCoords.lat, currentCoords.lng)],
                destinations: week.hackathons.map(function(hackathon) {
                    return new google.maps.LatLng(hackathon.get('latitude'), hackathon.get('longitude'));
                }),
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.IMPERIAL
            }, function(response, status) {
                if (status === google.maps.DistanceMatrixStatus.OK) {
                    var distances = response.rows[0].elements;

                    distances.forEach(function(distance, i) {
                        var hackathon = week.hackathons[i];
                        if (distance.status === google.maps.DistanceMatrixStatus.OK) {
                            console.log("Distance to " + hackathon.get('name') + " is " + distance.distance.text);
                            hackathon.set('distance', distance.distance.text);
                        } else {
                            console.log(distance, hackathon.get('name'));
                        }
                    });
                } else {
                    console.log(response, status);
                }
            });
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
