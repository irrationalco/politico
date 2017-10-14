import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { CanMixin } from 'ember-can';

export default Ember.Route.extend(AuthenticatedRouteMixin, CanMixin, {
	queryParams: {
		state: {
			refreshModel: true
		},
		municipality: {
			refreshModel: true
		},
		federalDistrict: {
			refreshModel: true
		},
		year: {
			refreshModel: true
		},
		election: {
			refreshModel: true
		}
	},

	model(params) {
		return this.store.query('projection',params);
	}
});