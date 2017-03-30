import Ember from 'ember';

export default Ember.Component.extend({
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

	actions: {
		setMapDivision(type) {
			this.sendAction('setMapDivision', type);
		}
	}
});

