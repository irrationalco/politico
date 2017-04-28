import Ember from 'ember';
import d3 from "npm:d3";
import topojson from "npm:topojson";

export default Ember.Component.extend({

	munis: null,

	something: Ember.computed('sectionData', function() {
		let sec = this.get('sectionData').filterBy('sectionCode', 975);
		return sec[0];
	}),

	didReceiveAttrs() {
		console.log(this.get('sectionData'));
	},

	// init() {

	// 	// var txtFile = "/tmp/test.txt";
	//    // var file = new File(txtFile,"write");
	//    // var str = JSON.stringify(JsonExport);

	//    // log("opening file...");
	//    // file.open(); 
	//    // log("writing file..");
	//    // file.writeline(str);
	//    // file.close();

	// 	console.log("READING TOPOS");

	// 	d3.json("../assets/mx_tj.json", (error, data) => {
	// 		if (error) { reject(error); }
	// 		if (data) {
	// 			this.set('munis', topojson.feature(data, data.objects.states).features);

	// 			console.log(this.get('munis'));

	// 			let muniCodes = {};
	// 			this.get('munis').forEach(muni => {
	// 				muniCodes[muni.properties.state_name] = muni.properties.state_code;
	// 			});

	// 			let municodesJSON = JSON.stringify(muniCodes);
	// 			window.location = 'data:text/plain;charset=utf-8,'+encodeURIComponent(municodesJSON);
	// 		}
	// 	});
	// },

	actions: {
		setMapDivision(type) {
			this.sendAction('setMapDivision', type);
		},

		setDataType(type) {
			this.sendAction('setDataType', type);
		}
	}
});

