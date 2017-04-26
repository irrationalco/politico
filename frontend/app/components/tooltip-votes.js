import Ember from 'ember';

export default Ember.Component.extend({
	sectionData: Ember.computed('hoveredSection', function() {
		if (this.get('hoveredSection') !== null) {
			let section = this.get('sectionsData').findBy('sectionCode', this.get('hoveredSection').section_code);
			return section;	
		} else {
			return null;
		}
	})
});