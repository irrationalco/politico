import Ember from 'ember';
import config from '../config/environment';
import { task, timeout } from 'ember-concurrency';

const { isEmpty } = Ember;
const { service } = Ember.inject;

export default Ember.Component.extend({
	ajax: 	 service('ajax'),
	notify:  service('notify'),
	store: 	 service('store'),
	session: service('session'),

	actions: {
		create(user) {
			this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
				this.get('ajax').post(config.localhost + '/api/users', {
					headers: {
						[headerName]: headerValue
					},
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
			});
		},
		update(user) {
			this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
				this.get('ajax').put(config.localhost + '/api/users/' + user.get('id'), {
					headers: {
						[headerName]: headerValue
					},
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
			});
			
		}
	}
});