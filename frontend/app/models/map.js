import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	mapScope: DS.attr('string'),
	lat: DS.attr('number'),
	long: DS.attr('number'),
	scale: DS.attr('number'),
	url: DS.attr('string')
});