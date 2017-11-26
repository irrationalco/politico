import Ember from 'ember';
import config from '../config/environment';

const { isEmpty } = Ember;
const { service } = Ember.inject;

export default Ember.Component.extend({
	ajax: 	 service('ajax'),
	notify:  service('notify'),
	store: 	 service('store'),
	session: service('session'),

	manager: null,

	init() {
		this._super(...arguments);
		if(!isEmpty(this.get('org.managerId'))) {
			this.get('store').findRecord('user', this.get('org.managerId')).then(manager => {
				this.set('manager', manager);
			});
		}
	},

	actions: {
		setManager(manager) {
			this.set('manager', manager);
		},

		create(org) {
			this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
				this.get('ajax').post(config.localhost + '/api/organizations', {
					headers: {
						[headerName]: headerValue
					},
					data: {
						organization: { 
							name: org.get('name'),
							manager_id: this.get('manager.id')
						}
					}
				})
				.then(() => {
					org.deleteRecord();
					this.sendAction('transitionToOrgs');
				})
				.catch(err => {
					console.log(err);
					this.get('notify').alert("Make sure all fields are filled correctly.");
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
							name: org.get('name'),
							manager_id: this.get('manager.id')
						}
					}
				})
				.then(() => {
					org.deleteRecord();
					this.sendAction('transitionToOrgs');
				})
				.catch(err => {
					console.log(err);
					this.get('notify').alert("Make sure all fields are filled correctly.")
				});
			});
		}
	}
});