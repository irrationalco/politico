import Ember from 'ember';

export default Ember.Component.extend({

	actions: {
		setShowFlag() {
			this.get('showFlag') ? this.set('showFlag', false) : this.set('showFlag', true);
		}
	}
});
