import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";

const { service } = Ember.inject;

export default Ember.Route.extend({
	session: service("session"),

	// totalPagesParam: "meta.total",

	queryParams: {
		q: {
			replace: true,
			refreshModel: true
		}
	},

	model(params) {
		return this.store.query('voter', params);
		// return this.infinityModel("voter", { perPage: 20, startingPage: 1, uid: this.get('session.currentUser').id });
	},

	actions: {
		transitionToVoterEdit(voterId) {
			this.transitionTo('ine.voter-edit', voterId);
		},

		refreshVoters() {
			this.refresh();
		}
	}
});
