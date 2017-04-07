import Ember from 'ember';
import d3 from "npm:d3";
import d3Tile from "npm:d3-tile";
import d3ScaleChromatic from "npm:d3-scale-chromatic";
import topojson from "npm:topojson";

const { isEmpty } = Ember;

export default Ember.Component.extend({

	cartography: Ember.inject.service(),

	states: Ember.computed.oneWay('cartography.states'),

	municipalities: Ember.computed.oneWay('cartography.municipalities'),
	municipalitiesBorders: Ember.computed.oneWay('cartography.municipalitiesBorders'),

	federalDistricts: Ember.computed.oneWay('cartography.federalDistricts'),
	federalDistrictsBorders: Ember.computed.oneWay('cartography.federalDistrictsBorders'),

	sections: Ember.computed.oneWay('cartography.sections'),

	scaleExtent: [1 << 11, 1 << 26.5],

	centerCoords: [-102, 23],

	fill: d3.scaleLog().domain([10, 50]).range(["brown", "steelblue"]),

	// fill: d3.scaleThreshold()
	// 		.domain([1, 100, 200, 500, 1000, 2000, 3000, 4000, 6000, 8000])
	// 		.range(d3ScaleChromatic.schemeOrRd[9]),

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

	svg: null,

	statesLayer: null,

	muniLayer: null,

	sectionsLayer: null,

	imageLayer: null,

	currState: null,
	currMuni: null,
	currFedDistrict: null,
	currSection: null,


	stateCode: null,
	muniCode: null,
	fedDistrictCode: null,

	tooltip: null,

	// Overriding init
	init() {
		this._super(...arguments);
	},

	didReceiveAttrs() {
		this._super(...arguments);
	},

	renderMap() {

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
			if (this.get('mapDivision') === 'federal') {
				this.get('cartography').getState(newState).then((state) => {
					this.removeSections();
					this.removeMunicipalities();
					this.zoomToObject(state)
					this.set('stateCode', state.properties.state_code);
					this.drawFederalDistricts(this.get('stateCode'));
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
			
		} 

		// MUNICIPALITY
		if (this.get('level') === 'municipality') {

			if (this.get('mapDivision') === 'federal') {
				if (currFedDistrict === newFedDistrict) {
					this.get('cartography').getFederalDistrict(newFedDistrict, this.get('stateCode')).then((district) => {
						this.zoomToObject(district);
					});
				} else if(currState === newState) {

					this.get('cartography').getFederalDistrict(newFedDistrict, this.get('stateCode')).then((district) => {
						this.removeSections();
						this.zoomToObject(district);
						this.drawSections();
					});
				} else {
					this.get('cartography').getState(newState).then((state) => {
						this.set('stateCode', state.properties.state_code);

						this.drawFederalDistricts(this.get('stateCode'));

						this.get('cartography').getFederalDistrict(newFedDistrict, this.get('stateCode')).then((district) => {
							this.zoomToObject(district);
							this.set('fedDistrictCode', district.properties.district_code);
							this.drawSections();
						});
					});
				}

			} else {
				if (currMuni === newMuni) {

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
		}
		
		// SECTION
		if(this.get('level') === 'section') {

			if (this.get('mapDivision') === 'federal') {

				if (currState === newState && currFedDistrict === newFedDistrict) {
					this.get('cartography').getSectionByDistrict(this.get('stateCode'), this.get('fedDistrictCode'), newSection).then((section) => {
						this.zoomToObject(section);
					});
				} else {
					this.get('cartography').getState(newState).then((state) => {
						this.set('stateCode', state.properties.state_code);
						this.drawFederalDistricts(this.get('stateCode'));

						this.get('cartography').getFederalDistrict(newFedDistrict, this.get('stateCode')).then((district) => {
							this.set('fedDistrictCode', district.properties.district_code);

							this.get('cartography').getSection(this.get('stateCode'), this.get('fedDistrictCode'), newSection).then((section) => {
								this.drawSections();
								this.zoomToObject(section);
							});
						});
					});
				}

			} else {

				if (currState === newState && currMuni === currMuni) {
					this.get('cartography').getSection(this.get('stateCode'), this.get('muniCode'), newSection).then((section) => {
						this.zoomToObject(section);
					});
				} else {
					this.get('cartography').getState(newState).then((state) => {
						this.set('stateCode', state.properties.state_code);
						this.drawMunicipalities(this.get('stateCode'));

						this.get('cartography').getMunicipality(newMuni, this.get('stateCode')).then((municipality) => {
							this.set('muniCode', municipality.properties.mun_code);

							this.get('cartography').getSection(this.get('stateCode'), this.get('muniCode'), newSection).then((section) => {
								this.drawSections();
								this.zoomToObject(section);
							});
						});
					});
				}
			}
			
			
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

		this.set('tooltip', d3.select('#tooltip-map'));

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
			.style("stroke-width", .7 / transform.k);

		this.get('muniLayer')
			.attr("transform", transform)
			.style("stroke-width", 2.5 /transform.k);

		this.get('sectionsLayer')
			.attr("transform", transform)
			.style("stroke-width", 3 / transform.k);

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

		console.log(d.properties);

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
		console.log("drawing sections");

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
			.style("fill", function(d) {
				// console.log(d);
				let randomNum = Math.floor(Math.random() * 50) + 10;
				return emberContext.get('fill')(randomNum);
				// return emberContext.get('fill')(d.properties.population);
			})
			.on("click", function(d) {
				emberContext.clicked(this, d);
			})
			.on("mouseover", function(d) {
				emberContext.get('tooltip')
					.style('display', "inline");
			})
			.on("mousemove", function(d) {
				emberContext.get('tooltip')
					.style("left", (d3.event.pageX - 170) + "px")
					.style("top", (d3.event.pageY - 100) + "px");
			})
			.on("mouseout", function(d) {
				emberContext.get('tooltip')
					.style('display', 'none');
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

			this.get('muniLayer').append("path")
				.datum(this.get('municipalitiesBorders'))
				.attr("class", "mesh")
				.attr("d", this.get('path'));
		}, 300);
	},

	drawFederalDistricts(stateCode) {
		if (isEmpty(this.get('federalDistricts'))) {
			this.get('cartography').loadFederalDistrictsData(stateCode).then(() => {
				this.renderFederalDistricts();
			});
		} else {
			this.renderFederalDistricts();
		}
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
		this.set('currFedDistrict', this.get('federalDistrict'));
	}
});