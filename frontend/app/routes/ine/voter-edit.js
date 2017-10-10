import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model(params) {
		console.log(params);
		return this.get('store').findRecord('voter', params.voter_id);
	},

	actions: {
		transitionToVoters() {
			this.transitionTo('ine.voters');
		}
	}
});
