import Ember from 'ember';

export default Ember.Component.extend({
	sliderValue: null,
	handle: null,

	didInsertElement() {
		this.set('handle', this.$().get(0).getElementsByClassName("noUi-origin")[0]);
		this.set('sliderValue', this.$().get(0).getElementsByClassName("slider-value")[0]);
	},

	actions: {
		setSecond: function(val) {
			let leftValue = parseFloat(this.get('handle').style.left.substring(0,4)) - 2.5;
			this.get('sliderValue').style.left = leftValue + "%";
		}
	}
});
