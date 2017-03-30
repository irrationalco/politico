import Ember from 'ember';

export default Ember.Route.extend({
	queryParams: {
		state: {
			refreshModel: true
		},
		municipality: {
			refreshModel: true
		}
	}
});