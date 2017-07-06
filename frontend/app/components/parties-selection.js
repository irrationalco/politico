import Ember from 'ember';

export default Ember.Component.extend({
	partiesManager: Ember.inject.service("parties"),

	temporalParties: Ember.computed('selectedParties', function() {
		return this.get('selectedParties').map(item => { return item; });
	}),

	parties: Ember.computed.alias('partiesManager.parties'),
	selectedParties: Ember.computed.oneWay('partiesManager.selectedParties'),

	actions: {
		addParty(item) {},

		removeParty(item) {},

		setSelectedParties() {
			this.get('partiesManager').setSelectedParties(this.get('temporalParties'));			
		}
	} 
});

