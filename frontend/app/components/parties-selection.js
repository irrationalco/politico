import Ember from 'ember';

export default Ember.Component.extend({
	partiesManager: Ember.inject.service("parties"),

	parties: Ember.computed.alias('partiesManager.partiesNames'),
	selectedParties: Ember.computed.alias('partiesManager.selectedParties'),

	selectedPartiesChanged: Ember.observer("selectedParties.[]", function() {
		console.log("selectedParties changed");
	}),

	init(){
		this._super(...arguments);
		console.log("init");
	},

	actions: {
		addParty(item) {
			console.log("adding item");
			console.log(this.get('selectedParties'));
		},

		removeParty(item) {
			console.log("removing item");
		}
	} 
});

