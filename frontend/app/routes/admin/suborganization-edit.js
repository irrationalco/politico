import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { CanMixin } from 'ember-can';

export default Ember.Route.extend(AuthenticatedRouteMixin, CanMixin, {
	beforeModel() {
		let result = this._super(...arguments);

		if(!this.can('edit suborganization')) { return this.transitionTo('index'); }
		
		return result;
	},

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
