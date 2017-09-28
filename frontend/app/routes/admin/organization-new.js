import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
		return Ember.RSVP.hash({
			org: 	 this.get('store').createRecord('organization'),
			users: this.get('store').findAll('user')
		});
	},
	
	actions: {
		willTransition(transition) {
			var model = this.currentModel.org;
			if (model.get('hasDirtyAttributes')) {
				if(confirm('¿Estás seguro?')) {
					model.rollbackAttributes();
					this.get('store').unloadRecord(model);
				} else {
					transition.abort();
				}
			}
		},
		transitionToOrgs() {
			this.transitionTo('admin.organizations');
		}
	}
});
