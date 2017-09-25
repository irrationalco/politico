import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Controller.extend({
	session: service('session'),
	ajax: 	 service('ajax'),
	notify:  service('notify'),
	store: 	 service('store'),

	actions: {
		deleteOrg(orgId) {
			this.get('store').findRecord('organization', orgId, { backgroundReload: false }).then( organization => {
				organization.destroyRecord().then(() => {
					this.get('notify').alert("Deleted organization successfully.", { closeAfter: null});
				}, (error) => {
					this.get('notify').alert("Error deleting organization.", { closeAfter: null});
				});
			})
		},
	}
});