import Ember from 'ember';
import { task } from 'ember-concurrency';

const { isEmpty } = Ember;

export default Ember.Service.extend({
  totalSections: null,
  currentSection: null,
  sectionIds: null,
});