import Ember from 'ember';
import config from '../config/environment';
import { task, timeout } from 'ember-concurrency';

const { isEmpty } = Ember;
const { service } = Ember.inject;

export default Ember.Component.extend({

	ajax: 	 service('ajax'),
	store: 	 service('store'),
	session: service('session'),
	notify:  service('notify'),

	voter: null,

	init() {
		this._super(...arguments);
		let voter = this.get('store').createRecord('voter');
		this.set('voter', voter);
	},

	actions: {

		quickCreate(voter) {
			voter.save().then(res => {
				this.sendAction("refreshVoters");
			});
		}

		// quickCreate(voter) {
		// 	this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
		// 		this.get('ajax').post(config.localhost + '/api/voters', {
		// 			headers: {
		// 				[headerName]: headerValue
		// 			},
		// 			data: {
		// 				voter: {
		// 					first_name: 		  voter.get('first_name'),
		// 					first_last_name:  voter.get('first_last_name'),
		// 					second_last_name: voter.get('second_last_name'),
		// 					municipality: 		voter.get('municipality')

		// 				}
		// 			}
		// 		})
		// 		.then(res => {
		// 			this.get('notify').success("Registro guardado exitosamente.");
		// 		})
		// 		.catch(err => {
		// 			this.get('notify').alert('Problemas guardando el registro.');
		// 		});
		// 	});
		// }
	}


});
