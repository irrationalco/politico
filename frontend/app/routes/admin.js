import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { task, timeout } from 'ember-concurrency';

const { service } = Ember.inject;

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	session: service('session'),
	beforeModel() {
	}
});