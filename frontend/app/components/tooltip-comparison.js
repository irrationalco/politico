import Ember from 'ember';

export default Ember.Component.extend({
	partiesManager: Ember.inject.service("parties")
});
