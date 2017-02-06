import Ember from 'ember';

export default Ember.Component.extend({

	reset() {
		active.classed("active", false);
		active = d3.select(null);

		g.transition()
		.duration(750)
		.style("stroke-width", "1.5px")
		.attr("transform", "");
	},

	clicked() {
		if (active.node() === this) return reset();
		active.classed("active", false);
		active = d3.select(this).classed("active", true);

		var bounds = path.bounds(d),
		dx = bounds[1][0] - bounds[0][0],
		dy = bounds[1][1] - bounds[0][1],
		x = (bounds[0][0] + bounds[1][0]) / 2,
		y = (bounds[0][1] + bounds[1][1]) / 2,
		scale = .9 / Math.max(dx / width, dy / height),
		translate = [width / 2 - scale * x, height / 2 - scale * y];

		g.transition()
		.duration(750)
		.style("stroke-width", 1.5 / scale + "px")
		.attr("transform", "translate(" + translate + ")scale(" + scale + ")");
	},

	didInsertElement() {
		// Setting width and height of map container
		let width = 960;
		let height = 500;
		let active = d3.select(null);

		// Settings of the map projection
		let projection = d3.geo.albersUsa()
			.scale(1000)
			.translate([width / 2, height / 2]);

		let path = d3.geo.path().projection(projection);

		// Initializing SVG on the html element
		let svg = d3.select("#map").append("svg")
			.attr("width", width)
			.attr("height", height);

		svg.append("rect")
			.attr("class", "map-background")
			.attr("width", width)
			.attr("height", height)
			.on("click", reset);

		let g = svg.append("g")
			.style("stroke-width", "1.5px");

		// Getting topojson data
		d3.json("../assets/us.json", (error, data) => {
			if (error) { console.log(error); }

			g.selectAll("path")
				.data(topojson.feature(data, data.objects.states).features)
				.enter().append("path")
				.attr("d", path)
				.attr("class", "feature")
				.on("click", clicked);

			g.append("path")
				.datum(topojson.mesh(data, data.objects.states, function(a, b) { return a !== b; }))
				.attr("class", "mesh")
				.attr("d", path);
		});
	}
});