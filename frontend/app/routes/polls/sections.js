import Ember from 'ember';

export default Ember.Route.extend({

	sectionIds: [],
	nextSection: null,
	prevSection: null,

	model(params) {
		console.log("section");
		console.log(params);
		return
	},

	afterModel(model, transition) {
		// guardar next-sectin y prev section id del arreglo de ids
		transition.send('testAction');
	}
});
