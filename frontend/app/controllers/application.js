import Ember from 'ember';

export default Ember.Controller.extend({
	session: Ember.inject.service('session'),
	sidebarOpen: true,

	actions: {
		toggleSidebar() {
			if (this.get('sidebarOpen')) {
				this.set('sidebarOpen', false);
			} else {
				this.set('sidebarOpen', true);
			}
		}
	} 
});
