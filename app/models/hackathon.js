import DS from 'ember-data';

export default DS.Model.extend({
    city: DS.attr('string'),
    href: DS.attr('string'),
    image: DS.attr('string'),
    latitude: DS.attr('number'),
    longitude: DS.attr('number'),
    name: DS.attr('string'),
    start: DS.attr('date'),
    weekend: DS.attr('date')
});
