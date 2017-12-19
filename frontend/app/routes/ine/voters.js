import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";

const { service } = Ember.inject;

export default Ember.Route.extend(InfinityRoute, {
	session: service("session"),

	totalPagesParam: "meta.total",

	queryParams: {
		q: {
			replace: true,
			refreshModel: true
		}
	},

	model(params) {
		return this.infinityModel("voter", { q: params.q, perPage: 9, startingPage: 1, uid: this.get('session.currentUser').id });
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
