import Ember from 'ember';

export default Ember.Component.extend({
	partiesManager: Ember.inject.service("parties"),

	parties: Ember.computed.alias('partiesManager.parties'),
	selectedParties: Ember.computed.alias('partiesManager.selectedParties'),

	selectedPartiesChanged: Ember.observer("selectedParties.[]", function() {
		console.log("selectedParties changed");
	}),

	actions: {
		addParty(item) {
		},

		removeParty(item) {
		}
	} 
});

