import Ember from 'ember';
import nouislider from "npm:nouislider";

export default Ember.Component.extend({

	didInsertElement() {
		let slider = document.getElementById('myslider');

		nouislider.create(slider, {
			start: [10,30],
			connect: true,
			range: {
				'min': -20,
				'max': 40
			}
		});
	}
});

