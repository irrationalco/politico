import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { CanMixin } from 'ember-can';

export default Ember.Route.extend(AuthenticatedRouteMixin, CanMixin, {
	beforeModel() {
		let result = this._super(...arguments);

		if(!this.can('edit user')) { return this.transitionTo('index'); }
		
		return result;
	},

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
