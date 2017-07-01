import Ember from 'ember';

// Todo: Catch error when poll has no sections

export default Ember.Route.extend({
	totalSections: null,

	currentSection: null,

	sectionIds: null,

	model(params) {
		return this.store.findRecord('poll', params.poll_id);
	},

	afterModel(model,transition) {
		let sectionIds = model.get('sections').map(section => { return section.get('id'); });
		this.set('sectionIds', sectionIds);
		this.set('totalSections', model.get('totalSections'));
	},

	redirect(model, transition) {
		let firstSection = model.get('sections').objectAt(0);
    this.transitionTo('poll.section', firstSection);
  },

	actions: {
		testAction: function() {
			console.log("Testing buble function");
		}
	}
});