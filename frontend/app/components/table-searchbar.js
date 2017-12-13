import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

export default Ember.Component.extend({
	q: "",

	search: task(function * (query) {
		yield timeout(300);
		this.sendAction('setSearchQuery', query);
	}).restartable(),

	actions: {
		setSearchQuery() {
			return this.get('search').perform(this.get('q'));
		}
	}
});
