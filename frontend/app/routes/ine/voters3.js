import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";

export default Ember.Route.extend(InfinityRoute, {
	session: Ember.inject.service(),
	totalPagesParam: "meta.total",
	model() {
		return this.infinityModel("voter", { perPage: 20, startingPage: 1, uid: this.get('session.currentUser').id });
	},

	actions: {
		transitionToVoterEdit(voterId) {
			this.transitionTo('ine.voter-edit', voterId);
		}
	}
});
