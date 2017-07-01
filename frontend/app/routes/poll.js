import Ember from 'ember';

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

	actions: {
		testAction: function() {
			console.log("Testing buble function");
		}
	}
});