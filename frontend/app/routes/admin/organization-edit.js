import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { CanMixin } from 'ember-can';

export default Ember.Route.extend(AuthenticatedRouteMixin, CanMixin, {
	beforeModel() {
		let result = this._super(...arguments);

		if(!this.can('edit organization')) { return this.transitionTo('index'); }
		
		return result;
	},

	model(params) {
		return Ember.RSVP.hash({
			org: 	 this.get('store').findRecord('organization', params.organization_id),
			users: this.get('store').findAll('user')
		});
	},
	
	actions: {
		willTransition(transition) {
			var model = this.currentModel.org;
			if (model.get('hasDirtyAttributes')) {
				if(confirm('¿Estás seguro?')) {
					model.rollbackAttributes();
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
