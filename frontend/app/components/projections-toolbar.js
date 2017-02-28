import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		setState() {
			this.sendAction('setState', "something else");
		},

		setSearchValue() {
			console.log(this.get('searchValue'));
		}
	}
});

