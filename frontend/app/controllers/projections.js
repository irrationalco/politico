import Ember from 'ember';

const { isEmpty } = Ember;

export default Ember.Controller.extend({
	queryParams: ['state', 'municipality', 'section'],
	state: "",
	municipality: "",
	section: "",

	level: Ember.computed('state', 'municipality', 'section', function() {
		if (Ember.isEmpty(this.get('state'))) {
			return "country";
		} else if(this.get('state') && isEmpty(this.get('municipality')) && isEmpty(this.get('section'))) {
			return "state";
		} else if(this.get('state') && this.get('municipality') && isEmpty(this.get('section'))) {
			return "municipality";
		} else {
			return "section";
		}
	}),

	actions: {
		// Little hack to trigger didUpdateAttrs on map component, in order to reset zoom on same city (FIND BETTER SOLUTION)
		setState(stateName) {
			if (stateName === this.get('state')) {
				this.set('state', null);
				this.set('state', stateName);
			} else {
				this.set('state', stateName);	
			}
		},

		setMunicipality(muniName) {
			if (muniName === this.get('municipality')) {
				this.set('municipality', null);
				this.set('municipality', muniName);
			} else {
				this.set('municipality', muniName);	
			}
		},

		setSection(sectionCode) {
			if (sectionCode === this.get('section')) {
				this.set('section', null);
				this.set('section', sectionCode);
			} else {
				this.set('section', sectionCode);	
			}
		}
	}
});
