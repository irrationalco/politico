import Ember from 'ember';

export default Ember.Component.extend({
	parties: ["PRI", "PAN", "Morena", "PRD"],
	selectedParties: [],

	actions: {
		addItem(item) {
			this.get('selectedParties').pushObject(item);
		}
	} 
});

