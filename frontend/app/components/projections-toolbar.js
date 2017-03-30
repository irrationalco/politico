import Ember from 'ember';

export default Ember.Component.extend({

  	cities: ['Jalisco', 'Nuevo León', 'Nayarit', 'Tamaulipas', 'Coahuila de Zaragoza', 'Sinaloa', 'Zacatecas', 'Puebla', 'Campeche', 'Durango'],


  	// cities: [{name: '1', type:'Estado'}, {name: '2', type:'Estado'}, {name: 'Sinaloa', type:'Estado'}],

  	selectedCities: Ember.A(),

	municipalityDivision: Ember.computed('mapDivision', function() {
		if (this.get('mapDivision') === 'federal') {
			return false;
		} else {
			return true;
		}
	}),

	actions: {
		setCountry() {
			this.sendAction('setState', '');
			this.sendAction('setMunicipality', '');
			this.sendAction('setSection', '');
		},

		setState(state) {

			if (state) {
				this.sendAction('setState', state);
			} else {
				this.sendAction('setState', this.get('state'));	
			}
			
			this.sendAction('setMunicipality', '');
			this.sendAction('setSection', '');
			this.sendAction('setFederalDistrict', '');
		},

		setMunicipality() {
			this.sendAction('setMunicipality', this.get('municipality'));
			this.sendAction('setSection', '');
		},

		setFederalDistrict() {
			this.sendAction('setFederalDistrict', this.get('federalDistrict'));
			this.sendAction('setSection', '');
		},

		setSection() {
			this.sendAction('setSection', this.get('section'));
		},

		setSearchValue() {
			console.log(this.get('searchValue'));
		},

		chooseSelection(sel) {
			this.send('setState', sel[0]);
    	}
	}
});

