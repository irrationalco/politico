import Ember from 'ember';
import config from '../config/environment';
import { task, timeout } from 'ember-concurrency';

const { isEmpty } = Ember;
const { service } = Ember.inject;

export default Ember.Component.extend({
	ajax: 	service('ajax'),
	notify: service('notify'),
	store: 	service('store'),

	actions: {
		create(user) {
			this.get('ajax').post(config.localhost + '/api/users', {
				data: {
					user: { 
						email: user.get('email'), 
						first_name: user.get('firstName'),
						last_name: user.get('lastName'),
						password:	user.get('password')
					}
				}
			})
			.then(res => {
				user.deleteRecord();
				this.sendAction('transitionToUsers');
			})
			.catch(err => {
				this.get('notify').alert("Make sure all fields are filled correctly.")
			});
		},

		update(user) {
			this.get('ajax').put(config.localhost + '/api/users/' + user.get('id'), {
				data: {
					user: { 
						email: user.get('email'), 
						first_name: user.get('firstName'),
						last_name: user.get('lastName'),
						password:	user.get('password')
					}
				}
			})
			.then(res => {
				user.deleteRecord();
				this.sendAction('transitionToUsers');
			})
			.catch(err => {
				this.get('notify').alert("Make sure all fields are filled correctly.")
			});
		}
	}
});