import Ember from 'ember';
import d3 from "npm:d3";
import topojson from "npm:topojson";

export default Ember.Component.extend({
	elections:[
						 {name: "Presidente - 2012", type: "prs", year: "2012", key: "prs-2012"}, 
						 {name: "Diputado Fed. - 2015", type: "dif", year: "2015", key: "dif-2015"}, 
						 {name: "Senador - 2012", type: "sen", year: "2012", key: "sen-2012"}, 
						 {name: "Diputado Fed. - 2012", type: "dif", year: "2012", key: "dif-2012"}, 
						 {name: "Diputado Fed. - 2009", type: "dif", year: "2009", key: "dif-2009"}
						],

	selectedElection: { name: "Presidente-2012", type: "prs", year: "2012", key: "prs-2012" },

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
		},

		addElection(election) {
			this.sendAction('setElection', election.type, election.year);
		}
	}
});