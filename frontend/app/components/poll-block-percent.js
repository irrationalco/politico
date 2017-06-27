import Ember from 'ember';

export default Ember.Component.extend({
	currValue: 0,

	actions: {
		sendValue: function(val) {
			this.sendAction('sumValue', val - this.get('currValue'));
			this.set('currValue', val);
		}
	}
});
