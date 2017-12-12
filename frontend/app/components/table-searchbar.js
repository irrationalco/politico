//
// modelName: Mandatory parameter when using this component.

import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const { service } = Ember.inject;

export default Ember.Component.extend({

	store: service('store'),

	search: task(function * (query) {
		yield timeout(300);
		return yield this.get('store').query(this.get('modelName'), {q: query});
	}).restartable(),

	actions: {
		searchModel(query) {
			return this.get('search').perform(query);
		},

		selectObject() {
			console.log("Object selected");
		}
	}

});
