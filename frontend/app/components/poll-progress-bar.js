import Ember from 'ember';
import ProgressBar from 'npm:progressbar.js';

export default Ember.Component.extend({
	didInsertElement() {
		let line = new ProgressBar.Line("#poll-progress", {
			color: '#b35e5e',
			trailColor: '#f7f7f7',
			duration: 1000,
			easing: 'easeOut',
			strokeWidth: 1
		});
		line.animate(0.3);
	}
});
