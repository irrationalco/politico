import Ember from 'ember';

export default Ember.Component.extend({
	chartData: {
		labels: ["M", "T", "W", "T", "F", "S", "S"],
		datasets: [{
			backgroundColor: [
			"#2ecc71",
			"#3498db",
			"#95a5a6",
			"#9b59b6",
			"#f1c40f",
			"#e74c3c",
			"#34495e"
			],
			data: [12, 19, 3, 17, 28, 24, 7]
		}]
	}
});
