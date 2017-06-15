import Ember from 'ember';
import nouislider from "npm:nouislider";

export default Ember.Component.extend({

	didInsertElement() {
		let slider = document.getElementById('myslider');

		nouislider.create(slider, {
			start: 0,
			range: {
				'min': -100,
				'max': 100
			},
			pips: {
				mode: 'values',
				values: [],
				density: 4
			}
		});
	}
});

