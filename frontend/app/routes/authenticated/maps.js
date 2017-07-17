import Ember from 'ember';

export default Ember.Route.extend({
	cartography: Ember.inject.service(),

	model() {
		return;
	},

	init() {
		this._super(...arguments);
	}
});
