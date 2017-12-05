import Ember from 'ember';
import config from '../config/environment';
import { task, timeout } from 'ember-concurrency';

const { isEmpty } = Ember;
const { service } = Ember.inject;

export default Ember.Component.extend({

	store: 	 		 service('store'),
	notify:  		 service('notify'),
	cartography: service('cartography'),

	states: Ember.computed.oneWay('cartography.statesNames'),
	selectedState: null,

	voter: null,

	init() {
		this._super(...arguments);
		let voter = this.get('store').createRecord('voter');
		this.set('voter', voter);
	},

	actions: {

		selectState(state) {
			this.set('selectedState', state);
		},

		quickCreate(voter) {
			voter.state = this.get('selectedState');
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
