import Ember from 'ember';

export default Ember.Component.extend({
	pollValue: null,

	actions: {
		setPollValue: function(val) {
			this.set('pollValue', val);
		}
	}
});

