import Ember from 'ember';
import d3 from "npm:d3";
import d3Tile from "npm:d3-tile";
import topojson from "npm:topojson";

export default Ember.Component.extend({

	scaleExtent: [1 << 11, 1 << 26],

	// Coordinates on where to center map
	centerCoords: [-102, 23],

	center: Ember.computed('projection', function() {
		let projection = this.get('projection');
		return projection(this.get('centerCoords'));
	}),

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

		if (d.properties.section_code) {
			this.sendAction('setSection', String(d.properties.section_code));
		} else if(d.properties.mun_code) {
			this.sendAction('setMunicipality', d.properties.mun_name);
		} else {
			this.sendAction('setState', d.properties.state_name);
		}

		// if (active.node() === this) {
		// 	return reset();
		// }
		
		// active.classed("active", false);
		// active = d3.select(this).classed("active", true);

		let transform = this.calculateZoomToBBox(d, this.get('path'));

		Ember.run.later(this, () => {
			this.get('svg').transition()
				.duration(950)
				.call(this.get('zoom').transform, transform)
				.on("end", this.draw(d));
		}, 50);
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

	// Function to decide which layer to draw based on url params
	draw(d) {
		console.log(d);

		if (this.get('state') && this.get('municipality')) {
			this.drawSections(d);
		} else {
			this.drawMunicipalities(d);
		}
	},

	// Drawing sections
	drawSections(d) {
		let emberScope = this;
		let munCode = d.properties.mun_code;
		let stateCode = d.properties.state_code;

		d3.json("../assets/secciones.json", (error, data) => {

			let sections = topojson.feature(data, data.objects.secciones).features
				.filterBy('properties.state_code', stateCode)
				.filterBy('properties.mun_code', munCode);

				this.get('sectionsLayer').selectAll("*").remove();

				this.get('sectionsLayer').selectAll("path")
					.data(sections)
					.enter().append("path")
					.attr("d", this.get('path'))
					.attr("class", "section")
					.on("click", function(d) {
						emberScope.clicked(this, d);
					});
		});
	},

	// Drawing municipalities
	drawMunicipalities(d) {
		let emberScope = this;
		let stateCode = d.properties.state_code;

		d3.json("../assets/mx_tj.json", (error, data) => {
			let municipalities = topojson.feature(data, data.objects.municipalities).features
				.filterBy("properties.state_code", stateCode);

			Ember.run.later(this, () => {
				this.get('muniLayer').selectAll("path")
				.data(municipalities)
				.enter().append("path")
				.attr("d", this.get('path'))
				.attr("class", "feature")
				.on("click", function(d) {
					emberScope.clicked(this, d);
				});

				this.get('muniLayer').append("path")
				.datum(topojson.mesh(data, data.objects.municipalities, function(a, b) { 
					if (a.properties.state_code == stateCode) {
						return a !== b; 	
					}
				}))
				.attr("class", "mesh")
				.attr("d", this.get('path'));

			}, 300);
		});
	},

	drawStates() {
		let emberScope = this;

		d3.json("../assets/MX_NL.json", (error, data) => {
			if (error) { console.log(error); }

			this.get('statesLayer').selectAll("path")
				.data(topojson.feature(data, data.objects.states).features)
				.enter().append("path")
				.attr("d", this.get('path'))
				.attr("class", "feature")
				.on("click", function(d) {
					emberScope.clicked(this, d);
				});
		});
	},

	// Overriding init
	init() {
		this._super(...arguments);	
	},

	didInsertElement() {
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

		// Apply zoom behaviour to svg, and make an initial transform to center
		this.get('svg')
			.call(this.get('zoom'))
			.call(this.get('zoom').transform, d3.zoomIdentity
				.translate(this.get('width') / 2, this.get('height') / 2)
				.scale(1 << 13.5)
				.translate(-this.get('center')[0], -this.get('center')[1]));

		this.drawStates();
	}
});