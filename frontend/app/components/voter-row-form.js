import Ember from 'ember';
import { task, timeout} from 'ember-concurrency';

const { isEmpty } = Ember;

export default Ember.Component.extend({

	store: Ember.inject.service(),

	user: null,

	init() {
		let user = this.get('store').createRecord('user');
		this.set('user', user);
	}
});
