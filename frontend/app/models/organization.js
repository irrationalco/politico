import DS from 'ember-data';

export default DS.Model.extend({
	name: 		 	 DS.attr('string'),
	managerId: 	 DS.attr('number'),
	managerName: DS.attr('string')
});