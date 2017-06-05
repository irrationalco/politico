import Ember from 'ember';

export default Ember.Component.extend({
	partiesManager: Ember.inject.service('parties'),

	selectedParties: Ember.computed.oneWay('partiesManager.selectedParties'),

	parties: Ember.computed('selectedParties.[]', function() {
		let selParties = this.get('selectedParties');
		let colors = this.get('partiesManager').get('colors');
		let arrParties = [];

		if(selParties.length === 2) {
			let party1 = { name: selParties[0], color: colors[selParties[0]] };
			let party2 = { name: selParties[1], color: colors[selParties[1]] };
			let gColor = this.get('partiesManager').getGradientColor(party1.color, party2.color);
			let midKey = { name: "Empate", color: "#" + gColor };
			arrParties.push(party1);
			arrParties.push(midKey);
			arrParties.push(party2);
			
		} else if (selParties.length >= 4) {
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