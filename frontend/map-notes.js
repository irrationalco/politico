//NOTAS MAP COMPONENT

Center on Nuevo León
let center = projection([-99.8, 25.5]);

Draw Municipalities mesh
d3.json("../assets/mx_tj.json", (error, data) => {
	Ember.run.later(this, () => {
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

// Zoom in transition
gStates.transition()
.duration(750)
.style("stroke-width", 1.5 / transform.k + "px")
.attr("transform", transform);

// Zoom in transition
gMunicipalities.transition()
.style("stroke-width", 1.5 / transform.k + "px")
.attr("transform", transform);


Bounding Box Mexico
let mexicoBounds = [[-116.2, 12.87],[-88.15, 32.82]],
p0 = projection([mexicoBounds[0][0], mexicoBounds[1][1]]),
p1 = projection([mexicoBounds[1][0], mexicoBounds[0][1]]);

// Convert this to a scale k and translate tx, ty for the projection.
// For crisp image tiles, clamp to the nearest power of two.
let k = Math.floor(0.95 / Math.max((p1[0] - p0[0]) / width, (p1[1] - p0[1]) / height)),
tx = (width - k * (p1[0] + p0[0])) / 2,
ty = (height - k * (p1[1] + p0[1])) / 2;


Calculating scale by getting path bounds
let bounds = path.bounds(d),
dx = bounds[1][0] - bounds[0][0],
dy = bounds[1][1] - bounds[0][1],
x = (bounds[0][0] + bounds[1][0]) / 2,
y = (bounds[0][1] + bounds[1][1]) / 2,
scale = .9 / Math.max(dx / width, dy / height),
translate = [width / 2 - scale * x, height / 2 - scale * y];