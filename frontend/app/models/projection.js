import DS from 'ember-data';

export default DS.Model.extend({
	sectionCode: DS.attr('number'),
	muniCode: DS.attr('number'),
	stateCode: DS.attr('number'),
	districtCode: DS.atrr('number'),

	PRI: DS.attr('number'),
	PAN: DS.attr('number'),
	PRD: DS.attr('number'),
	PV: DS.attr('number'),
	PT: DS.attr('number'),
	Morena: DS.attr('number'),
	MC: DS.attr('number')
});