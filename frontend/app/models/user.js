import DS from 'ember-data';

export default DS.Model.extend({
	email: 		 	DS.attr('string'),
	firstName: 	DS.attr('string'),
	lastName:	 	DS.attr('string'),
	superAdmin: DS.attr('boolean'),
	supervisor: DS.attr('boolean'),
	manager:		DS.attr('boolean'),
	capturist: 	DS.attr('boolean')
});