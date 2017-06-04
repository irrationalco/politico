import Ember from 'ember';

export default Ember.Component.extend({
	partiesManager: Ember.inject.service('parties'),

	selectedParties: Ember.computed.oneWay('partiesManager.selectedParties'),

	parties: Ember.computed('selectedParties.[]', function() {
		let selParties = this.get('selectedParties');
		let colors = this.get('partiesManager').get('colors');
		let arrParties = [];

		if (selParties.length >= 4) {
			for (var i = 0; i < 4; i++) {
				let party = { name: selParties[i], color: colors[selParties[i]] };
				arrParties.push(party);
			}
		} else if(selParties.length > 0) {
			for (var i = 0; i < selParties.length; i++) {
				let party = { name: selParties[i], color: colors[selParties[i]] };
				arrParties.push(party);
			}
		}
		return arrParties;
	})
});