import Ember from 'ember';

const { isEmpty } = Ember;

export default Ember.Controller.extend({

	partiesManager: Ember.inject.service('parties'),

	queryParams: ['state', 'municipality', 'section', 'federalDistrict', 'mapDivision',
				  'dataType', 'visualization', 'parties'],
	state: "",
	municipality: "",
	section: "",
	federalDistrict: "",
	mapDivision: "municipal",
	dataType: "votes",
	visualization: "normal",


	selectedParties: Ember.computed.oneWay('partiesManager.selectedParties'),
	hoveredSection: null,

	partiesChanged: Ember.observer('selectedParties.[]', function() {
		let selParties = this.get('selectedParties');
		if (selParties.length >= 3) {
			this.send('setVisualization', "normal");
		} else if(selParties.length === 2) {
			this.send('setVisualization', "comparison");
		} else {
			this.send('setVisualization', "single");
		}
	}),

	level: Ember.computed('state', 'municipality', 'section', 'federalDistrict', function() {
		if (Ember.isEmpty(this.get('state'))) {
			return "country";
		} else if(this.get('state') && isEmpty(this.get('municipality')) && isEmpty(this.get('federalDistrict')) && isEmpty(this.get('section'))) {
			return "state";
		} else if(this.get('state') && (this.get('municipality') || this.get('federalDistrict')) && isEmpty(this.get('section'))) {
			return "municipality";
		} else {
			return "section";
		}
	}),


	isMunicipal: Ember.computed('mapDivision', function() {
		if (this.get('mapDivision') === 'municipal') {
			return true;
		} else {
			return false;
		}
	}),

	isFederal: Ember.computed('mapDivision', function() {
		if (this.get('mapDivision') === 'federal') {
			return true;
		} else {
			return false;
		}
	}),

	isPopulation: Ember.computed('dataType', function() {
		if (this.get('dataType') === 'population') {
			return true;
		} else {
			return false;
		}
	}),

	isVotes: Ember.computed('dataType', function() {
		if (this.get('dataType') === 'votes') {
			return true;
		} else {
			return false;
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

		setFederalDistrict(districtCode) {
			if (districtCode === this.get('federalDistrict')) {
				this.set('federalDistrict', null);
				this.set('federalDistrict', districtCode);
			} else {
				this.set('federalDistrict', districtCode);	
			}
		},

		setSection(sectionCode) {
			if (sectionCode === this.get('section')) {
				this.set('section', null);
				this.set('section', sectionCode);
			} else {
				this.set('section', sectionCode);	
			}
		},

		setMapDivision(type) {
			this.set('mapDivision', type);
			this.set('section', "");
			this.set('federalDistrict', "");
			this.set('municipality', "");
		},

		setDataType(type) {
			this.set('dataType', type);
			this.set('section', "");
		},

		setVisualization(vis) {
			this.set('visualization', vis);
		},

		setHoveredSection(sec) {
			this.set('hoveredSection', sec);
		}
	}
});
