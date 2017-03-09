import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['state', 'municipality', 'section'],
	state: "",
	municipality: "",
	section: "",


	actions: {
		setState(state) {
			this.set('state', state);
		},

		setMunicipality(mun) {
			this.set('municipality', mun);
		},

		setSection(sec) {
			this.set('section', sec);
		}
	}
});
