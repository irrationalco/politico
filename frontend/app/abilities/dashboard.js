import Ember from 'ember';
import {
  Ability
} from 'ember-can';

const {
  service
} = Ember.inject;

export default Ability.extend({
  session: service('session'),

  canViewManager: Ember.computed('session.currentUser', function () {
    const u = this.get('session.currentUser');
    return u.get('superadmin') || u.get('manager') || u.get('supervisor');
  })
});
