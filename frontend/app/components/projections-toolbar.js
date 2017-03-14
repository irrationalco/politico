import Ember from 'ember';

export default Ember.Component.extend({
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
		},

		setMunicipality() {
			this.sendAction('setMunicipality', this.get('municipality'));
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

