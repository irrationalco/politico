import Ember from 'ember';

export default Ember.Component.extend({
	tagName:'',
	showExpanded: false,

	actions: {
		expand() {
			this.set('showExpanded', true);
		},

		close() {
			this.set('showExpanded', false);
		}
	}
});

