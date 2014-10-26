import Ember from 'ember';

export default Ember.Route.extend({
    model: function () {
        return Ember.$.getJSON('/assets/mlh_events_locations_grouped.json')
            .then(function (data) {
                return {
                    locations: data.results.collection1,
                    weeks: data.results.collection2
                };
            });
    }
});
