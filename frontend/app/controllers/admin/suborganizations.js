import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Controller.extend({
	session: service('session'),
	ajax: 	 service('ajax'),
	notify:  service('notify'),
	store: 	 service('store'),

	actions: {
		deleteSuborg(suborgId) {
			this.get('store').findRecord('suborganization', suborgId, { backgroundReload: false }).then(suborganization => {
				suborganization.destroyRecord().then(() => {
					this.get('notify').alert("Deleted suborganization successfully.", { closeAfter: null});
				}, (err) => {
					console.log(err);
					this.get('notify').alert("Error deleting suborganization.", { closeAfter: null});
				});
			});
		},
	}
});