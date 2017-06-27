import Ember from 'ember';
import ProgressBar from "npm:progressbar.js";

export default Ember.Controller.extend({
	totalSections: 7,

	currentSection: 1,

	didInsertElement() {
		this._super(...arguments);
		
		let progressLine = new ProgressBar.Line("#poll-progress", {
			color: '#6fa6cc',
			trailColor: '#f7f7f7',
			duration: 1000,
			easing: 'easeOut',
			strokeWidth: 2
		});
		progressLine.animate(1);
	},

	actions: {
		setCurrentSection: function(section) {
			this.set('currentSection', section);
		}
	}
});
