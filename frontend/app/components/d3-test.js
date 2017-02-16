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
			.style("stroke-width", 1 / transform.k);

			var image = raster
			.attr("transform", stringify(tiles.scale, tiles.translate))
			.selectAll("image")
			.data(tiles, function(d) { return d; });

			image.exit().remove();

			image.enter().append("image")
			.attr("xlink:href", function(d) { return "http://" + "abc"[d[1] % 3] + ".tile.openstreetmap.org/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
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

		function addTiles(t) {
			// Lastly convert this to the corresponding tile.scale and tile.translate;
			// see http://bl.ocks.org/mbostock/4150951 for a related example.
			let tiles = d3Tile.tile()
			.size([width, height])
			.scale(t.k)
			.translate([t.x, t.y])
			();

			// TILES TILES

			let image = d3.select("#tiles")
			.selectAll("img").data(tiles, function(d) { return d; });

			image.exit().remove();

			image.enter().append("img")
			.style("position", "absolute")
			.attr("src", function(d, i) { return "http://" + "abc"[d[1] % 3] + ".tile.openstreetmap.org/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
			.style("left", function(d) { return (d[0] + tiles.translate[0]) * tiles.scale + "px"; })
			.style("top", function(d) { return (d[1] + tiles.translate[1]) * tiles.scale + "px"; })
			.attr("width", tiles.scale)
			.attr("height", tiles.scale);
		}

		// Zooming to bounding box when clicked
		function clicked(d) {
			if (active.node() === this) {
				return reset();
			} else {
				gMunicipalities.selectAll("*").remove();	
			}
			
			active.classed("active", false);
			active = d3.select(this).classed("active", true);

			let transform = calculateZoomToBBox(d);

			svg.transition()
			.duration(750)
			.call(zoom.transform, transform);

			// // Zoom in transition
			// gStates.transition()
			// .duration(750)
			// .style("stroke-width", 1.5 / transform.k + "px")
			// .attr("transform", transform);

			// Drawing selected states municipalities
			d3.json("../assets/mx_tj.json", (error, data) => {
				
				// Zoom in transition
				gMunicipalities.transition()
				.style("stroke-width", 1.5 / transform.k + "px")
				.attr("transform", transform);

				Ember.run.later(this, () => {
					gMunicipalities.append("path")
					.datum(topojson.mesh(data, data.objects.municipalities, function(a, b) { 
						if (a.properties.state_code == d.properties.state_code) {
							return a !== b; 	
						}
					}))
					.attr("class", "mesh")
					.attr("d", path);
				}, 600);
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