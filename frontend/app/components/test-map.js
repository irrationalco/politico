import Ember from 'ember';

export default Ember.Component.extend({

	mapData: null,

	init() {
		this._super(...arguments);
		Ember.$.getJSON('assets/nuevoLeonData.json', json => {
			this.set('mapData', json);		
		});
	},

	didInsertElement() {
		// let map = new Datamap({element: document.getElementById('map-world')});

		Ember.$.getJSON('assets/nuevoLeonData.json', json => {
			let maptestestados = new Datamap({
				element: document.getElementById('map-world'),
				geographyConfig: {
					dataUrl: 'assets/nuevoleon_secciones.json',
					popupTemplate: function(geography, data) {
						return '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong>'
						+ '<p>PAN: '+ data.PAN +'</p>' 
						+ '<p>PRI: '+ data.PRI +'</p>' 
						+ '<p>PRD: '+ data.PRD +'</p>'
						+ '</div>';
					},
					borderWidth: 0,
				},
				scope: 'nuevoleon_geolectorales',
				fills: {
					defaultFill: "#9E9E9E",
					'Red': '#EF5350',
					'Blue': '#1976D2'
				},
				data: this.get('mapData'),
				setProjection: function(element) {
					var projection = d3.geo.mercator()
					.center([-99.8, 25.5])
					.scale(7000)
					.translate([element.offsetWidth / 2, element.offsetHeight / 2]);
					var path = d3.geo.path().projection(projection);
					return {path: path, projection: projection};
				}
			});
		});
	}
});

// var election = new Datamap({
//   scope: 'usa',
//   element: document.getElementById('map_election'),
//   geographyConfig: {
//     highlightBorderColor: '#bada55',
//    popupTemplate: function(geography, data) {
//       return '<div class="hoverinfo">' + geography.properties.name + ' 
// Electoral Votes:' +  data.electoralVotes + ' '
//     },
//     highlightBorderWidth: 3
//   },

//   fills: {
//   'Republican': '#CC4731',
//   'Democrat': '#306596',
//   'Heavy Democrat': '#667FAF',
//   'Light Democrat': '#A9C0DE',
//   'Heavy Republican': '#CA5E5B',
//   'Light Republican': '#EAA9A8',
//   defaultFill: '#EDDC4E'
// },
// data:{
//   "AZ": {
//       "fillKey": "Republican",
//       "electoralVotes": 5
//   },
//   "CO": {
//       "fillKey": "Light Democrat",
//       "electoralVotes": 5
//   },
//   "DE": {
//       "fillKey": "Democrat",
//       "electoralVotes": 32
//   },
//   "FL": {
//       "fillKey": "UNDECIDED",
//       "electoralVotes": 29
//   },
//   "GA": {
//       "fillKey": "Republican",
//       "electoralVotes": 32
//   },
//   "HI": {
//       "fillKey": "Democrat",
//       "electoralVotes": 32
//   },
//   "ID": {
//       "fillKey": "Republican",
//       "electoralVotes": 32
//   },
//   "IL": {
//       "fillKey": "Democrat",
//       "electoralVotes": 32
//   },
//   "IN": {
//       "fillKey": "Republican",
//       "electoralVotes": 11
//   },
//   "IA": {
//       "fillKey": "Light Democrat",
//       "electoralVotes": 11
//   },
//   "KS": {
//       "fillKey": "Republican",
//       "electoralVotes": 32
//   },
//   "KY": {
//       "fillKey": "Republican",
//       "electoralVotes": 32
//   },
//   "LA": {
//       "fillKey": "Republican",
//       "electoralVotes": 32
//   },
//   "MD": {
//       "fillKey": "Democrat",
//       "electoralVotes": 32
//   },
//   "ME": {
//       "fillKey": "Democrat",
//       "electoralVotes": 32
//   },
//   "MA": {
//       "fillKey": "Democrat",
//       "electoralVotes": 32
//   },
//   "MN": {
//       "fillKey": "Democrat",
//       "electoralVotes": 32
//   },
//   "MI": {
//       "fillKey": "Democrat",
//       "electoralVotes": 32
//   },
//   "MS": {
//       "fillKey": "Republican",
//       "electoralVotes": 32
//   },
//   "MO": {
//       "fillKey": "Republican",
//       "electoralVotes": 13
//   },
//   "MT": {
//       "fillKey": "Republican",
//       "electoralVotes": 32
//   },
//   "NC": {
//       "fillKey": "Light Republican",
//       "electoralVotes": 32
//   },
//   "NE": {
//       "fillKey": "Republican",
//       "electoralVotes": 32
//   },
//   "NV": {
//       "fillKey": "Heavy Democrat",
//       "electoralVotes": 32
//   },
//   "NH": {
//       "fillKey": "Light Democrat",
//       "electoralVotes": 32
//   },
//   "NJ": {
//       "fillKey": "Democrat",
//       "electoralVotes": 32
//   },
//   "NY": {
//       "fillKey": "Democrat",
//       "electoralVotes": 32
//   },
//   "ND": {
//       "fillKey": "Republican",
//       "electoralVotes": 32
//   },
//   "NM": {
//       "fillKey": "Democrat",
//       "electoralVotes": 32
//   },
//   "OH": {
//       "fillKey": "UNDECIDED",
//       "electoralVotes": 32
//   },
//   "OK": {
//       "fillKey": "Republican",
//       "electoralVotes": 32
//   },
//   "OR": {
//       "fillKey": "Democrat",
//       "electoralVotes": 32
//   },
//   "PA": {
//       "fillKey": "Democrat",
//       "electoralVotes": 32
//   },
//   "RI": {
//       "fillKey": "Democrat",
//       "electoralVotes": 32
//   },
//   "SC": {
//       "fillKey": "Republican",
//       "electoralVotes": 32
//   },
//   "SD": {
//       "fillKey": "Republican",
//       "electoralVotes": 32
//   },
//   "TN": {
//       "fillKey": "Republican",
//       "electoralVotes": 32
//   },
//   "TX": {
//       "fillKey": "Republican",
//       "electoralVotes": 32
//   },
//   "UT": {
//       "fillKey": "Republican",
//       "electoralVotes": 32
//   },
//   "WI": {
//       "fillKey": "Democrat",
//       "electoralVotes": 32
//   },
//   "VA": {
//       "fillKey": "Light Democrat",
//       "electoralVotes": 32
//   },
//   "VT": {
//       "fillKey": "Democrat",
//       "electoralVotes": 32
//   },
//   "WA": {
//       "fillKey": "Democrat",
//       "electoralVotes": 32
//   },
//   "WV": {
//       "fillKey": "Republican",
//       "electoralVotes": 32
//   },
//   "WY": {
//       "fillKey": "Republican",
//       "electoralVotes": 32
//   },
//   "CA": {
//       "fillKey": "Democrat",
//       "electoralVotes": 32
//   },
//   "CT": {
//       "fillKey": "Democrat",
//       "electoralVotes": 32
//   },
//   "AK": {
//       "fillKey": "Republican",
//       "electoralVotes": 32
//   },
//   "AR": {
//       "fillKey": "Republican",
//       "electoralVotes": 32
//   },
//   "AL": {
//       "fillKey": "Republican",
//       "electoralVotes": 32
//   }
// }
// });
// election.labels();



// // Centers
// // Mexico: -102, 23
// // Nuevo Leon: 