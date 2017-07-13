import Ember from 'ember';

export default Ember.Component.extend({

  cities: ["Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Coahuila de Zaragoza", 
  				 "Colima", "Chiapas", "Chihuahua", "Distrito Federal", "Durango", "Guanajuato", "Guerrero", "Hidalgo",
  				 "Jalisco", "México", "Michoacán de Ocampo", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", 
  				 "Querétaro", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala",
  				 "Veracruz de Ignacio de la Llave", "Zacatecas"],

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

