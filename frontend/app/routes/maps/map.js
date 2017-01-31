import Ember from 'ember';

export default Ember.Route.extend({
	model(params) {
		return this.store.findRecord('map', params.map_id);
  	}
});