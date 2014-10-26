import Ember from 'ember';

export default Ember.Route.extend({
    model: function() {
        return {
            locations: [
                Ember.Object.create({ name: 'Prague', latitude: 50.08804, longitude: 14.42076, url: "http://www.hackduke.com" }),
                Ember.Object.create({ name: 'New York', latitude: 40.71427 , longitude: -74.00597, url: "http://www.hacknc.us"}),
                Ember.Object.create({ name: 'Sydney', latitude: -33.86785, longitude: 151.20732, url: "http://www.hackpsu.com" })
            ]
        }
    }
});
