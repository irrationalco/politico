import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
		return Ember.RSVP.hash({
			user: this.get('store').createRecord('user'),
			suborgs: this.get('store').findAll('suborganizations')
		});
	},
	
	actions: {
		willTransition(transition) {
			var model = this.currentModel.user;
			if (model.get('hasDirtyAttributes')) {
				if(confirm('¿Estás seguro?')) {
					model.rollbackAttributes();
					this.get('store').unloadRecord(model);
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
