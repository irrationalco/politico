import Ember from 'ember';
import d3 from "npm:d3";
import topojson from "npm:topojson";

export default Ember.Component.extend({

	mapData: null,

	didInsertElement() {

		// Setting width and height of map container
		let width = Ember.$("#map").width();
		let height = Ember.$("#map").height() - 10;
		let active = d3.select(null);

		// Settings of the map projection

		// United States Projection
		// let projection = d3.geoAlbersUsa()
		// 	.scale(1000)
		// 	.translate([width / 2, height / 2]);

		// Mexico states projection
		let projection = d3.geoMercator()
			.center([-102, 23])
			.scale(1700)
			.translate([width / 2, height / 2]);

		let path = d3.geoPath().projection(projection);
		// let path = d3.geoPath();


		// Initializing SVG on the html element
		let svg = d3.select("#map").append("svg")
			.attr("width", width)
			.attr("height", height);

		svg.append("rect")
			.attr("class", "map-background")
			.attr("width", width)
			.attr("height", height)
			.on("click", reset);

		// Defining layers
		let gStates = svg.append("g")
			.style("stroke-width", "1.5px");

		let gMunicipalities = svg.append("g")
			.style("stroke-width", "1px");

		// "https://d3js.org/us-10m.v1.json"
		// Getting topojson data
		d3.json("../assets/mx_tj.json", (error, data) => {
			if (error) { console.log(error); }

			this.set('mapData', data);

			gStates.selectAll("path")
				.data(topojson.feature(data, data.objects.states).features)
				.enter().append("path")
				.attr("d", path)
				.attr("class", "feature")
				.on("click", clicked);

			// g.append("path")
			// 	.datum(topojson.mesh(data, data.objects.states, function(a, b) { return a !== b; }))
			// 	.attr("class", "mesh")
			// 	.attr("d", path);

			gStates.append("path")
				.datum(topojson.mesh(data, data.objects.states, function(a, b) { return a !== b; }))
				.attr("class", "mesh")
				.attr("d", path);
		});

		function clicked(d) {
			if (active.node() === this) {
				return reset();
			} else {
				gMunicipalities.selectAll("*").remove();	
			}
			
			active.classed("active", false);
			active = d3.select(this).classed("active", true);

			// Calculating scale by getting path bounds
			var bounds = path.bounds(d),
			dx = bounds[1][0] - bounds[0][0],
			dy = bounds[1][1] - bounds[0][1],
			x = (bounds[0][0] + bounds[1][0]) / 2,
			y = (bounds[0][1] + bounds[1][1]) / 2,
			scale = .9 / Math.max(dx / width, dy / height),
			translate = [width / 2 - scale * x, height / 2 - scale * y];

			// Zoom in transition
			gStates.transition()
			.duration(750)
			.style("stroke-width", 1.5 / scale + "px")
			.attr("transform", "translate(" + translate + ")scale(" + scale + ")");

			// Drawing selected states municipalities
			d3.json("../assets/mx_tj.json", (error, data) => {
				
				// Zoom in transition
				gMunicipalities.transition()
				.style("stroke-width", 1.5 / scale + "px")
				.attr("transform", "translate(" + translate + ")scale(" + scale + ")");

				// 
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

		function reset() {
			console.log("reset");
			active.classed("active", false);
			active = d3.select(null);

			// Zoom out transition
			gStates.transition()
			.duration(750)
			.style("stroke-width", "1.5px")
			.attr("transform", "");

			gMunicipalities.selectAll("*").remove();
		}

	}
});