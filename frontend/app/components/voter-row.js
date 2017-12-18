import Ember from 'ember';

export default Ember.Component.extend({
	tagName:'',
	showExpanded: false,

	actions: {

		delete(objectId) {
			this.sendAction("deleteAction", objectId);
		},

		expand() {
			this.set('showExpanded', true);
		},

		close() {
			this.set('showExpanded', false);
		}
	}
});

