import Ember from 'ember';

// Todo: Catch error when poll has no sections

export default Ember.Route.extend({
	
	pollManager: Ember.inject.service("poll"),

	model(params) {
		return this.store.findRecord('poll', params.poll_id);
	},

	afterModel(model,transition) {
		let sectionIds = model.get('sections').map(section => { return section.get('id'); });
		this.get('pollManager').setPollId(model.get('id'));
		this.get('pollManager').setSections(sectionIds);
		this.get('pollManager').setTotalSections(sectionIds.length);
		this.get('pollManager').debugValues();
	},

	redirect(model, transition) {
		let firstSection = model.get('sections').objectAt(0);
    this.transitionTo('polls.sections', firstSection);
  },

	actions: {
		testAction: function() {
			console.log("Testing buble function");
		}
	}
});