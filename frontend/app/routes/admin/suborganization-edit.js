import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model(params) {
		return Ember.RSVP.hash({
			suborg: this.get('store').findRecord('suborganization', params.suborganization_id),
			users: this.get('store').findAll('user'),
			orgs: this.get('store').findAll('organization')
		});
	},
	
	actions: {
		willTransition(transition) {
			var model = this.currentModel.suborg;
			if (model.get('hasDirtyAttributes')) {
				if(confirm('¿Estás seguro?')) {
					model.rollbackAttributes();
				} else {
					transition.abort();
				}
			}
		},
		transitionToSuborgs() {
			this.transitionTo('admin.suborganizations');
		}
	}
});
