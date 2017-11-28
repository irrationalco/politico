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
			voter.save()
			.then(res => {
				this.sendAction("refreshVoters");
				this.get('notify').success("Registro guardado exitosamente.");
			})
			.catch(err => {
				console.log(err);
				this.get('notify').alert("El registro no pudo ser guardado.");
			});
		}
	}
});
