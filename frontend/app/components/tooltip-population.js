import Ember from 'ember';

export default Ember.Component.extend({
	more30: null,
	less30: null,
	masc: null,
	fem: null,

	calculateShit: Ember.observer('hoveredSection', function() {
		let less30 = Math.floor(Math.random() * 100) + 1;
		let more30 = 100 - less30;
		let fem = Math.floor(Math.random() * 100) + 1;
		let masc = 100 - fem;

		this.set('less30', less30);
		this.set('more30', more30);
		this.set('fem', fem);
		this.set('masc', masc);
	})

});