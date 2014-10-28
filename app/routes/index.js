import Ember from 'ember';

import Hackathon from 'hhmap/models/hackathon';


export default Ember.Route.extend({
    model: function () {
        return Ember.$.getJSON('/assets/mlh_events_formatted.json')
            .then(function (data) {
                return data.map(function(hackathon) {
                    return this.get('store').push(Hackathon, hackathon);
                }, this)
            }.bind(this));
    }
});
