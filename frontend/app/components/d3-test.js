import Ember from 'ember';
import d3 from "npm:d3";
import topojson from "npm:topojson";

export default Ember.Component.extend({

	didInsertElement() {

		var svg = d3.select("svg");

		var path = d3.geoPath();

		d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
			if (error) throw error;

			svg.append("g")
			.attr("class", "states")
			.selectAll("path")
			.data(topojson.feature(us, us.objects.states).features)
			.enter().append("path")
			.attr("d", path);

			svg.append("path")
			.attr("class", "state-borders")
			.attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
		});


		// // Setting width and height of map container
		// let width = 900;
		// let height = 900;
		// let active = d3.select(null);

		// // Settings of the map projection

		// // United States Projection
		// let projection = d3.geo.albersUsa()
		// 	.scale(1000)
		// 	.translate([width / 2, height / 2]);

		// // Mexico states projection
		// // let projection = d3.geo.mercator()
		// // 	.center([-102, 23])
		// // 	.scale(1700)
		// // 	.translate([width / 2, height / 2]);

		// let path = d3.geo.path().projection(projection);

		// // Initializing SVG on the html element
		// let svg = d3.select("#map").append("svg")
		// 	.attr("width", width)
		// 	.attr("height", height);

		// svg.append("rect")
		// 	.attr("class", "map-background")
		// 	.attr("width", width)
		// 	.attr("height", height)
		// 	.on("click", reset);

		// let g = svg.append("g")
		// 	.style("stroke-width", "1px");

		// // Getting topojson data
		// d3.json("../assets/us.json", (error, data) => {
		// 	if (error) { console.log(error); }

		// 	g.selectAll("path")
		// 		.data(topojson.feature(data, data.objects.states).features)
		// 		.enter().append("path")
		// 		.attr("d", path)
		// 		.attr("class", "feature")
		// 		.on("click", clicked);

		// 	g.append("path")
		// 		.datum(topojson.mesh(data, data.objects.states, function(a, b) { return a !== b; }))
		// 		.attr("class", "mesh")
		// 		.attr("d", path);
		// });

		// function clicked(d) {
		// 	if (active.node() === this) return reset();
		// 	active.classed("active", false);
		// 	active = d3.select(this).classed("active", true);

		// 	var bounds = path.bounds(d),
		// 	dx = bounds[1][0] - bounds[0][0],
		// 	dy = bounds[1][1] - bounds[0][1],
		// 	x = (bounds[0][0] + bounds[1][0]) / 2,
		// 	y = (bounds[0][1] + bounds[1][1]) / 2,
		// 	scale = .9 / Math.max(dx / width, dy / height),
		// 	translate = [width / 2 - scale * x, height / 2 - scale * y];

		// 	g.transition()
		// 	.duration(750)
		// 	.style("stroke-width", 1.5 / scale + "px")
		// 	.attr("transform", "translate(" + translate + ")scale(" + scale + ")");
		// }

		// function reset() {
		// 	active.classed("active", false);
		// 	active = d3.select(null);

		// 	g.transition()
		// 	.duration(750)
		// 	.style("stroke-width", "1.5px")
		// 	.attr("transform", "");
		// }

	}
});