import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({

	store: service('store'),

	actions: {
		searchModel(term) {
			return this.get('store').query(this.get('modelName'), {q: term});
		},

		selectObject() {
			console.log("Object selected");
		}
	}

});
