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
		create(org) {
			this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
				this.get('ajax').post(config.localhost + '/api/organizations', {
					headers: {
						[headerName]: headerValue
					},
					data: {
						organization: { 
							name: org.get('name')
						}
					}
				})
				.then(res => {
					org.deleteRecord();
					this.sendAction('transitionToOrgs');
				})
				.catch(err => {
					this.get('notify').alert("Make sure all fields are filled correctly.")
				});
			});
		},
		update(org) {
			this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
				this.get('ajax').put(config.localhost + '/api/organizations/' + org.get('id'), {
					headers: {
						[headerName]: headerValue
					},
					data: {
						organization: { 
							name: org.get('name')
						}
					}
				})
				.then(res => {
					org.deleteRecord();
					this.sendAction('transitionToOrgs');
				})
				.catch(err => {
					this.get('notify').alert("Make sure all fields are filled correctly.")
				});
			});
		}
	}
});