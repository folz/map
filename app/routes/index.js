import Ember from 'ember';

export default Ember.Route.extend({
    model: function () {
        return Ember.$.getJSON('/assets/mlh_events_locations.json')
            .then(function (data) {
                return data.results.collection1.map(function (event) {
                    return Ember.Object.create({
                        name: event.event_name.text,
                        latitude: event.event_location.coords.lat,
                        longitude: event.event_location.coords.lng
                    });
                });
            });
    },
});
