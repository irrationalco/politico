import Ember from 'ember';
const { service } = Ember.inject;

export default Ember.Component.extend({
	session: service('session'),
	store: 	 service('store'),

	actions: {
		create() {
			console.log("Have to create a new user and save it;");
		}
	}

});

