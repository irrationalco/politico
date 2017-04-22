import Ember from 'ember';

export default Ember.Component.extend({

	something: Ember.computed('sectionData', function() {
		let sec = this.get('sectionData').filterBy('sectionCode', 975);
		console.log(sec);
		return sec[0];
	}),

	didReceiveAttrs() {
		console.log(this.get('sectionData'));
	},

	actions: {
		setMapDivision(type) {
			this.sendAction('setMapDivision', type);
		},

		setDataType(type) {
			this.sendAction('setDataType', type);
		}
	}
});

