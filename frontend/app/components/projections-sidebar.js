import Ember from 'ember';
import d3 from "npm:d3";
import topojson from "npm:topojson";

export default Ember.Component.extend({

	munis: null,

	something: Ember.computed('sectionData', function() {
		let sec = this.get('sectionData').filterBy('sectionCode', 975);
		return sec[0];
	}),

	actions: {
		setMapDivision(type) {
			this.sendAction('setMapDivision', type);
		},

		setDataType(type) {
			this.sendAction('setDataType', type);
		}
	}
});

