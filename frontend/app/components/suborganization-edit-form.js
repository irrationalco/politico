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
		create(suborg) {
			this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
				this.get('ajax').post(config.localhost + '/api/suborganizations', {
					headers: {
						[headerName]: headerValue
					},
					data: {
						suborganization: { 
							name: suborg.get('name')
						}
					}
				})
				.then(res => {
					suborg.deleteRecord();
					this.sendAction('transitionToSuborgs');
				})
				.catch(err => {
					this.get('notify').alert("Make sure all fields are filled correctly.")
				});
			});
		},
		update(suborg) {
			this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
				this.get('ajax').put(config.localhost + '/api/suborganizations/' + suborg.get('id'), {
					headers: {
						[headerName]: headerValue
					},
					data: {
						suborganization: { 
							name: suborg.get('name')
						}
					}
				})
				.then(res => {
					suborg.deleteRecord();
					this.sendAction('transitionToSuborgs');
				})
				.catch(err => {
					console.log(err);
					this.get('notify').alert("Make sure all fields are filled correctly.")
				});
			});
		}
	}
});