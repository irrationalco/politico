import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const { isEmpty } = Ember;

export default Ember.Component.extend({

	store: Ember.inject.service(),

	voter: null,

	init() {
		this._super(...arguments);
		let voter = this.get('store').createRecord('voter');
		this.set('voter', voter);
	}
});
