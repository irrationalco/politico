import Ember from 'ember';
import nouislider from "npm:nouislider";

export default Ember.Component.extend({

	didInsertElement() {
		let slider1 = document.getElementById('slider1');
		let slider2 = document.getElementById('slider2');
		let slider3 = document.getElementById('slider3');

		nouislider.create(slider1, {
			start: 0,
			range: {
				'min': -100,
				'max': 100
			}
		});
		nouislider.create(slider2, {
			start: 0,
			range: {
				'min': -100,
				'max': 100
			}
		});
		nouislider.create(slider3, {
			start: 0,
			range: {
				'min': -100,
				'max': 100
			}
		});
	}
});

