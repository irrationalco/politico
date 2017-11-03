	import Ember from 'ember';
import config from '../../config/environment';

const { service } = Ember.inject;

export default Ember.Controller.extend({

	showFilters: false,
	showQuickForm: false,

	session: service('session'),
	ajax: 	 service('ajax'),
	notify:  service('notify'),
	store: 	 service('store'),

	actions: {

		showFilters() {
			if(this.get('showFilters')) {
				this.set('showFilters', false);
			} else {
				this.set('showFilters', true);
			}
		},

		showQuickForm() {
			if(this.get('showQuickForm')) {
				this.set('showQuickForm', false);
			} else {
				this.set('showQuickForm', true);
			}
		},

		searchVoters(term) {
			return this.get('store').query('voter', {name: term});
		},

		seeVoter(voter) {
			this.send('transitionToVoterEdit', voter.id);
		},

		deleteVoter(voterId) {
			this.get('store').findRecord('voter', voterId, { backgroundReload: false }).then( voter => {
				voter.destroyRecord().then(() => {
					this.get('notify').alert("Deleted record successfully.", { closeAfter: null});
				}, (error) => {
					this.get('notify').alert("Error deleting record.", { closeAfter: null});
				});
			})
		},

		testNotify() {
			this.get('notify').info("Some Message");
		}
	}
});