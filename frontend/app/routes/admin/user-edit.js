import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model(params) {
		return Ember.RSVP.hash({
			user: this.get('store').findRecord('user', params.user_id),
			suborgs: this.get('store').findAll('suborganization')
		});
	},
	
	actions: {
		willTransition(transition) {
			var model = this.currentModel.user;
			if (model.get('hasDirtyAttributes')) {
				if(confirm('¿Estás seguro?')) {
					model.rollbackAttributes();
				} else {
					transition.abort();
				}
			}
		},
		transitionToUsers() {
			this.transitionTo('admin.users');
		}
	}
});
