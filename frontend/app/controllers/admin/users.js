import Ember from 'ember';
import config from '../../config/environment';

const { service } = Ember.inject;

export default Ember.Controller.extend({
	session: service('session'),
	ajax: 	 service('ajax'),
	notify:  service('notify'),
	store: 	 service('store'),

	actions: {
		deleteUser(userId) {
			this.get('store').findRecord('user', userId, { backgroundReload: false }).then( user => {
				user.destroyRecord().then(() => {
					this.get('notify').alert("Deleted user successfully.", { closeAfter: null});
				}, (error) => {
					this.get('notify').alert("Error deleting user.", { closeAfter: null});
				});
			})
		}
	}
});