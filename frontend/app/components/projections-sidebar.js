import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		setMapDivision(type) {
			this.sendAction('setMapDivision', type);
		}
	}
});

