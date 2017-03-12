import Ember from 'ember';

export default Ember.Route.extend({

	cartography: Ember.inject.service(),

	queryParams: {
		state: {
			refreshModel: true
		},
		municipality: {
			refreshModel: true
		}
	},

	model() {
		return;
	},

	init() {
		this._super(...arguments);
	}
});
