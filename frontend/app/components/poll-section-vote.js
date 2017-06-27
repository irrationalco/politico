import Ember from 'ember';
import ProgressBar from "npm:progressbar.js";

export default Ember.Component.extend({

	totalPercent: 0,

	percent: Ember.computed('totalPercent', function() {
		return this.get('totalPercent');
	}),

	isOver100: Ember.computed('totalPercent', function() {
		return this.get('percent') > 100 ?  true : false; 
	}),

	is100: Ember.computed('totalPercent', function() {
		return this.get('percent') == 100 ?  true : false; 
	}),

	didInsertElement() {
		this._super(...arguments);
		let line = new ProgressBar.Line("#poll-percent-progress", {
			color: '#6fa6cc',
			trailColor: '#f7f7f7',
			duration: 1000,
			easing: 'easeOut',
			strokeWidth: 2
		});
		line.animate(1);
	},

	actions: {
		sumValue: function(val) {
			this.set('totalPercent', this.get('totalPercent') + val);
		}
	}
});