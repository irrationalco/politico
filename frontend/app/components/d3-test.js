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
	// Accepts as a param a geoprahy object or a BBox as an array
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

	// Function to decide which layer to draw based on url params
	draw(d) {
		if (this.get('state') === "Nuevo León" && this.get('municipality')) {
			this.drawSections(d);
		} else {
			this.drawMunicipalities(d);
		}
	},

	// Drawing sections
	drawSections(d) {
		let emberScope = this;

		d3.json("../assets/MX_NL.json", (error,data) => {
			Ember.run.later(this, () => {
				this.get('sectionsLayer').selectAll("path")
					.data(topojson.feature(data, data.objects.nuevoLeon).features)
					.enter().append("path")
					.attr("d", this.get('path'))
					.attr("class", "section")
					.on("click", function(d) {
						emberScope.clicked(this, d);
					});
			});
		});
	},

	// Drawing municipalities
	drawMunicipalities(d) {

		d3.json("../assets/mx_tj.json", (error, data) => {
			let emberScope = this;
			let municipalities = topojson.feature(data, data.objects.municipalities).features
			.filterBy("properties.state_code", d.properties.state_code);

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
					if (a.properties.state_code == d.properties.state_code) {
						return a !== b; 	
					}
				}))
				.attr("class", "mesh")
				.attr("d", this.get('path'));

			}, 300);
		});
	},

	// Overriding init
	init() {
		this._super(...arguments);	
	},

	// DID INSERT ELEMENT
	didInsertElement() {

		// Saving ember scope
		let emberThis = this;

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
			.attr("height", this.get('height'))
			.on("click", reset);

		// Defining layers
		this.set('imageLayer', this.get('svg').append('g'));
		this.set('statesLayer', this.get('svg').append('g'));
		this.set('muniLayer', this.get('svg').append('g'));
		this.set('sectionsLayer', this.get('svg').append('g'));

		let center = this.get('center');

		// Apply zoom behaviour to svg, and make an initial transform to center
		this.get('svg')
			.call(this.get('zoom'))
			.call(this.get('zoom').transform, d3.zoomIdentity
				.translate(this.get('width') / 2, this.get('height') / 2)
				.scale(1 << 13.5)
				.translate(-center[0], -center[1]));

		// Getting topojson data
		d3.json("../assets/MX_NL.json", (error, data) => {
			if (error) { console.log(error); }

			this.get('statesLayer').selectAll("path")
				.data(topojson.feature(data, data.objects.states).features)
				.enter().append("path")
				.attr("d", emberThis.get('path'))
				.attr("class", "feature")
				.on("click", function(d) {
					emberThis.clicked(this, d);
				});

			// gStates.selectAll("path")
			// 	.data(topojson.feature(data, data.objects.states).features)
			// 	.enter().append("path")
			// 	.attr("d", path)
			// 	.attr("class", "feature")
			// 	.on("click", clicked);

			// gMunicipalities.append("path")
			// 	.datum(topojson.mesh(data, data.objects.municipalities, function(a, b) { return a !== b; }))
			// 	.attr("class", "mesh")
			// 	.attr("d", path);
		});

		// Reset zoom and remove cities
		function reset() {
			active.classed("active", false);
			active = d3.select(null);

			emberThis.get('muniLayer').selectAll("*").remove();

			emberThis.sendAction('setMunicipality', "");
			emberThis.sendAction('setState', "");

			svg.transition()
			.duration(750)
			.call(emberThis.get('zoom').transform, d3.zoomIdentity
			.translate(this.get('width') / 2, this.get('height') / 2)
			.scale(1 << 13)
			.translate(-center[0], -center[1]));
		}

	}
});


// Center on Nuevo León
// let center = projection([-99.8, 25.5]);

// Draw Municipalities mesh
// d3.json("../assets/mx_tj.json", (error, data) => {
// 	Ember.run.later(this, () => {
// 		gMunicipalities.append("path")
// 		.datum(topojson.mesh(data, data.objects.municipalities, function(a, b) { 
// 			if (a.properties.state_code == d.properties.state_code) {
// 				return a !== b; 	
// 			}
// 		}))
// 		.attr("class", "mesh")
// 		.attr("d", path);
// 	}, 300);
// });

// // Zoom in transition
// gStates.transition()
// .duration(750)
// .style("stroke-width", 1.5 / transform.k + "px")
// .attr("transform", transform);

// // Zoom in transition
// gMunicipalities.transition()
// .style("stroke-width", 1.5 / transform.k + "px")
// .attr("transform", transform);


// Bounding Box Mexico
// let mexicoBounds = [[-116.2, 12.87],[-88.15, 32.82]],
// p0 = projection([mexicoBounds[0][0], mexicoBounds[1][1]]),
// p1 = projection([mexicoBounds[1][0], mexicoBounds[0][1]]);

// // Convert this to a scale k and translate tx, ty for the projection.
// // For crisp image tiles, clamp to the nearest power of two.
// let k = Math.floor(0.95 / Math.max((p1[0] - p0[0]) / width, (p1[1] - p0[1]) / height)),
// tx = (width - k * (p1[0] + p0[0])) / 2,
// ty = (height - k * (p1[1] + p0[1])) / 2;


// Calculating scale by getting path bounds
// let bounds = path.bounds(d),
// dx = bounds[1][0] - bounds[0][0],
// dy = bounds[1][1] - bounds[0][1],
// x = (bounds[0][0] + bounds[1][0]) / 2,
// y = (bounds[0][1] + bounds[1][1]) / 2,
// scale = .9 / Math.max(dx / width, dy / height),
// translate = [width / 2 - scale * x, height / 2 - scale * y];