import Ember from 'ember';

export default Ember.Component.extend({
    liveStamp: function() {
        var timestamp = moment(this.get('timestamp'), moment.ISO_8601);
        var diff = timestamp.diff(moment(), 'weeks');

        if (diff < 0) {
            this.set('weeks', Math.abs(diff));
            this.set('in_the_past', true);
        } else if (diff > 0) {
            this.set('weeks', diff);
            this.set('in_the_future', true);
        } else {
            this.set('weeks', 0);
            this.set('this_week', true);
        }
    }.on('didInsertElement'),

    weeksString: function() {
        var weeks = this.get('weeks');

        return (weeks > 1) ? "weeks" : "week";
    }.property('weeks')
});
