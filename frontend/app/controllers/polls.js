import Ember from 'ember';

export default Ember.Controller.extend({
	totalSections: 7,

	currentSection: 1,

	actions: {
		setCurrentSection: function(section) {
			this.set('currentSection', section);
		}
	}
});
