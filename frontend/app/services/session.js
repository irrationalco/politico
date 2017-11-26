import Ember from 'ember';
import RSVP from 'rsvp';
import ESASession from "ember-simple-auth/services/session";

const { isEmpty } = Ember;

export default ESASession.extend({
	store: Ember.inject.service(),

	loadCurrentUser() {
    return new RSVP.Promise((resolve, reject) => {
      const userId = this.get('data').authenticated.id;
      if (!isEmpty(userId)) {
        this.get('store').findRecord('user', userId).then((user) => {
          this.set('currentUser', user);
          resolve();
        }, reject);
      } else {
        resolve();
      }
    });
  }
});