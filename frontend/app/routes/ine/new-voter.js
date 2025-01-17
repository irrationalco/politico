import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
		return this.get('store').createRecord('voter');
	},
	
	actions: {
		transitionToVoters() {
			this.transitionTo('ine.voters');
		}
	}
});
