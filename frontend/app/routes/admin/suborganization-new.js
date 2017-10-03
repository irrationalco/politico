import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
		return Ember.RSVP.hash({
			suborg: this.get('store').createRecord('suborganization'),
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
					this.get('store').unloadRecord(model);
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
