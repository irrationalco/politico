import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		loadMore() {
			this.sendAction('action', this.get('infinityModel'));
		}
	}
});
