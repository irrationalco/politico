import Ember from 'ember';

export default Ember.Route.extend({

	sectionIds: [],
	nextSection: null,
	prevSection: null,

	model(params) {
		return this.store.peekRecord('section', params.section_id);
	},

	redirect(model, transition) {
		console.log(this.get('someValue'));
		// guardar next-sectin y prev section id del arreglo de ids
		console.log(model.get('id'));
		if (model.get('id') == 1) {
			this.transitionTo('polls.sections.approval');	
		} else {
			this.transitionTo('polls.sections.vote');
		}
  }
});
