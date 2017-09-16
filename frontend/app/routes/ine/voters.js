import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";

export default Ember.Route.extend(InfinityRoute, {
	totalPagesParam: "meta.total",
	model() {
		return this.infinityModel("voter", { perPage: 20, startingPage: 1 });
	}
});
