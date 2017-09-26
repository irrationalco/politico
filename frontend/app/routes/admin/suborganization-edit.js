import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model(params) {
		return this.get('store').findRecord('suborganization', params.suborganization_id);
	},
	
	actions: {
		willTransition(transition) {
			var model = this.currentModel;
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
