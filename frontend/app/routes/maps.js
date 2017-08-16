import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	cartography: Ember.inject.service(),

	model() {
		return;
	},

	init() {
		this._super(...arguments);
	}
});
