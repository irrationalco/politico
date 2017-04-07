import Ember from 'ember';

export default Ember.Component.extend({

	something: Ember.computed('sectionData', function() {
		let sec = this.get('sectionData').filterBy('sectionCode', 975);
		console.log(sec);
		return sec[0];
	}),

	isMunicipal: Ember.computed('mapDivision', function() {
		if (this.get('mapDivision') === 'municipal') {
			return true;
		} else {
			return false;
		}
	}),

	isFederal: Ember.computed('mapDivision', function() {
		if (this.get('mapDivision') === 'federal') {
			return true;
		} else {
			return false;
		}
	}),

	didReceiveAttrs() {
		console.log(this.get('sectionData'));
	},

	actions: {
		setMapDivision(type) {
			this.sendAction('setMapDivision', type);
		}
	}
});

