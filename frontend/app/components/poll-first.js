import Ember from 'ember';

export default Ember.Component.extend({

	rangeElement: null,

	// didInsertElement() {
	// 	this._super(...arguments);
	// 	let e = this.$().get(0).getElementsByClassName("noUi-origin");
	// 	this.set('element', )
	// },

	actions: {
		setSecond: function(val) {
			let e = this.$().get(0);
			console.log(e);
			let test = this.$().get(0).getElementsByClassName("noUi-origin");
			console.log(test);
			console.log(val);
		}
	}
});

