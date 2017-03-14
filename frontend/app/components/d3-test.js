import Ember from 'ember';
import d3 from "npm:d3";
import d3Tile from "npm:d3-tile";
import topojson from "npm:topojson";

const { isEmpty } = Ember;

export default Ember.Component.extend({

	cartography: Ember.inject.service(),

	states: Ember.computed.oneWay('cartography.states'),

	municipalities: Ember.computed.oneWay('cartography.municipalities'),

	sections: Ember.computed.oneWay('cartography.sections'),

	scaleExtent: [1 << 11, 1 << 26],

	centerCoords: [-102, 23],

	width: null,

	height: null,

	active: null,

	// Map projection
	projection: d3.geoMercator().scale(1 / (2 * Math.PI)).translate([0,0]),

	// Defining Path according to projection
	path: Ember.computed('projection', function() {
		return d3.geoPath().projection(this.get('projection'));
	}),

	// Defining Zoom Behaviour
	zoom: Ember.computed('scaleExtent', function() {
		return d3.zoom().scaleExtent(this.get('scaleExtent'))
			.on('zoom', () => {
				this.zoomed();
			});
	}),

	tile: Ember.computed('width', 'height', function() {
		return d3Tile.tile().size([this.get('width'), this.get('height')]);
	}),

	svg: null,

	statesLayer: null,

	muniLayer: null,

	sectionsLayer: null,

	imageLayer: null,

	currState: null,
	currMuni: null,
	currSection: null,

	stateCode: null,
	muniCode: null,

	// Overriding init
	init() {
		this._super(...arguments);
	},

	didReceiveAttrs() {
		this._super(...arguments);
		console.log("didReceiveAttrs");
	},

	renderMap() {

		// console.log("Current State: " + this.get('currState'));
		// console.log("Current Municipality: " + this.get('currMuni'));
		// console.log("Current Section: " + this.get('currSection'));

		// console.log("New State: " + this.get('state'));
		// console.log("New Municipality: " + this.get('municipality'));
		// console.log("New Section: " + this.get('section'));

		let currState = this.get('currState');
		let newState = this.get('state');
		let currMuni = this.get('currMuni');
		let newMuni = this.get('municipality');

		// COUNTRY
		if (this.get('level') === 'country') {
			this.zoomToCoordinates(this.get('centerCoords'), 1 << 13.5, this.get('svg'));
		// STATE
		} else if (this.get('level') === 'state') {
			
			if (currState === newState) {
				this.get('cartography').getState(newState).then((state) => {
					this.removeSections();
					this.zoomToObject(state)
					this.set('stateCode', state.properties.state_code);
				});
			} else {
				this.get('cartography').getState(newState).then((state) => {
					this.removeSections();
					this.removeMunicipalities();
					this.zoomToObject(state)
					this.set('stateCode', state.properties.state_code);
					this.drawMunicipalities(this.get('stateCode'));
				});
			}

		// MUNICIPALITY
		} else if (this.get('level') === 'municipality') {
			if (currMuni === newMuni) {
				console.log("CURR MUNI");

				this.get('cartography').getMunicipality(newMuni, this.get('stateCode')).then((municipality) => {
					this.zoomToObject(municipality);
				});
			} else if(currState === newState) {

				this.get('cartography').getMunicipality(newMuni, this.get('stateCode')).then((municipality) => {
					this.removeSections();
					this.zoomToObject(municipality);
					this.drawSections();
				});
			} else {
				this.get('cartography').getState(newState).then((state) => {
					this.set('stateCode', state.properties.state_code);
					this.drawMunicipalities(this.get('stateCode'));

					this.get('cartography').getMunicipality(newMuni, this.get('stateCode')).then((municipality) => {
						this.zoomToObject(municipality);
						this.set('muniCode', municipality.properties.mun_code);
						this.drawSections();
					});
				});
			}
		}

		if (this.get('level') === 'country') {
			// remove sections
			// remove municipalities
			// center map on mexico
		} else if(this.get('level') === 'state') {
			// remove sections

			// if (currState == newState)
				// center map on newState
			// else
				// remove municipalities
				// center map on newState
				// draw municipalities of newState

		} else if(this.get('level') === 'municipality') {
			//if (currMuni == newMuni)
				// center map on newMuni
			//else 
				//remove municipalities
				//center map on newMuni
				// draw sections of newMuni

		} else if(this.get('level') === 'section') {
 			// if (currState != newState)
 				// remove sections
 				// remove municipalities
 				// draw municipalities
 				// draw sections
 				// center on newSection
 			// else if (currState == newState && currMuni != newMuni)
 				// remove sections
 				// draw sections
 				// center on newSection
 			// else
 				// center on newSection
		}	
	},

	didUpdateAttrs() {
		this._super(...arguments);
		this.renderMap();
	},

	didInsertElement() {
		this._super(...arguments);

		// Setting width and height of map container
		let active = d3.select(null);

		this.set('width', Ember.$("#map").width());
		this.set('height', Ember.$("#map").height());

		// Initializing SVG on the html element
		this.set('svg', d3.select("#map").append("svg")
			.attr("class", "svg-map")
			.attr("width", this.get('width'))
			.attr("height", this.get('height')));

		this.get('svg').append("rect")
			.attr("class", "map-background")
			.attr("width", this.get('width'))
			.attr("height", this.get('height'));

		// Defining layers
		this.set('imageLayer', this.get('svg').append('g'));
		this.set('statesLayer', this.get('svg').append('g'));
		this.set('muniLayer', this.get('svg').append('g'));
		this.set('sectionsLayer', this.get('svg').append('g'));

		this.drawStates();
		this.zoomToCoordinates(this.get('centerCoords'), 1 << 13.5, this.get('svg'));
		this.renderMap();


		// Apply zoom behaviour to svg, and make an initial transform to center
		this.get('svg')
			.call(this.get('zoom'));

		
	},

	// Function that calculates zoom and the required translation to a given Bounding Box
	calculateZoomToBBox(d, path) {
		let bounds = Array.isArray(d) ? d : path.bounds(d);
		
		// Calculating scale by getting path bounds
		let dx = bounds[1][0] - bounds[0][0],
		dy = bounds[1][1] - bounds[0][1],
		x = (bounds[0][0] + bounds[1][0]) / 2,
		y = (bounds[0][1] + bounds[1][1]) / 2;

		return d3.zoomIdentity
		.translate(this.get('width') / 2, this.get('height') / 2)
		.scale(.9 / Math.max(dx / this.get('width'), dy / this.get('height')))
		.translate(-x, -y);
	},

	stringify(scale, translate) {
		var k = scale / 256, r = scale % 1 ? Number : Math.round;
		return "translate(" + r(translate[0] * scale) + "," + r(translate[1] * scale) + ") scale(" + k + ")";
	},

	zoomed() {
		let transform = d3.event.transform;

		let tiles = this.get('tile')
			.scale(transform.k)
			.translate([transform.x, transform.y])();

		this.get('statesLayer')
			.attr("transform", transform)
			.style("stroke-width", 1 / transform.k);

		this.get('sectionsLayer')
			.attr("transform", transform)
			.style("stroke-width", 1.3 / transform.k);

		this.get('muniLayer')
			.attr("transform", transform)
			.style("stroke-width", 6.0041e-06);

		var image = this.get('imageLayer')
			.attr("transform", this.stringify(tiles.scale, tiles.translate))
			.selectAll("image")
			.data(tiles, function(d) { return d; });

		image.exit().remove();

		// .attr("xlink:href", function(d) { return "http://" + "abc"[d[1] % 3] + ".tile.openstreetmap.org/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
		image.enter().append("image")
			.attr("xlink:href", function(d) { return "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
			.attr("x", function(d) { return d[0] * 256; })
			.attr("y", function(d) { return d[1] * 256; })
			.attr("width", 256)
			.attr("height", 256);
	},

	// Handling actions when element is clicked
	clicked(element, d) {

		console.log("element clicked");

		if (d.properties.section_code) {
			this.sendAction('setSection', d.properties.section_code);
		} else if(d.properties.mun_code) {
			this.sendAction('setMunicipality', d.properties.mun_name);
			this.sendAction('setSection', '');
		} else {
			this.sendAction('setState', d.properties.state_name);
			this.sendAction('setMunicipality', '');
			this.sendAction('setSection', '');
		}

		// if (active.node() === this) {
		// 	return reset();
		// }
		
		// active.classed("active", false);
		// active = d3.select(this).classed("active", true);

		// let transform = this.calculateZoomToBBox(d, this.get('path'));

		// Ember.run.later(this, () => {
		// 	this.get('svg').transition()
		// 		.duration(950)
		// 		.call(this.get('zoom').transform, transform)
		// 		.on("end", this.draw(d));
		// }, 50);
	},

	zoomToObject(d) {
		let transform = this.calculateZoomToBBox(d, this.get('path'));

		Ember.run.later(this, () => {
			this.get('svg').transition()
				.duration(950)
				.call(this.get('zoom').transform, transform)
				.on("end", this.updateCurrData());
		}, 50);
	},

	zoomToCoordinates(coordinates, zoomValue, element) {
		let projection = this.get('projection');
		let center = projection(this.get('centerCoords'));

		this.get('svg').call(this.get('zoom').transform, d3.zoomIdentity
			.translate(this.get('width') / 2, this.get('height') / 2)
			.scale(zoomValue)
			.translate(-center[0], -center[1]));
	},

	drawSections() {

		if (isEmpty(this.get('sections'))) {
			this.get('cartography').loadSectionsData(this.get('stateCode'), this.get('muniCode')).then(() => {
				this.renderSections();
			});
		} else {
			this.renderSections();
		}
	},

	renderSections() {
		let emberContext = this;

		this.get('sectionsLayer').selectAll("path")
			.data(this.get('sections'))
			.enter().append("path")
			.attr("d", this.get('path'))
			.attr("class", "section")
			.on("click", function(d) {
				emberScope.clicked(this, d);
			});
	},

	drawMunicipalities(stateCode) {
		if (isEmpty(this.get('municipalities'))) {
			this.get('cartography').loadMunicipalitiesData(stateCode).then(() => {
				this.renderMunicipalities();
			});
		} else {
			this.renderMunicipalities();
		}
	},

	renderMunicipalities() {
		let emberContext = this;

		Ember.run.later(this, () => {
			this.get('muniLayer').selectAll("path")
			.data(this.get('municipalities'))
			.enter().append("path")
			.attr("d", this.get('path'))
			.attr("class", "feature")
			.on("click", function(d) {
				emberContext.clicked(this, d);
			});

			// this.get('muniLayer').append("path")
			// .datum(topojson.mesh(data, data.objects.municipalities, function(a, b) { 
			// 	if (a.properties.state_code == stateCode) {
			// 		return a !== b; 	
			// 	}
			// }))
			// .attr("class", "mesh")
			// .attr("d", this.get('path'));
		}, 300);
	},

	drawStates() {
		if (isEmpty(this.get('states'))) {
			this.get('cartography').loadStatesData().then(() => {
				this.renderStates();
			});
		} else {
			this.renderStates();
		}
	},

	renderStates() {
		let emberContext = this;

		this.get('cartography').loadStatesData().then(() => {
				this.get('statesLayer').selectAll("path")
				.data(this.get('states'))
				.enter().append("path")
				.attr("d", this.get('path'))
				.attr("class", "feature")
				.on("click", function(d) {
					emberContext.clicked(this, d);
				});
			});
	},

	// Reset zoom and remove cities
	reset() {
		active.classed("active", false);
		active = d3.select(null);

		this.get('muniLayer').selectAll("*").remove();

		this.sendAction('setMunicipality', "");
		this.sendAction('setState', "");

		svg.transition()
			.duration(750)
			.call(this.get('zoom').transform, d3.zoomIdentity
			.translate(this.get('width') / 2, this.get('height') / 2)
			.scale(1 << 13)
			.translate(-this.get('center')[0], -this.get('center')[1]));
	},

	removeMunicipalities() {
		this.get('muniLayer').selectAll('*').remove();
	},

	removeSections() {
		this.get('sectionsLayer').selectAll('*').remove();
	},

	updateCurrData() {
		this.set('currState', this.get('state'));
		this.set('currMuni', this.get('municipality'));
		this.set('currSection', this.get('section'));
	}
});