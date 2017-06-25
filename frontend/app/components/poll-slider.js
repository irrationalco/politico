import Ember from 'ember';

export default Ember.Component.extend({
	sliderElement: null,
	handle: null,
	value: 0,

	didInsertElement() {
		this.set('handle', this.$().get(0).getElementsByClassName("noUi-origin")[0]);
		this.set('sliderElement', this.$().get(0).getElementsByClassName("slider-value")[0]);
		this.sendAction('setPollValue', 0);
	},

	actions: {
		setValuePosition: function(val) {
			let styleLeftValue = parseFloat(this.get('handle').style.left.substring(0,4)) - 2.5;
			this.get('sliderElement').style.left = styleLeftValue + "%";
			this.set('value', Math.round(val));
		},

		setPollValue: function(val) {
			this.sendAction('setPollValue', Math.round(val));
		}
	}
});
