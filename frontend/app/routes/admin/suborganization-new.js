import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
		return this.get('store').createRecord('suborganization');
	},
	
	actions: {
		willTransition(transition) {
			var model = this.currentModel;
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
