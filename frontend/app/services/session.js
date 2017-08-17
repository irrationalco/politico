import Ember from 'ember';
import DS from 'ember-data';
import ESASession from "ember-simple-auth/services/session";
import config from '../config/environment';

export default ESASession.extend({
	store: Ember.inject.service(),

	currentUser: Ember.computed('isAuthenticated', function() {
		if(this.get('isAuthenticated')) {
			const promise = Ember.$.getJSON(config.localhost + '/api/current_user', {email: this.get('data').authenticated.email });
			return DS.PromiseObject.create({ promise: promise });
		}
	})
});