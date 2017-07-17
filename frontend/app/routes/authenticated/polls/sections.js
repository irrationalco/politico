import Ember from 'ember';

export default Ember.Route.extend({
	model(params) {
		return this.store.peekRecord('section', params.section_id);
	},

	redirect(model, transition) {
		if (model.get('id') == 1 || model.get('id') == 2) {
			this.transitionTo('polls.sections.approval');	
		} else {
			this.transitionTo('polls.sections.vote');
		}
  }
});
