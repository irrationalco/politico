import Ember from 'ember';
import d3 from "npm:d3";
import d3Tile from "npm:d3-tile";
import topojson from "npm:topojson";

export default Ember.Component.extend({

	mapData: null,

	didInsertElement() {

		let pi = Math.PI;
		let tau = 2 * pi;

		// Setting width and height of map container
		let width = Ember.$("#map").width();
		let height = Ember.$("#map").height();
		let active = d3.select(null);

		// Settings of the map projection
		// Mexico states projection
		let projection = d3.geoMercator()
			.scale(1 / tau)
			.translate([0, 0]);


		let zoom = d3.zoom()
			.scaleExtent([1 << 11, 1 << 20])
			.on("zoom", zoomed);

		let tile = d3Tile.tile()
			.size([width, height]);

		let path = d3.geoPath().projection(projection);

		// Initializing SVG on the html element
		let svg = d3.select("#map").append("svg")
			.attr("class", "svg-map")
			.attr("width", width)
			.attr("height", height);

		svg.append("rect")
			.attr("class", "map-background")
			.attr("width", width)
			.attr("height", height)
			.on("click", reset);

		// Defining layers
		let raster = svg.append("g");

		let gStates = svg.append("g")
			.style("stroke-width", "1.5px");

		let gMunicipalities = svg.append("g")
			.style("stroke-width", "1px");

		let center = projection([-102, 23]);

		svg
		.call(zoom)
		.call(zoom.transform, d3.zoomIdentity
			.translate(width / 2, height / 2)
			.scale(1 << 13)
			.translate(-center[0], -center[1]));

		// Getting topojson data
		d3.json("../assets/mx_tj.json", (error, data) => {
			if (error) { console.log(error); }

			gStates.selectAll("path")
				.data(topojson.feature(data, data.objects.states).features)
				.enter().append("path")
				.attr("d", path)
				.attr("class", "feature")
				.on("click", clicked);

			// gMunicipalities.append("path")
			// 	.datum(topojson.mesh(data, data.objects.municipalities, function(a, b) { return a !== b; }))
			// 	.attr("class", "mesh")
			// 	.attr("d", path);
		});

		function zoomed() {
			let transform = d3.event.transform;

			let tiles = tile
			.scale(transform.k)
			.translate([transform.x, transform.y])
			();

			gStates
			.attr("transform", transform)
			.style("stroke-width", 1 / transform.k);

			gMunicipalities
			.attr("transform", transform)
			.style("stroke-width", 1.3 / transform.k);

			var image = raster
			.attr("transform", stringify(tiles.scale, tiles.translate))
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
		}

		function stringify(scale, translate) {
			var k = scale / 256, r = scale % 1 ? Number : Math.round;
			return "translate(" + r(translate[0] * scale) + "," + r(translate[1] * scale) + ") scale(" + k + ")";
		}

		// Function that calculates zoom and the required translation to a given Bounding Box
		// Accepts as a param a geoprahy object or a BBox as an array
		function calculateZoomToBBox(d) {
			let bounds = Array.isArray(d) ? d : path.bounds(d);
			
			// Calculating scale by getting path bounds
			let dx = bounds[1][0] - bounds[0][0],
			dy = bounds[1][1] - bounds[0][1],
			x = (bounds[0][0] + bounds[1][0]) / 2,
			y = (bounds[0][1] + bounds[1][1]) / 2;

			return d3.zoomIdentity
			.translate(width / 2, height / 2)
			.scale(.9 / Math.max(dx / width, dy / height))
			.translate(-x, -y);
		}

		// Zooming to bounding box when clicked
		function clicked(d) {

			console.log(d);
			console.log(this);
			console.log(active.node());

			if (active.node() === this) {
				return reset();
			}
			
			active.classed("active", false);
			active = d3.select(this).classed("active", true);

			let transform = calculateZoomToBBox(d);

			svg.transition()
			.duration(950)
			.call(zoom.transform, transform)
			.on("end", drawMunicipalities(d));

		}

		function drawMunicipalities(d) {

			d3.json("../assets/mx_tj.json", (error, data) => {

				let municipalities = topojson.feature(data, data.objects.municipalities).features
									.filterBy("properties.state_code", d.properties.state_code);

				Ember.run.later(this, () => {
					gMunicipalities.selectAll("path")
					.data(municipalities)
					.enter().append("path")
					.attr("d", path)
					.attr("class", "feature")
					.on("click", clicked);

					gMunicipalities.append("path")
					.datum(topojson.mesh(data, data.objects.municipalities, function(a, b) { 
						if (a.properties.state_code == d.properties.state_code) {
							return a !== b; 	
						}
					}))
					.attr("class", "mesh")
					.attr("d", path);

				}, 300);
			});
		}

		// Reset zoom and remove cities
		function reset() {
			active.classed("active", false);
			active = d3.select(null);

			gMunicipalities.selectAll("*").remove();

			svg.transition()
			.duration(750)
			.call(zoom.transform, d3.zoomIdentity
			.translate(width / 2, height / 2)
			.scale(1 << 13)
			.translate(-center[0], -center[1]));
		}

	}
});



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