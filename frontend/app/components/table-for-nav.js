import Ember from 'ember';

export default Ember.Component.extend({

	showFilters: false,
	showQuickform: false,

	actions: {

		setShowFilters() {
			this.get('showFilters') ? this.set('showFilters', false) : this.set('showFilters', true);
		},

		setShowQuickform() {
			this.get('showQuickform') ? this.set('showQuickform', false) : this.set('showQuickform', true);
		}
	}
});
