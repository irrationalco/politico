import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	type: DS.attr('type'),
	party: DS.attr('party')
});