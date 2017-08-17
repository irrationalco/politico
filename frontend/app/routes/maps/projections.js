import Ember from 'ember';

export default Ember.Route.extend({
	queryParams: {
		state: {
			refreshModel: true
		},
		municipality: {
			refreshModel: true
		},
		federalDistrict: {
			refreshModel: true
		},
		year: {
			refreshModel: true
		},
		election: {
			refreshModel: true
		}
	},

	model(params) {
		return this.store.query('projection',params);
	}
});