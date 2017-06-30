import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	totalSections: DS.attr('number'),
	sections: DS.hasMany('section')
});