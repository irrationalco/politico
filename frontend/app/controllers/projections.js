import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['state', 'municipality', 'section'],
	state: "",
	municipality: "",
	section: "",

	stateCode: null,
	muniCode: null,

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
		setState(stateCode, stateName) {
			this.set('state', stateName);
			this.set('stateCode', stateCode);
		},

		setMunicipality(muniCode, muniName) {
			this.set('municipality', muniName);
			this.set('muniCode', muniCode)
		},

		setSection(sectionCode) {
			this.set('section', sectionCode);
		}
	}
});
