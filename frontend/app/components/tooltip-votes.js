import Ember from 'ember';

export default Ember.Component.extend({

	color: "Red",

	parties: ["PRI", "PAN", "PRD", "Morena"],

	sectionData: Ember.computed('hoveredSection', function() {
		if (this.get('hoveredSection') !== null) {
			let section = this.get('sectionsData').findBy('sectionCode', this.get('hoveredSection').section_code);
			return section;
			this.findTopParties();
		} else {
			return null;
		}
	}),

	findTopParties() {
		this.get("parties").forEach(party => {
			console.log(this.get('sectionData')("PRI"));
		});
	}
});