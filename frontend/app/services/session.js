import Ember from 'ember';
import DS from 'ember-data';
import ESASession from "ember-simple-auth/services/session";
import config from '../config/environment';

export default ESASession.extend({
	store: Ember.inject.service(),

	currentUser: null,

	loadCurrentUser() {
		Ember.$.getJSON(config.localhost + '/api/current_user', {email: this.get('data').authenticated.email }).then(res => {
			this.set('currentUser', res);
		});
	}
});