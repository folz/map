/* global moment */

import Ember from 'ember';

export default Ember.Component.extend({
    liveStamp: function() {
        var timestamp = moment(this.get('timestamp'), moment.ISO_8601);
        var diff = timestamp.diff(moment(), 'weeks');

        // TODO: use moment's relativeTime with weeks
        // @see https://github.com/moment/moment/issues/2017
        if (diff < -1) {
            this.set('message', Math.abs(diff) + " weeks ago");
        } else if (diff === -1) {
            this.set('message', "1 week ago");
        } else if (diff === 0) {
            this.set('message', "This week");
        } else if (diff === 1) {
            this.set('message', "Next week");
        } else {
            this.set('message', "In " + Math.abs(diff) + " weeks");
        }
    }.on('didInsertElement')
});
