import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Controller.extend({

	queryParams: ['q'],
	q: "",

	showFilters: false,
	showQuickform: false,

	session: service('session'),
	notify:  service('notify'),
	store: 	 service('store'),

	actions: {

		setSearchQuery(query) {
			this.set('q', query);
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
				}, (err) => {
					console.log(err);
					this.get('notify').alert("Error deleting record.", { closeAfter: null});
				});
			});
		},

		testNotify() {
			this.get('notify').info("Some Message");
		}
	}
});