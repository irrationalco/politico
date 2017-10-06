import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { CanMixin } from 'ember-can';

export default Ember.Route.extend(AuthenticatedRouteMixin, CanMixin, {
	beforeModel() {
		let result = this._super(...arguments);

		if(!this.can('create suborganization')) { return this.transitionTo('index'); }
		
		return result;
	},

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
