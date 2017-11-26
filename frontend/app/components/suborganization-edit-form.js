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
	org: 	 null,

	init() {
		this._super(...arguments);
		if (!isEmpty(this.get('suborg.managerId'))) {
			this.get('store').findRecord('user', this.get('suborg.managerId')).then(manager => {
				this.set('manager', manager);
			});
		}

		if (!isEmpty(this.get('suborg.organization'))) {
			this.set('org', this.get('suborg.organization'));
		}
	},

	actions: {

		setManager(manager) { this.set('manager', manager); },

		setOrganization(org) { this.set('org', org); },
		
		create(suborg) {
			this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
				this.get('ajax').post(config.localhost + '/api/suborganizations', {
					headers: {
						[headerName]: headerValue
					},
					data: {
						suborganization: { 
							name: suborg.get('name'),
							manager_id: this.get('manager.id'),
							organization_id: this.get('org.id')
						}
					}
				})
				.then(() => {
					suborg.deleteRecord();
					this.sendAction('transitionToSuborgs');
				})
				.catch(err => {
					console.log(err);
					this.get('notify').alert("Make sure all fields are filled correctly.");
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
							name: suborg.get('name'),
							manager_id: this.get('manager.id'),
							organization_id: this.get('org.id')
						}
					}
				})
				.then(() => {
					suborg.deleteRecord();
					this.sendAction('transitionToSuborgs');
				})
				.catch(err => {
					console.log(err);
					this.get('notify').alert("Make sure all fields are filled correctly.");
				});
			});
		}
	}
});