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
					this.get('notify').alert("Success", { closeAfter: null});
					console.log("Sucess");
				}, (error) => {
					console.log("Error happened");
					console.log(error);
				});
			})
		},

		create() {
			let { email, password } = this.getProperties('email', 'password');
			this.get('ajax').post(config.localhost + '/api/users', {
				data: {
					user: { email: email, password: password }
				}
			})
			.then(response => {
				this.send('transitionToUsers');
			})
			.catch(error => {
				this.get('notify').info("Problem creating user.");
			});

		}
	}
});