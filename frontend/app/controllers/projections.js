import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['state', 'municipality', 'section'],
	state: "",
	municipality: "",
	section: "",

	level: Ember.computed('state', 'municipality', 'section', function() {
		if (Ember.isEmpty(this.get('state'))) {
			return "country";
		} else if(this.get('state') && Ember.isEmpty(this.get('municipality')) && Ember.isEmpty(this.get('section'))) {
			return "state";
		} else if(this.get('state') && this.get('municipality') && Ember.isEmpty(this.get('section'))) {
			return "municipality";
		} else {
			return "section";
		}
	}),

	actions: {
		setState(stateName) {
			this.set('state', stateName);
		},

		setMunicipality(muniName) {
			this.set('municipality', muniName);
		},

		setSection(sectionCode) {
			this.set('section', sectionCode);
		}
	}
});
