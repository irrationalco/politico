import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['state', 'municipality', 'section'],
	state: "test",
	municipality: "",
	section: "",


	actions: {
		setState(state) {
			this.set('state', state);
		}
	}
});
