import Ember from 'ember';
import { Ability } from 'ember-can';

const { service } = Ember.inject;

export default Ability.extend({
	session: service('session'),

  canSee: Ember.computed('session.currentUser', function() {
    let u = this.get('session.currentUser');
    return (u.get('superadmin') || u.get('manager'));
  })
});


