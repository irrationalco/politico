import Ember from 'ember';
import d3 from "npm:d3";
import d3Tile from "npm:d3-tile";
import d3ScaleChromatic from "npm:d3-scale-chromatic";
import { task, timeout } from 'ember-concurrency';

const { isEmpty } = Ember;

export default Ember.Component.extend({

	partiesManager:  Ember.inject.service("parties"),
	store: 					 Ember.inject.service(),
	cartography: 		 Ember.inject.service(),

	selectedParties: Ember.computed.oneWay("partiesManager.selectedParties"),

	states: 				 Ember.computed.oneWay('cartography.states'),

	municipalities:  			 Ember.computed.oneWay('cartography.municipalities'),
	municipalitiesBorders: Ember.computed.oneWay('cartography.municipalitiesBorders'),

	federalDistricts: 			 Ember.computed.oneWay('cartography.federalDistricts'),
	federalDistrictsBorders: Ember.computed.oneWay('cartography.federalDistrictsBorders'),

	sections: Ember.computed.oneWay('cartography.sections'),

	scaleExtent: 	[1 << 11, 1 << 26.5],

	centerCoords: [-102, 23],

	transform: null,

	fillVotes: d3.scaleLog().domain([10, 50]).range(["brown", "steelblue"]),

	fillPopulation: d3.scaleThreshold()
			.domain([1, 100, 200, 500, 1000, 2000, 3000, 4000, 6000, 8000])
			.range(d3ScaleChromatic.schemeOrRd[9]),

	fillBlues: d3.scaleThreshold()
			.domain([100, 1000, 2000, 3000])
			.range(d3ScaleChromatic.schemeBlues[5]),

	fillReds: d3.scaleThreshold()
			.domain([100, 1000, 2000, 3000])
			.range(d3ScaleChromatic.schemeReds[5]),

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
				this.get('tooltip').style('display', 'none');
				this.zoomed();
			});
	}),

	tile: Ember.computed('width', 'height', function() {
		return d3Tile.tile().size([this.get('width'), this.get('height')]);
	}),

	svg: 					 	 null,

	statesLayer:	 	 null,

	muniLayer: 	 	 	 null,

	sectionsLayer: 	 null,

	imageLayer: 	 	 null,

	currState: 		 	 null,
	currMuni: 			 null,
	currFedDistrict: null,
	currSection: 		 null,

	currDataType: 	 "votes",

	hoveredSection:  null,

	stateCode: 			 null,
	muniCode: 			 null,
	fedDistrictCode: null,

	tooltip: 				 null,

	didUpdateAttrs() {
		this._super(...arguments);
		this.get('renderMap').perform();
	},

	didInsertElement() {
		this._super(...arguments);

		// Setting width and height of map container
		// let active = d3.select(null);

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

		this.set('tooltip', d3.select('#tooltip-map'));

		// Defining layers
		this.set('imageLayer', this.get('svg').append('g'));
		this.set('statesLayer', this.get('svg').append('g'));
		this.set('muniLayer', this.get('svg').append('g'));
		this.set('sectionsLayer', this.get('svg').append('g'));

		// this.drawStates();
		this.get('renderStates').perform();
		this.zoomToCoordinates(this.get('centerCoords'), 1 << 13.5, this.get('svg'));
		this.get('renderMap').perform();

		// Apply zoom behaviour to svg, and make an initial transform to center
		this.get('svg')
			.call(this.get('zoom'));
	},

	renderMap: task(function * () {
		let currState = this.get('currState');
		let newState = this.get('state');
		let currMuni = this.get('currMuni');
		let newMuni = this.get('municipality');
		let currSection = this.get('currSection');
		let newSection = this.get('section');
		let currFedDistrict = this.get('currFedDistrict');
		let newFedDistrict = this.get('federalDistrict');

		// COUNTRY
		if (this.get('level') === 'country') {

			this.zoomToCoordinates(this.get('centerCoords'), 1 << 13.5, this.get('svg'));
			if (!isEmpty(currState)) {
				this.removeSections();
				this.removeMunicipalities();
			}
			this.updateCurrData();
		} 

		// STATE
		if (this.get('level') === 'state') {
			let state = yield this.get('cartography.getState').perform(newState);
			this.removeSections();
			this.removeMunicipalities();
			this.set('stateCode', state.properties.state_code);
			this.updateCurrData();
			let zoomed = yield this.get('zoomToObject').perform(state);
			
			if (this.get('mapDivision') === 'federal') {
				this.renderFederalDistricts();
			} else {
				this.renderMunicipalities();
			}
		} 

		// MUNICIPALITY
		if (this.get('level') === 'municipality') {
			if (this.get('mapDivision') === 'federal') {

				if (currFedDistrict === newFedDistrict) {
					this.paintSections();

				} else if (currState === newState) {
					let district = yield this.get('cartography.getFederalDistrict').perform(newFedDistrict, this.get('stateCode'));
					this.removeSections();
					this.updateCurrData();
					let zoomed = yield this.get('zoomToObject').perform(district);
					this.renderSections();
					
				} else {
					let state = yield this.get('cartography.getState').perform(newState);
					this.set('stateCode', state.properties.state_code);
					this.renderFederalDistricts(this.get('stateCode'));

					let district = yield this.get('cartography.getFederalDistrict').perform(newFedDistrict, this.get('stateCode'));
					this.set('fedDistrictCode', district.properties.district_code);
					this.updateCurrData();
					let zoomed = yield this.get('zoomToObject').perform(district);
					this.renderSections();
					
				}

			} else {
				if (currMuni === newMuni) {
					this.paintSections();
				} else if(currState === newState) {
					let municipality = yield this.get("cartography.getMunicipality").perform(newMuni, this.get('stateCode'));
					this.removeSections();
					this.updateCurrData();
					let zoomed = yield this.get('zoomToObject').perform(municipality);
					this.renderSections();

				} else {
					let state = yield this.get('cartography.getState').perform(newState);
					this.set('stateCode', state.properties.state_code);
					this.renderMunicipalities();
					let municipality = yield this.get('cartography.getMunicipality').perform(newMuni, this.get('stateCode'));
					let zoomed = yield this.get('zoomToObject').perform(municipality);
					this.set('muniCode', municipality.properties.mun_code);
					this.updateCurrData();
					this.renderSections();
				}
			}
		}		

		// SECTION
		if(this.get('level') === 'section') {
			if (this.get('mapDivision') === 'federal') {
				if (currSection === newSection) {
					this.paintSections();
				} else if (currState === newState && currFedDistrict === newFedDistrict) {
					let section = yield this.get('cartography.getSectionByDistrict').perform(this.get('stateCode'),
										this.get('fedDistrictCode'), newSection);
					this.updateCurrData();
					let zoomed = yield this.get('zoomToObject').perform(section);

				} else {
					let state = yield this.get('cartography.getState').perform(newState);
					this.set('stateCode', state.properties.state_code);
					this.renderFederalDistricts(this.get('stateCode'));

					let district = yield this.get('cartography.getFederalDistrict').perform(newFedDistrict, this.get('stateCode'));
					this.set('fedDistrictCode', district.properties.district_code);

					let section = yield this.get('cartography.getSectionByDistrict').perform(this.get('stateCode'), this.get('fedDistrictCode'), newSection);
					this.updateCurrData();
					let zoomed = yield this.get('zoomToObject').perform(section);
					this.renderSections();
				}
			} else {

				if (currSection === newSection) {
					this.paintSections();
				} else if (currState === newState && currMuni === currMuni) {

					let section = yield this.get('cartography.getSection').perform(this.get('stateCode'), this.get('muniCode'), newSection);
					let zoomed = this.get('zoomToObject').perform(section);

				} else {
					let state = yield this.get('cartography.getState').perform(newState);
					this.set('stateCode', state.properties.state_code);
					this.renderMunicipalities();

					let municipality = yield this.get('cartography.getMunicipality').perform(newMuni, this.get('stateCode'));
					this.set('muniCode', municipality.properties.mun_code);

					let section = yield this.get('cartography.getSection').perform(this.get('stateCode'), this.get('muniCode'), newSection);
					this.updateCurrData();
					let zoomed = this.get('zoomToObject').perform(section);
					this.renderSections();
				}
			}
		}
	}).restartable(),

	drawSections() {
		if (isEmpty(this.get('sections'))) {
			this.get('cartography').loadSectionsData(this.get('stateCode'), this.get('muniCode')).then(() => {
				this.renderSections();
			});
		} else {
			this.renderSections();
		}
	},

	paintSections() {
		let vis = this.get('visualization');

		if (vis === "single") {
			this.paintNormally();
		} else if (vis === "comparison") {
			this.paintComparison();
		} else {
			this.paintNormally();
		}
	},

	paintComparison() {
		let emberContext = this;
		this.set('tooltip', d3.select('#tooltip-map'));

		this.get('sectionsLayer').selectAll("path")
			.style("fill", function(d) {

				if (emberContext.get('dataType') === 'votes') {
					let s = emberContext.get('sectionsData')
							.findBy('sectionCode', d.properties.section_code);

					if (isEmpty(s)) {
						return "transparent";
					} else {
						let parties = emberContext.get('partiesManager').computeComparison(s);
						let color = emberContext.get('partiesManager').getComparisonColor(parties, s);
						return color["hex"];
					}

				} else {
					return emberContext.get('fillPopulation')(d.properties.population);
				}
			})
			.style("stroke", function(d) {

				if (emberContext.get('dataType') === 'votes') {
					let s = emberContext.get('sectionsData')
							.findBy('sectionCode', d.properties.section_code);

					if (isEmpty(s)) {
						return "transparent";
					} else {
						let parties = emberContext.get('partiesManager').computeComparison(s);
						let color = emberContext.get('partiesManager').getComparisonColor(parties, s);
						return color["hex"];
					}

					// if (color["isGradient"]) {
					// 	d3.select(this).style("stroke-width", 3 / emberContext.get('transform').k + " !important");
					// 	return "black";
					// } else {
					// 	return color["hex"];
					// }
				} else {
					return emberContext.get('fillPopulation')(d.properties.population);
				}
			})
			.style("opacity", function(d) {
				let opacity = ".1";

				if (d.properties.population > 0) {
					opacity = ".5";
				}

				if (d.properties.population > 400) {
					opacity = ".6";
				}

				if (d.properties.population > 800) {
					opacity = ".7";
				}

				if (d.properties.population > 1600) {
					opacity = ".8";
				}

				if (d.properties.population > 3000) {
					opacity = ".9";
				}

				return opacity;
			});
	},

	paintNormally() {
		let emberContext = this;

		this.set('tooltip', d3.select('#tooltip-map'));

		this.get('sectionsLayer').selectAll("path")
			.style("fill", function(d) {
				if (emberContext.get('dataType') === 'votes') {
					let s = emberContext.get('sectionsData')
							.findBy('sectionCode', d.properties.section_code);

					if (isEmpty(s)) {
						return "transparent";
					} else {
						return emberContext.get('partiesManager').getColor(s);
					}

				} else {
					return emberContext.get('fillPopulation')(d.properties.population);
				}
			})
			.style("stroke", function(d) {

				if (emberContext.get('dataType') === 'votes') {
					// let randomNum = Math.floor(Math.random() * 50) + 10;
					let s = emberContext.get('sectionsData')
							.findBy('sectionCode', d.properties.section_code);

					if (isEmpty(s)) {
						return "transparent";
					} else {
						return emberContext.get('partiesManager').getColor(s);
					}

				} else {
					return emberContext.get('fillPopulation')(d.properties.population);
				}
			})
			.style("fill-opacity", function(d) {
				return 1;
			});
	},

	renderSections() { 
		let emberContext = this;

		this.set('tooltip', d3.select('#tooltip-map'));

		this.get('sectionsLayer').selectAll("path")
			.data(this.get('sections'))
			.enter().append("path")
			.attr("d", this.get('path'))
			.attr("class", "section")
			.classed("hovered-section", true)
			.on("click", function(d) {
				emberContext.clicked(this, d);
			})
			.on("mouseenter", function(d) {
				emberContext.set('hoveredSection', d.properties);
				d3.select(this).style("stroke-width", 3 / emberContext.get('transform').k);
			})
			.on("mouseover", function(d) {
				emberContext.get('tooltip')
					.style('display', "inline");
			})
			.on("mousemove", function(d) {
				emberContext.get('tooltip')
					.style("left", (d3.event.pageX - 200) + "px")
					.style("top", (d3.event.pageY - 190) + "px");
			})
			.on("mouseout", function(d) {
				emberContext.get('tooltip')
					.style('display', 'none');
				emberContext.set('hoveredSection', null);
				d3.select(this).style("stroke-width", 1 / emberContext.get('transform').k);
			});

		this.paintSections();
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

			this.get('muniLayer').append("path")
				.datum(this.get('municipalitiesBorders'))
				.attr("class", "mesh")
				.attr("d", this.get('path'));
		}, 300);
	},

	renderFederalDistricts() {
		let emberContext = this;

		Ember.run.later(this, () => {
			this.get('muniLayer').selectAll("path")
			.data(this.get('federalDistricts'))
			.enter().append("path")
			.attr("d", this.get('path'))
			.attr("class", "feature")
			.on("click", function(d) {
				emberContext.clicked(this, d);
			});

			this.get('muniLayer').append("path")
				.datum(this.get('federalDistrictsBorders'))
				.attr("class", "mesh")
				.attr("d", this.get('path'));
		}, 300);
	},

	renderStates: task(function * () {
		if (isEmpty(this.get('states'))) { let statesData = yield this.get('cartography.loadStatesData').perform(); }
		let emberContext = this;

		this.get('statesLayer').selectAll("path")
			.data(this.get('states'))
			.enter().append("path")
			.attr("d", this.get('path'))
			.attr("class", "feature")
			.on("click", function(d) {
				emberContext.clicked(this, d);
			});
	}),

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
		this.set('currFedDistrict', this.get('federalDistrict'));
		this.set('currDataType', this.get('dataType'));
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
			.scale(0.9 / Math.max(dx / this.get('width'), dy / this.get('height')))
			.translate(-x, -y);
	},

	stringify(scale, translate) {
		var k = scale / 256, r = scale % 1 ? Number : Math.round;
		return "translate(" + r(translate[0] * scale) + "," + r(translate[1] * scale) + ") scale(" + k + ")";
	},

	zoomed() {
		let transform = d3.event.transform;
		this.set('transform', transform);

		let tiles = this.get('tile')
			.scale(transform.k)
			.translate([transform.x, transform.y])();

		this.get('statesLayer')
			.attr("transform", transform)
			.style("stroke-width", 0.7 / transform.k);

		this.get('muniLayer')
			.attr("transform", transform)
			.style("stroke-width", 2.5 /transform.k);

		this.get('sectionsLayer')
			.attr("transform", transform)
			.style("stroke-width", 1 / transform.k);

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
	// Setting new objects 
	clicked(element, d) {
		if (d.properties.section_code) {
			this.sendAction('setSection', d.properties.section_code);
		} else if(d.properties.mun_code) {
			this.sendAction('setMunicipality', d.properties.mun_name);
			this.sendAction('setSection', '');
		} else if (d.properties.district_code) {
			this.sendAction('setFederalDistrict', d.properties.district_code);
			this.sendAction('setSection', '');
		} else {
			this.sendAction('setState', d.properties.state_name);
			this.sendAction('setMunicipality', '');
			this.sendAction('setSection', '');
			this.sendAction('setFederalDistrict', '');
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

	zoomToObject: task(function * (d) {
		this.get('zoom').transform;
		let transform = this.calculateZoomToBBox(d, this.get('path'));

		let currTransform = this.get('zoom').transform;

		if (transform === currTransform) {}

		Ember.run.later(this, () => {
			this.get('svg').transition()
				.duration(1300)
				.call(this.get('zoom').transform, transform);
		}, 50);
		yield timeout(1300);
		return true;
	}),

	zoomToCoordinates(coordinates, zoomValue, element) {
		let projection = this.get('projection');
		let center = projection(this.get('centerCoords'));

		this.get('svg').call(this.get('zoom').transform, d3.zoomIdentity
			.translate(this.get('width') / 2, this.get('height') / 2)
			.scale(zoomValue)
			.translate(-center[0], -center[1]));
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
	}
});