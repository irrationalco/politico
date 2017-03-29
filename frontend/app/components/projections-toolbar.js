import Ember from 'ember';

export default Ember.Component.extend({

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

		setState() {
			this.sendAction('setState', this.get('state'));
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
		}
	}
});

